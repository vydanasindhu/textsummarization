import flask
from flask import Flask, jsonify, request
from flask_cors import CORS
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from collections import Counter
from sumy.parsers.plaintext import PlaintextParser
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.tokenizers import Tokenizer
from sumy.utils import get_stop_words
import math

app = Flask(__name__)
CORS(app)

# Post Processing techniques
def post_process_summary(summary):
    if not summary:
        return summary
    summary = summary\
        .replace('\xa0', ' ')\
            .strip('.,!?' )[0]\
                .upper() + summary[1:] + '.' if summary[-1] not in '.!?' \
                    else summary[0].upper() + summary[1:]   
    return summary

# Summarization algorithm using spacy
def summarize_using_spacy(text, number_of_sentences):
    nlp = spacy.load('en_core_web_md')
    doc= nlp(text)

    # Token Filtering
    keyword = []
    stopwords = list(STOP_WORDS)
    pos_tag = ['PROPN', 'ADJ', 'NOUN', 'VERB']
    for token in doc:
        if(token.text in stopwords or token.text in punctuation):
            continue
        if(token.pos_ in pos_tag):
            keyword.append(token.text)
    freq_word = Counter(keyword)

    # Normalization
    max_freq = Counter(keyword).most_common(1)[0][1]
    for word in freq_word.keys():  
            freq_word[word] = (freq_word[word]/max_freq)
    

    # Weighing Sentences
    sent_strength={}
    for sent in doc.sents:
        for word in sent:
            if word.text in freq_word.keys():
                if sent in sent_strength.keys():
                    sent_strength[sent]+=freq_word[word.text]
                else:
                    sent_strength[sent]=freq_word[word.text]

    summarized_sentences = nlargest(number_of_sentences, sent_strength, key=sent_strength.get)

    final_sentences = [ w.text for w in summarized_sentences ]
    summary = ' '.join(final_sentences)

    # Get top-5 tags
    tags = [tag for tag, _ in freq_word.most_common(5)]
    return post_process_summary(summary), tags

#Summarization using Sumy
def summarize_using_sumy(text, number_of_sentences):
    LANGUAGE = "english"
    parser = PlaintextParser.from_string(text, Tokenizer(LANGUAGE))
    summarizer = LsaSummarizer()
    summarizer.stop_words = get_stop_words(LANGUAGE)
    summarized_sentences = summarizer(parser.document, number_of_sentences)
    summary = ' '.join([str(sentence) for sentence in summarized_sentences])
    return post_process_summary(summary)

def ensemble_summarization(text, count, sumy_weight=0.8, spacy_weight=0.2):
    spacy_sentences =int(math.ceil(count * spacy_weight))
    sumy_sentences = count - spacy_sentences
    # Spacy summarizer
    spacy_summary, top_5_tags = summarize_using_spacy(text, spacy_sentences)
    # Sumy summarizer
    sumy_summary = summarize_using_sumy(text, sumy_sentences)

    combined_summary = sumy_summary + ' ' + spacy_summary
    return post_process_summary(combined_summary), top_5_tags


@app.route('/summarize', methods=['POST'])
def example_api():
    data = request.json
    message = data['message']
    numSentences = data.get('numSentences', 2)  # Get the number of sentences from the request data
    numSentences = max(1, int(numSentences))  # Ensure numSentences is at least 1
    summary, tags = ensemble_summarization(message, numSentences)  # Use the numSentences value when calling the summarize function
    response_data = {'summary': summary, 'tags': tags}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='localhost', port=8000)

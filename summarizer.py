import flask
from flask import Flask, jsonify, request
from flask_cors import CORS
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from collections import Counter
from newspaper import Article
   
def summarize(url, number_of_sentences):
    article = Article(url)
    article.download()
    article.parse()
    text = article.text
    nlp = spacy.load('en_core_web_sm')
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

    # String summarization
    summarized_sentences = nlargest(number_of_sentences, sent_strength, key=sent_strength.get)

    final_sentences = [ w.text for w in summarized_sentences ]
    summary = ' '.join(final_sentences)

    # Get top-5 tags
    tags = [tag for tag, _ in freq_word.most_common(5)]
    return summary, tags

app = Flask(__name__)
CORS(app)
@app.route('/summarize', methods=['POST'])
def example_api():
    data = request.json
    message = data['message']
    numSentences = data.get('numSentences', 2)  # Get the number of sentences from the request data
    numSentences = max(1, int(numSentences))  # Ensure numSentences is at least 1
    summary, tags = summarize(message, numSentences)  # Use the numSentences value when calling the summarize function
    response_data = {'summary': summary, 'tags': tags}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='localhost', port=8000)

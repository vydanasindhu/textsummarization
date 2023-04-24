import flask
from flask import Flask, jsonify, request
from flask_cors import CORS
from collections import Counter
import nltk
from nltk.corpus import stopwords
from transformers import pipeline
nltk.download('punkt')
nltk.download('stopwords')


def summary_text(message):
    summarizer = pipeline("summarization")
    summary = summarizer(message, max_length=100, min_length=20, do_sample=False)[0]['summary_text']
    return summary

def generate_tags(text, num_tags=5):
    # Tokenize the text into words
    words = nltk.word_tokenize(text.lower())
    
    
    # Remove stop words and punctuation
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalnum() and word not in stop_words]
    
    # Compute the frequency distribution of the remaining words
    freq_dist = nltk.FreqDist(words)
    
    # Select the top n tags by frequency of occurrence
    tags = [tag for tag, _ in freq_dist.most_common(num_tags)]
    return tags

app = Flask(__name__)
CORS(app)
@app.route('/summarize', methods=['POST'])
def example_api():
    data = request.json
    message = data['message']
    summary = summary_text(message)
    tags = generate_tags(message)
    response_data = {'summary': summary, 'tags': tags}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='localhost', port=8000)
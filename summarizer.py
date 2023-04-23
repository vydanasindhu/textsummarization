import flask
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/summarize', methods=['POST'])
def example_api():
    data = request.json
    message = data['message']
    response_data = {'response': f'Hello, client! You said: "{message}"'}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='localhost', port=8000)
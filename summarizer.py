import flask
from flask import Flask, jsonify, request, Blueprint

app = Flask(__name__)
api_bp = Blueprint('api', __name__, url_prefix='/text-summarization')

@api_bp.route('/summarize', methods=['POST'])
def summarize():
    print("Coming here")
    text = request.json['text'] 
    summary = "This is a summary of the text."
    response = {'summary': summary}
    return jsonify(response)

app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
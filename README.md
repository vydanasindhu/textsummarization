
# Text Summarization

Implementation of a text summarization tool to help users quickly identify and understand the main points of a document without having to read through the entire document. The tool will be available as a web extension.

## Major Functions
**Text summarization**: Taking a long article or text document linked to the web page and generating a summary that captures the main points of document.

**Customization**: Altering the length of the summary generated.

**Topic Tag generation**: Analyzing the document and generating relevant tags and keywords that reflect the main topics covered in the document.

**Sentiment Analysis**: Analysis of the author’s sentiment in the document.

**Citation generation**: Generate citation for the document.

**Translation**: Translation of the summary in 8 different languages.

## Clone Project Repo
```
git clone https://github.com/vydanasindhu/textsummarization.git
```

## Run the application

### Create virtual env

Install virtualenv & activate the environment
```
pip3 install virtualenv
virtualenv venv
source venv/bin/activate
```

### Install requirements

```
pip3 install -r requirements.txt
```

### Run Python server
```
python summarizer.py
```

### if  certificate verification error (CERTIFICATE_VERIFY_FAILED)arises while using the tool use the following command:

```
/Applications/Python\ 3.x/Install\ Certificates.command
```
Replace "3.x" with the version number of Python you are using (e.g., 3.7, 3.8, 3.9).


### Deactivate Environment 

Deactivate virtualenv after using
```
deactivate
```







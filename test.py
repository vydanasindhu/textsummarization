
# Import the Summarizer from bert-extractive-summarizer
from summarizer import Summarizer

# Read the content of the file 'test.txt' and store it in the 'document' variable
with open('test.txt', 'r') as file:
    document = file.read()

# Initialize the BERT summarizer
bert_model = Summarizer()

# Generate summary
summary = bert_model(document, ratio=0.2)

print("Summary:")
print(summary)

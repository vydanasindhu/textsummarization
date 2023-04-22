class SimpleSummarizer {
    static tokenize(text) {
      return text.replace(/[^\w\s]/g, "").toLowerCase().split(/\s+/);
    }
  
    static getMostFrequentWords(tokens, count) {
      const wordFrequency = {};
  
      tokens.forEach((word) => {
        if (wordFrequency[word]) {
          wordFrequency[word]++;
        } else {
          wordFrequency[word] = 1;
        }
      });
  
      return Object.keys(wordFrequency)
        .sort((a, b) => wordFrequency[b] - wordFrequency[a])
        .slice(0, count);
    }
  
    static summarize(text, wordCount = 5) {
      const tokens = SimpleSummarizer.tokenize(text);
      const mostFrequentWords = SimpleSummarizer.getMostFrequentWords(
        tokens,
        wordCount
      );
      const sentences = text.split(/[.?!]\s+/);
      const summary = sentences
        .filter((sentence) => {
          const sentenceTokens = SimpleSummarizer.tokenize(sentence);
          return mostFrequentWords.some((word) => sentenceTokens.includes(word));
        })
        .join(" ");
  
      return summary;
    }
  }
  
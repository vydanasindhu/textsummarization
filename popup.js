document.addEventListener("DOMContentLoaded", () => {
    const summarizeButton = document.getElementById("summarize");
    const summaryContainer = document.getElementById("summary");
    summarizePython()
    summarizeButton.addEventListener("click", async () => {
      const activeTab = await getActiveTab();
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: summarizePython,
        },
        (result) => {
          summaryContainer.innerText = result[0].result;
        }
      );
    });
  });
  
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  
  function summarize() {
    const articleText = extractArticleText();
    const summary = SimpleSummarizer.summarize(articleText);
    return summary;
  }
  
  function extractArticleText() {
    const articleElement = document.querySelector("article") || document.body;
    return articleElement.innerText;
  }

  // TODO: Change function name
  function summarizePython() {
    const data = { message: "Hello, server!" };
    fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("summary").innerHTML = data['response']
    })
    .catch(error => console.error(error));
  }
  
  
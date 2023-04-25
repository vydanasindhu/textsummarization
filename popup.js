document.addEventListener("DOMContentLoaded", () => {
    const summarizeButton = document.getElementById("summarize");
    const summaryContainer = document.getElementById("summary");
    const tagContainer = document.getElementById("tags");
    summarizeButton.addEventListener("click", async () => {
      const activeTab = await getActiveTab();
      const result = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: summarizePython,
      });
      summaryContainer.innerText = result[0].result["summary"];
      tagContainer.innerText = result[0].result["tags"];
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

  async function summarizePython() {
    const articleText = document.querySelector("article") || document.body;
    const message = articleText.innerText
    const data = { message: message};
    try {
      const response = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8",
        "Accept-Charset": "utf-8" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  
  
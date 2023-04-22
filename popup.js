document.addEventListener("DOMContentLoaded", () => {
    const summarizeButton = document.getElementById("summarize");
    const summaryContainer = document.getElementById("summary");
  
    summarizeButton.addEventListener("click", async () => {
      const activeTab = await getActiveTab();
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: summarize,
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
  
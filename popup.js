document.addEventListener("DOMContentLoaded", () => {
  const summarizeButton = document.getElementById("summarize");
  const summaryContainer = document.getElementById("summary");
  const tagContainer = document.getElementById("tags");
  const numSentencesInput = document.getElementById("num-sentences");

  summarizeButton.addEventListener("click", async () => {
    const activeTab = await getActiveTab();
    const numSentences = numSentencesInput.value;
    const result = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: summarizePython,
      args: [numSentences], 
    });
    if (result[0].result) {
      summaryContainer.innerText = result[0].result["summary"] || "";
      tagContainer.innerText = result[0].result["tags"] || "";
    } else {
      summaryContainer.innerText = "Summary not available";
      tagContainer.innerText = "Tags not available";
    }
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

async function summarizePython(numSentences) { 
  const articleText = document.querySelector("article") || document.body;
  const message = articleText.innerText;
  const data = { message: message, numSentences: numSentences }; 
  try {
    const response = await fetch("http://localhost:8000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Charset": "utf-8"
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

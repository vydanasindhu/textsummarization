document.addEventListener("DOMContentLoaded", () => {
  const summarizeButton = document.getElementById("summarize");
  const summaryContainer = document.getElementById("summary");
  const tagContainer = document.getElementById("tags");
  const numSentencesInput = document.getElementById("num-sentences");

  summarizeButton.addEventListener("click", async () => {
    const activeTab = await getActiveTab();
    const numSentences = numSentencesInput.value;
    summaryContainer.innerText = ""
    const loadingIcon = document.getElementById("loading-icon");
    loadingIcon.style.display = "inline-block";
    const result = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: summarize,
      args: [numSentences], 
    });
    loadingIcon.style.display = "none";
    if (result[0].result) {
      summaryContainer.innerText = result[0].result["summary"] || "Summary not available";
      tagContainer.innerHTML = "";
      const tags = result[0].result["tags"] || [];
      if (tags.length == 0) {
        tagContainer.innerHTML = "Tags not available"
      }
      tags.forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerText = tag;
        tagContainer.appendChild(chip);
      });
      // DISPLAY SENTIMENT & SUBJECTIVITY
      // TODO: result[0].result["sentiment"] = 1 -> positive  = 0 -> neutral  = -1 -> negative 
      // TODO: result[0].result["subjectivity"] = 1 -> objective  = 0 -> neutral  = -1 -> subjective
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

async function summarize(numSentences) { 
  const message = window.location.href;
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

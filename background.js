function handleInstall() {
    console.log("The extension has been installed.");
    chrome.storage.local.set({ autolingo_enabled: true });
}

function handleStorage(changes, namespace) {
    if (!changes["autolingo_enabled"]) return false;

    let isEnabled = Boolean(changes.autolingo_enabled.newValue);
    chrome.action.setBadgeText({ text: isEnabled ? "✓" : "X" });
    chrome.action.setBadgeBackgroundColor({ color: isEnabled ? "#008000" : "#EC5053" });
}

chrome.storage.onChanged.addListener(handleStorage);
chrome.runtime.onInstalled.addListener(handleInstall);
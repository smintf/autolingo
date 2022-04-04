var enabled;

const set_badge = (is_enabled) => {
  chrome.action.setBadgeText({ text: is_enabled ? "✓" : "X" });
  chrome.action.setBadgeBackgroundColor({
    color: is_enabled ? "green" : "#EC5053",
  });
};

// check if the extension is enabled and set the badge accordingly
setInterval(() => {
  chrome.storage.local.get("autolingo_enabled", (response) => {
    set_badge(Boolean(response["autolingo_enabled"]));
  });
}, 5);

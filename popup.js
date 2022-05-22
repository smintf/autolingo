var enabled = false;

const update_slider = (
  node_id,
  text_id,
  enabled_text,
  disabled_text,
  value
) => {
  const input_switch = document.getElementById(node_id);
  const text_elem = document.getElementById(text_id);

  if (value) {
    text_elem.innerText = enabled_text;
    input_switch.checked = true;
  } else {
    text_elem.innerText = disabled_text;
    input_switch.checked = false;
  }
};

const update_enabled_slider = (value) => {
  update_slider(
    "toggle-enabled-input",
    "toggle-enabled-text",
    "Enabled",
    "Disabled",
    value
  );
};

const reload_all_duolingo_tabs = () => {
  chrome.windows.getAll(
    {
      populate: true,
      windowTypes: ["normal", "panel", "popup"],
    },
    (windows) => {
      windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          if (tab.url.includes("https://www.duolingo.com")) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
    }
  );
};

const resize_duolingo_tab = () => {
  chrome.windows.getAll(
    {
      populate: true,
      windowTypes: ["normal", "panel", "popup"],
    },
    (windows) => {
      windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          if (tab.url.includes("https://www.duolingo.com")) {
            chrome.tabs.reload(tab.id);
            chrome.tabs.Tab.height = 500
            chrome.tabs.Tab.width = 500
          }
        });
      });
    }
  );
};

const toggle_extension_enabled = () => {
  enabled = !enabled;
  chrome.storage.local.set({ autolingo_enabled: enabled });
  update_enabled_slider(enabled);
  reload_all_duolingo_tabs();
};

const send_event = (actionType) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: actionType });
  });
};

const solve_challenge = () => {
  send_event("solve_challenge");
};

const solve_skip_challenge = () => {
  send_event("solve_skip_challenge");
};

const autocomplete_lesson = () => {
  send_event("autocomplete_lesson");
};

const render_content = () => {
  // get content div
  let content_div = document.getElementById("content");

  content_div.innerHTML = `
        <div class="slider-container content-row">
            <label class="autolingo-switch">
                <input id="toggle-enabled-input" type="checkbox">
                <span class="autolingo-slider"></span>
            </label>
            <div id="toggle-enabled-text">Disabled</div>
        </div>
        <div class="solve-skip-container content-row">
            <button id="solve-skip-button" class="row-button" title="Ctrl+Enter">Solve & Skip</button>
        </div>
        <div class="solve-container content-row">
            <button id="solve-button" class="row-button" title="Alt+Enter">Solve</button>
        </div>
        <div class="auto-container content-row">
            <button id="auto-button" class="row-button" title="Alt+D">Autocomplete</button>
        </div>
    `;

  document.getElementById("toggle-enabled-input").onclick =
    toggle_extension_enabled;
  update_enabled_slider(enabled);

  document.getElementById("solve-button").onclick = solve_challenge;
  document.getElementById("solve-skip-button").onclick = solve_skip_challenge;
  document.getElementById("auto-button").onclick = autocomplete_lesson;
};

document.addEventListener("DOMContentLoaded", () => {
  // load if the extension was enabled from the cache
  chrome.storage.local.get("autolingo_enabled", (response) => {
    let autolingo_enabled = response["autolingo_enabled"];
    enabled = Boolean(autolingo_enabled);
    render_content();
  });
});

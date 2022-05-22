import ReactUtils from "./ReactUtils.js";
import DuolingoSkill from "./DuolingoSkill.js";
import DuolingoChallenge from "./DuolingoChallenge.js";

const DEBUG = false;

// append an iframe so we can re-enable console.log
// using its console.logger
const frame = document.createElement("iframe");
frame.style.display = "none";
document.body.appendChild(frame);

// if DEBUG, re-enable console.log as console.logger
const welcome_message = "Autolingo has successfully loaded!";
if (DEBUG) {
  console.logger = (...content) => {
    frame.contentWindow.console.log(...content);
  };
} else {
  console.logger = () => {};
}

// print our welcome message regardless
frame.contentWindow.console.log(welcome_message);

// if the user changes the language, re-inject
let previous_language = null;
let previous_url = null;
setInterval(() => {
  // get the current language from the page
  const page_data = new ReactUtils().ReactFiber(
    document.querySelector("._3BJQ_")
  )?.return?.stateNode?.props;
  const current_language = page_data?.courses?.find((e) => {
    return e.isCurrent;
  })?.learningLanguageId;

  // get current url
  const current_url = document.location.href;

  // DEBUG INFO
  //console.logger("Language Watch:", previous_language, current_language);
  //console.logger("URL Watch:", previous_url, current_url);

  // if the language changed, we know we just loaded the home page
  if (previous_language !== current_language || previous_url !== current_url) {
    inject_autolingo();
    //    window.location.reload();
    previous_language = current_language;
    previous_url = current_url;
  }
}, 100);

let stylesheet_loaded = false;
let the_extension_id = null;
// inject stylesheet, buttons, etc.
const inject = (extension_id) => {
  the_extension_id = extension_id;
  // inject stylesheet
  let stylesheet = document.createElement("LINK");
  stylesheet.setAttribute("rel", "stylesheet");
  stylesheet.setAttribute("type", "text/css");
  stylesheet.setAttribute(
    "href",
    `${the_extension_id}/content_scripts/main.css`
  );
  document.body.appendChild(stylesheet);
  stylesheet.onload = () => {
    stylesheet_loaded = true;
  };

  // solve the current challenge when the user clicks
  // the corresponding button in the popup
  document.addEventListener("solve_challenge", () => {
    const challenge = new DuolingoChallenge();
    challenge.solve();
    //        challenge.click_next();
  });

  // solve the challenge and go to the next challenge
  // when the user clicks the corresponding button in the popup
  document.addEventListener("solve_skip_challenge", () => {
    const challenge = new DuolingoChallenge();
    challenge.solve();
    challenge.click_next();
    //    challenge.click_next();
  });

  // autocompletes the current lesson
  // when the user clicks the corresponding button in the popup
  document.addEventListener("autocomplete_lesson", () => {
    let autocomplete = new DuolingoSkill();
    autocomplete.startf();
  });
};

const inject_autolingo = () => {
  console.logger(stylesheet_loaded, the_extension_id);
  const i = setInterval(() => {
    if (stylesheet_loaded && the_extension_id) {
      clearInterval(i);

      const gold_img_url = `${the_extension_id}/images/gold_league.svg`;
      const tier_img_url = `${the_extension_id}/images/diamond_league.svg`;
      const legendary_img_url = `${the_extension_id}/images/legendary.svg`;

      // iterate over all practice nodes
      let practice_node = document.querySelector(
        "[data-test='global-practice']"
      );
      let autolingo_practice_container = document.createElement("DIV");
      autolingo_practice_container.className =
        "start-autolingo-practice-container";
      let autolingo_practice_tooltip = document.createElement("DIV");
      autolingo_practice_tooltip.className = "tooltip-p";
      let autolingo_practice = document.createElement("IMG");
      autolingo_practice.src = tier_img_url;
      autolingo_practice.className = "autolingo-practice";
      // on click, final the lesson and let the extension know it's time to autocomplete
      autolingo_practice.onclick = () => {
        let dp = new DuolingoSkill();
        dp.startf();
      };
      // show tooltip when hovering over the auto-lesson buttons
      let practice_autolingo_tooltip_text = document.createElement("SPAN");
      //  practice_autolingo_tooltip_text.innerHTML =
      //    "Autocomplete <strong>practice test</strong> with Autolingo.";
      practice_autolingo_tooltip_text.className = "tooltip-text-p";

      // append nodes to eachother
      autolingo_practice_tooltip.appendChild(practice_autolingo_tooltip_text);
      autolingo_practice_tooltip.appendChild(autolingo_practice);
      autolingo_practice_container.appendChild(autolingo_practice_tooltip);

      // iterate over all skill nodes
      let all_skill_nodes = document.querySelectorAll("[data-test='skill']");
      console.logger("Skill Nodes:", all_skill_nodes);
      all_skill_nodes.forEach((skill_node) => {
        // find the name of each skill node
        const skill_name_node = skill_node.children[0].children[0].children[1];

        // get skill metadata
        const skill_metadata = new ReactUtils().ReactFiber(skill_name_node)
          .return.pendingProps.skill;

        //        console.logger("Skill Metadata:", skill_metadata);
        // only add these buttons to unlocked lessons
        const unlocked = skill_metadata.accessible;
        const legendary_level_unlocked =
          skill_metadata.hasFinalLevel &&
          skill_metadata.finishedLevels === skill_metadata.levels - 1;
        if (unlocked) {
          // add start skill button with tooltip to a container DIV
          let autolingo_skill_container = document.createElement("DIV");
          autolingo_skill_container.className =
            "start-autolingo-skill-container";

          if (legendary_level_unlocked) {
            let final_autolingo_skill_tooltip = document.createElement("DIV");
            final_autolingo_skill_tooltip.className = "tooltip";
            let final_autolingo_skill = document.createElement("IMG");
            final_autolingo_skill.src = legendary_img_url;
            final_autolingo_skill.className = "final-autolingo-skill";

            // on click, final the lesson and let the extension know it's time to autocomplete
            final_autolingo_skill.onclick = () => {
              let ds = new DuolingoSkill(skill_node);
              ds.start(
                "[class*='_3HhhB _2NolF _275sd _1ZefG _26hHl _1eyFy _26QYy']",
                true
              );
            };

            // show tooltip when hovering over the auto-lesson buttons
            let final_autolingo_tooltip_text = document.createElement("SPAN");
            final_autolingo_tooltip_text.innerHTML =
              "Autocomplete <strong>legendary lesson</strong> with Autolingo.";
            final_autolingo_tooltip_text.className = "tooltip-text";

            // append nodes to eachother
            final_autolingo_skill_tooltip.appendChild(
              final_autolingo_tooltip_text
            );
            final_autolingo_skill_tooltip.appendChild(final_autolingo_skill);
            autolingo_skill_container.appendChild(
              final_autolingo_skill_tooltip
            );
          }

          let start_autolingo_skill_tooltip = document.createElement("DIV");
          start_autolingo_skill_tooltip.className = "tooltip";

          // append a lil button to each skill
          // when clicked, this button starts an auto-lesson
          let start_autolingo_skill = document.createElement("IMG");
          start_autolingo_skill.src = tier_img_url;
          start_autolingo_skill.className = "start-autolingo-skill";

          // on click, start the lesson and let the extension know it's time to autocomplete
          start_autolingo_skill.onclick = () => {
            let ds = new DuolingoSkill(skill_node);
            ds.start("[data-test='start-button']", false);
          };

          // show tooltip when hovering over the auto-lesson buttons
          let start_autolingo_tooltip_text = document.createElement("SPAN");
          start_autolingo_tooltip_text.innerHTML =
            "Autocomplete <strong>lesson</strong> with Autolingo.";
          start_autolingo_tooltip_text.className = "tooltip-text";

          // append nodes to eachother
          start_autolingo_skill_tooltip.appendChild(
            start_autolingo_tooltip_text
          );
          start_autolingo_skill_tooltip.appendChild(start_autolingo_skill);
          autolingo_skill_container.appendChild(start_autolingo_skill_tooltip);
          skill_node.appendChild(autolingo_skill_container);
          practice_node.appendChild(autolingo_practice_container);

          // key elm
          if (legendary_level_unlocked == false) {
            let key_autolingo_skill_tooltip = document.createElement("DIV");
            key_autolingo_skill_tooltip.className = "tooltip";
            let key_autolingo_skill = document.createElement("IMG");
            key_autolingo_skill.src = gold_img_url;
            key_autolingo_skill.className = "key-autolingo-skill";

            // on click, start the lesson and let the extension know it's time to autocomplete
            key_autolingo_skill.onclick = () => {
              let ds = new DuolingoSkill(skill_node);
              ds.start("[data-test='test-out-button']", false);
            };

            // show tooltip when hovering over the auto-lesson buttons
            let key_autolingo_tooltip_text = document.createElement("SPAN");
            key_autolingo_tooltip_text.innerHTML =
              "Autocomplete <strong>jump lesson</strong> with Autolingo.";
            key_autolingo_tooltip_text.className = "tooltip-text";

            // append nodes to eachother
            key_autolingo_skill_tooltip.appendChild(key_autolingo_tooltip_text);
            key_autolingo_skill_tooltip.appendChild(key_autolingo_skill);
            autolingo_skill_container.appendChild(key_autolingo_skill_tooltip);
            //          skill_node.appendChild(autolingo_skill_container);
          }
        }
      });

      // iterate over all checkpoint nodes
      let all_checkpoint_nodes = document.querySelectorAll(
        "[data-test='checkpoint-badge']"
      );
      console.logger("Checkpoint Nodes:", all_checkpoint_nodes);
      all_checkpoint_nodes.forEach((checkpoint_node) => {
        // get skill metadata
        const checkpoint_status = new ReactUtils().ReactFiber(checkpoint_node)
          .return.pendingProps.checkpointStatus;

        // add start skill button with tooltip to a container DIV
        let autolingo_checkpoint_container = document.createElement("DIV");
        autolingo_checkpoint_container.className =
          "start-autolingo-skill-container";

        let start_autolingo_checkpoint_tooltip = document.createElement("DIV");
        start_autolingo_checkpoint_tooltip.className = "tooltip";

        // append a lil button to each skill
        // when clicked, this button starts an auto-lesson
        let start_autolingo_checkpoint = document.createElement("IMG");
        start_autolingo_checkpoint.src = tier_img_url;
        start_autolingo_checkpoint.className = "start-autolingo-skill";

        // on click, start the lesson and let the extension know it's time to autocomplete
        start_autolingo_checkpoint.onclick = () => {
          let ds = new DuolingoSkill(checkpoint_node);

          // status of 2 means it hasn't been completed, 3 means completed
          const start_checkpoint_button_selector =
            checkpoint_status == 3
              ? "checkpoint-practice-button"
              : "checkpoint-start-button";

          // start state machine
          ds.start(`[data-test='${start_checkpoint_button_selector}']`, false);
        };

        // show tooltip when hovering over the auto-lesson buttons
        let start_autolingo_checkpoint_tooltip_text =
          document.createElement("SPAN");
        start_autolingo_checkpoint_tooltip_text.innerHTML =
          "Autocomplete <strong>checkpoint</strong> with Autolingo.";
        start_autolingo_checkpoint_tooltip_text.className = "tooltip-text";

        // append nodes to eachother
        start_autolingo_checkpoint_tooltip.appendChild(
          start_autolingo_checkpoint_tooltip_text
        );
        start_autolingo_checkpoint_tooltip.appendChild(
          start_autolingo_checkpoint
        );
        autolingo_checkpoint_container.appendChild(
          start_autolingo_checkpoint_tooltip
        );

        // appending to the parent's parent because that's the
        // only way to get it to be on top so the user can interact with it
        checkpoint_node.parentElement.parentElement.appendChild(
          autolingo_checkpoint_container
        );
      });

      // add our custom hotkeys
      set_hotkeys();
    }
  });
};

const set_hotkeys = () => {
  console.logger("Hotkeys have been registered");
  document.addEventListener("keydown", (e) => {
    // If platform is Windows
    if (navigator.userAgentData.platform == "Windows") {
      if (e.key === "Enter" && e.ctrlKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
        challenge.click_next();
      }
      if (e.key === "Enter" && e.altKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
      }
      if (e.key === "s" && e.altKey) {
        document.querySelector("[data-test='player-skip']")?.click();
      }
      if (e.key === "d" && e.altKey) {
        let ds = new DuolingoSkill();
        ds.startf();
      }
    }
    // If platform is macOS
    if (navigator.userAgentData.platform == "macOS") {
      // if (e.key === "Enter" && e.ctrlKey || e.metaKey) {
      if (e.key === "Enter" && e.ctrlKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
        challenge.click_next();
      }
      if (e.key === "Enter" && e.altKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
      }
      if (e.key === "s" && e.altKey) {
        document.querySelector("[data-test='player-skip']")?.click();
      }
      if (e.key === "d" && e.altKey) {
        let ds = new DuolingoSkill();
        ds.startf();
      }
    }
    // If platform is Linux
    if (navigator.userAgentData.platform == "Linux") {
      if (e.key === "Enter" && e.ctrlKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
        challenge.click_next();
      }
      if (e.key === "Enter" && e.altKey) {
        const challenge = new DuolingoChallenge();
        challenge.solve();
      }
      if (e.key === "s" && e.altKey) {
        document.querySelector("[data-test='player-skip']")?.click();
      }
      if (e.key === "d" && e.altKey) {
        let ds = new DuolingoSkill();
        ds.startf();
      }
    }
  });
};

// get chrome extension's ID
document.addEventListener("extension_id", (e) => {
  const extension_id = `chrome-extension://${e.detail.data}`;

  // inject when we have the extension's ID
  inject(extension_id);
});

// ask for the chrome extension's ID
window.dispatchEvent(new CustomEvent("get_extension_id", { detail: null }));

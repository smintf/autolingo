import DuolingoChallenge from "./DuolingoChallenge.js";
import ReactUtils from "./ReactUtils.js";

export default class DuolingoPractice extends ReactUtils {
  constructor() {
    super();
  }

  start = () => {
    document.querySelector(global-practice)?.click();
    setTimeout(() => {
      this.state_machine = setInterval(this.complete_challenge, 10);
    }, 1000);
  };

  end() {
    clearInterval(this.state_machine);
    this.current_challenge.end();
    console.logger("Lesson complete, stopping the autocompleter!");
  }

  complete_challenge = () => {
    if (window.location.href.includes("duolingo.com/learn")) {
      this.end();
      return;
    }

    const status_node = document.getElementsByClassName("mQ0GW")[0];
    if (!status_node) {
      console.logger("can't find status node!");
      return;
    }

    const status =
      this.ReactFiber(status_node).return.return.stateNode.props.player.status;

    console.logger(status);
    switch (status) {
      case "LOADING":
        break;
      case "SKILL_PRACTICE_SPLASH":
      case "CHECKPOINT_TEST_SPLASH":
      case "FINAL_LEVEL_DUO":
        this.current_challenge = new DuolingoChallenge();
        this.current_challenge.click_next();
        break;
      case "SKILL_TEST_SPLASH":
      case "GLOBAL_PRACTICE_SPLASH":
        this.current_challenge = new DuolingoChallenge();
        this.current_challenge.click_next();
        break;
      case "GUESSING":
        this.current_challenge = new DuolingoChallenge();
        try {
          this.current_challenge.solve();
        } catch (error) {
          console.logger(error);
        }
        this.current_challenge.click_next();
        this.current_challenge.click_next();
        break;
      case "SHOWING":
        break;
      case "GRADING":
        break;
      case "BLAMING":
        break;
      case "SLIDING":
      case "PARTIAL_XP_DUO_SLIDING":
        break;
      case "COACH_DUO_SLIDING":
      case "HARD_MODE_DUO_SLIDING":
        break;
      case "DOACH_DUO":
      case "COACH_DUO":
      case "HARD_MODE_DUO":
      case "PARTIAL_XP_DUO":
        this.current_challenge = new DuolingoChallenge();
        this.current_challenge.click_next();
        break;
      case "COACH_DUO_SUBMITTING":
      case "SUBMITTING":
        break;
      case "END_CAROUSEL":
        if (this.is_final_level) {
          (
            document.querySelector('[data-test="cta-button"]') ||
            document.querySelector('[data-test="continue-final-level"]')
          )?.click();
        } else {
          this.current_challenge = new DuolingoChallenge();
          this.current_challenge.click_next();
          this.current_challenge.click_next();
          this.current_challenge.click_next();
        }
        break;
      case "PLUS_AD":
        this.current_challenge = new DuolingoChallenge();
        this.current_challenge.click_next();
        break;
      case "PRE_LESSON_TIP_SPLASH":
      case "GRAMMAR_SKILL_SPLASH":
        document.querySelector("[data-test=player-next]")?.click();
        Array.from(document.querySelectorAll("span")).forEach((e) => {
          if (e.innerText.toLowerCase().includes("start lesson")) {
            e?.click();
          }
        });
        break;
      default:
        alert("UNKNOWN STATUS: " + status);
        this.end();
        break;
    }
  };
}

import { createOptions } from "./createOptions.js";

const optionsWrapper = document.getElementById("options-wrapper");
const body = document.body;
const eye = document.getElementById("eyeSvg");

let clearTimer;

function scheduleClear() {
  clearTimeout(clearTimer);
  // match the wrapper fade-out duration in style.css
  clearTimer = setTimeout(() => {
    optionsWrapper.innerHTML = "";
  }, 100);
}

window.addEventListener("message", (event) => {
  switch (event.data.event) {
    case "visible": {
      optionsWrapper.innerHTML = "";
      body.style.visibility = event.data.state ? "visible" : "hidden";
      eye.classList.remove("eye-hover");
      optionsWrapper.classList.remove("visible");
      if (!event.data.state) {
        clearTimeout(clearTimer);
        optionsWrapper.innerHTML = "";
      }
      return;
    }

    case "leftTarget": {
      eye.classList.remove("eye-hover");
      optionsWrapper.classList.remove("visible");
      scheduleClear();
      return;
    }

    case "setTarget": {
      clearTimeout(clearTimer);
      optionsWrapper.innerHTML = "";
      eye.classList.add("eye-hover");

      if (event.data.options) {
        for (const type in event.data.options) {
          event.data.options[type].forEach((data, id) => {
            createOptions(type, data, id + 1);
          });
        }
      }

      if (event.data.zones) {
        for (let i = 0; i < event.data.zones.length; i++) {
          event.data.zones[i].forEach((data, id) => {
            createOptions("zones", data, id + 1, i + 1);
          });
        }
      }

      // trigger fade-in on the next frame so the transition runs
      requestAnimationFrame(() => {
        optionsWrapper.classList.add("visible");
      });
    }
  }
});

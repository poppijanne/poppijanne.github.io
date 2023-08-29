let reportTime = false;
let eventToBeAdded = undefined;
let currentTexture = 0;
let fps = 0;

// Used in fragment shader
let kickCounter = 0;

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "1":
      eventToBeAdded = {
        type: EVENT_TYPES.CAMERA,
        params: { index: 0 },
      };
      break;
    case "2":
      eventToBeAdded = {
        type: EVENT_TYPES.CAMERA,
        params: { index: 1 },
      };
      break;
    case "3":
      eventToBeAdded = {
        type: EVENT_TYPES.CAMERA,
        params: { index: 2 },
      };
      break;
    case "k":
      eventToBeAdded = {
        type: EVENT_TYPES.BEAT,
      };
      break;
    case "t":
      console.log(JSON.stringify(timeline.events));
    default:
      break;
  }
});

const loadTime = Date.now();

let timeline = new Timeline(timelineEvents);

let startTime = 0;

function main({ musicEnabled, clearEffects, showTextures, showEvents }) {
  let y = 0;
  startTime = Date.now() - loadTime;

  if (clearEffects === true) {
    timeline = new Timeline([
      {
        id: "init-canvas",
        type: EVENT_TYPES.CLASSNAME,
        start: 0,
        params: { id: "webgl-canvas", className: "reset" },
      },
    ]);
  }

  const debugTimeElement = document.getElementById("debug-time");
  const debugOutputElement = document.getElementById("debug-output");
  const fpsOutputElement = document.getElementById("debug-fps");
  const deltaOutputElement = document.getElementById("debug-delta");
  const audio = document.getElementById("music");
  const bodyElement = document.querySelector("body");

  document.getElementById(
    "debug-events-show-only-current-events-checkbox"
  ).onclick = (event) => {
    renderEvents(timeline);
  };

  bodyElement.style.height = window.innerHeight + "px";
  bodyElement.style.width = window.innerWidth + "px";

  let past = 0;
  let currentTextId = "";

  if (showEvents) {
    renderEvents(timeline, 0);
  }

  const canvas = document.querySelector("#webgl-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const renderer = new EffectRenderer(
    [
      new FloppyEffect({
        id: "floppy",
        display: false,
        canvas: canvas,
        resolution: 2,
      }),
    ],
    canvas
  );

  function render(now) {
    if (musicEnabled === true) {
      now = audio.currentTime * 1000;
    } else {
      now -= startTime;
    }

    const delta = Math.max(1, Math.round((now - past) / 8.333));
    past = now;

    if (audio.paused !== true || !musicEnabled) {
      debugTimeElement.textContent = Math.floor(now);
      deltaOutputElement.textContent = delta;

      const currentEvents = timeline.getCurrentEvents(now);

      if (eventToBeAdded) {
        timeline.addEvent(new Event({ ...eventToBeAdded, start: now }));
        eventToBeAdded = undefined;
        if (showEvents) renderEvents(timeline, now);
      }

      let hit = false;
      let hitId = undefined;
      let kick = false;
      let kickId = undefined;
      let kickStart = 0;
      let effectsId;
      const kickLength = 400;

      currentEvents.forEach((event) => {
        switch (event.type) {
          case EVENT_TYPES.BEAT:
            if (now - event.start < kickLength) {
              kick = true;
              kickId = event.id;
              kickStart = event.start;
            }
            break;
          case EVENT_TYPES.CLASSNAME:
            document.getElementById(event.params.id).className =
              event.params.className;
            break;
          case EVENT_TYPES.TEXT:
            if (currentTextId !== event.id) {
              console.log(event.params.text);
              const slide = event.params.slide || "text";
              document.getElementById(slide).innerHTML = textToSVG({
                text: event.params.text.toUpperCase(),
                duration: event.params.duration,
                delay: event.params.delay,
                animation: event.params.animation,
                slide: event.params.slide,
                letterSpacing: event.params.letterSpacing,
                fill:
                  event.params.style && TEXT_STYLES[event.params.style].fill,
                stroke:
                  event.params.style && TEXT_STYLES[event.params.style].stroke,
              });
              currentText = event.params.text;
              currentTextId = event.id;
            }
            break;
          case EVENT_TYPES.EFFECT:
            effectsId = event.params.id;
            break;
          default:
            break;
        }
      });

      if (effectsId !== undefined) {
        renderer.processEvents(effectsId, currentEvents, now, delta);
        renderer.renderEffects(effectsId, canvas, now, delta, 1.5);
      }
    }

    if (showEvents) {
      updateEvents(timeline, now);
    }
    fps++;
    requestAnimationFrame(render);
  }

  canvas.classList.add("canvas-animations");

  requestAnimationFrame(render);
  const fpsCounter = setInterval(() => {
    fpsOutputElement.textContent = fps;
    fps = 0;
  }, 1000);
}

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeOutCubic(x) {
  return 1.0 - Math.pow(1.0 - x, 3.0);
}

function easeInCirc(x) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeInQuad(x) {
  return x * x;
}

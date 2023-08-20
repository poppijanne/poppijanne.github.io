let reportTime = false;
let eventToBeAdded = undefined;
let currentTexture = 0;
let fps = 0;

// Used in fragment shader
let kickCounter = 0;

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "0":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 0 },
      };
      break;
    case "1":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 1 },
      };
      break;
    case "2":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 2 },
      };
      break;
    case "3":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 3 },
      };
      break;
    case "4":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 4 },
      };
      break;
    case "5":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 5 },
      };
      break;
    case "6":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 6 },
      };
      break;
    case "7":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 7 },
      };
      break;
    case "8":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 8 },
      };
      break;
    case "9":
      eventToBeAdded = {
        type: EVENT_TYPES.PALETTE,
        params: { index: 9 },
      };
      break;
    case "s":
      eventToBeAdded = {
        type: EVENT_TYPES.TEXTURE,
        params: { texture: TEXTURES.STRIPES },
      };
      break;
    case "g":
      eventToBeAdded = {
        type: EVENT_TYPES.TEXTURE,
        params: { texture: TEXTURES.GRID },
      };
      break;
    case "h":
      eventToBeAdded = {
        type: EVENT_TYPES.HIT,
      };
      break;
    case "k":
      eventToBeAdded = {
        type: EVENT_TYPES.KICK,
      };
      break;
    case "a":
      eventToBeAdded = {
        type: EVENT_TYPES.SHAKE,
      };
      break;
    case "z":
      eventToBeAdded = {
        type: EVENT_TYPES.STRETCH,
        params: { stretch: 8, time: 7000 },
      };
      break;
    case "x":
      eventToBeAdded = {
        type: EVENT_TYPES.STRETCH,
        params: { stretch: 0, time: 7000 },
      };
      break;
    case "r":
      eventToBeAdded = {
        type: EVENT_TYPES.LIGHT_COLOR,
        params: { color: [1.0, 0.0, 0.0, 1.0] },
      };
      break;
    case "b":
      eventToBeAdded = {
        type: EVENT_TYPES.LIGHT_COLOR,
        params: { color: [0.0, 0.0, 1.0, 1.0] },
      };
      break;
    case "o":
      eventToBeAdded = {
        type: EVENT_TYPES.DISPLAY,
        params: {
          id: "outron",
          className: "blur-in",
        },
      };
      break;
    case "O":
      eventToBeAdded = {
        type: EVENT_TYPES.DISPLAY,
        params: {
          id: "outron",
          className: "logo-animations blur-out",
        },
      };
      break;
    case "q":
      eventToBeAdded = {
        type: EVENT_TYPES.DISPLAY,
        params: {
          id: "title",
          className: "logo-animations blur-in",
        },
      };
      break;
    case "Q":
      eventToBeAdded = {
        type: EVENT_TYPES.DISPLAY,
        params: {
          id: "title",
          className: "logo-animations blur-out",
        },
      };
      break;
    // shader effects start (shift ASDFGH)
    case "A":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 0,
        },
      };
      break;

    case "S":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 1,
        },
      };
      break;

    case "D":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 2,
        },
      };
      break;

    case "F":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 3,
        },
      };
      break;
    case "G":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 4,
        },
      };
      break;
    case "H":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 5,
        },
      };
      break;
    // shader effects start (shift JKLM)
    case "J": // no effect. this is easier to calculate.
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECT,
        params: {
          id: 7,
        },
      };
      break;
    case "K":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECTFADE,
        params: {
          id: 1,
        },
      };
      break;
    case "L":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECTFADE,
        params: {
          id: 2,
        },
      };
      break;
    case "M":
      eventToBeAdded = {
        type: EVENT_TYPES.EFFECTFADE,
        params: {
          id: 3,
        },
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
        id: "palette-1",
        type: EVENT_TYPES.PALETTE,
        start: 0,
        params: { index: 0 },
      },
      {
        id: "light-color-1",
        type: EVENT_TYPES.LIGHT_COLOR,
        start: 0,
        params: { index: 0 },
      },
      {
        id: "texture-stripes-1",
        type: EVENT_TYPES.TEXTURE,
        start: 0,
        params: { texture: TEXTURES.STRIPES },
      },
    ]);
  }

  //let then = 0;
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

  const canvas2 = document.querySelector("#webgl-canvas-2");
  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;

  const renderer = new EffectRenderer([
    new CubeEffect({
      id: "cube",
      display: false,
      canvas: canvas,
      resolution: 2,
    }),
  ]);

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
          case EVENT_TYPES.HIT:
            if (now - event.start < 100) {
              hit = true;
              hitId = event.id;
            }
            break;
          case EVENT_TYPES.KICK:
            if (now - event.start < kickLength) {
              kick = true;
              kickId = event.id;
              kickStart = event.start;
            }
            break;
          case EVENT_TYPES.DISPLAY:
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
        renderer.renderEffects(effectsId, now, delta);
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

// FULL SPECTRUM

let reportTime = false;
let eventToBeAdded = undefined;
let currentTexture = 0;

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "0":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 0 },
      };
      break;
    case "1":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 1 },
      };
      break;
    case "2":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 2 },
      };
      break;
    case "3":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 3 },
      };
      break;
    case "4":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 4 },
      };
      break;
    case "5":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 5 },
      };
      break;
    case "6":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 6 },
      };
      break;
    case "7":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 7 },
      };
      break;
    case "8":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 8 },
      };
      break;
    case "9":
      eventToBeAdded = {
        id: `palette-${timeline.events.length + 1}`,
        type: EVENT_TYPES.PALETTE,
        params: { index: 9 },
      };
      break;
    case "s":
      eventToBeAdded = {
        id: `texture-stripes-${timeline.events.length + 1}`,
        type: EVENT_TYPES.TEXTURE,
        params: { texture: TEXTURES.STRIPES },
      };
      break;
    case "g":
      eventToBeAdded = {
        id: `texture-grid-${timeline.events.length + 1}`,
        type: EVENT_TYPES.TEXTURE,
        params: { texture: TEXTURES.GRID },
      };
      break;
    case "z":
      eventToBeAdded = {
        id: `stretch-stretch-${timeline.events.length + 1}`,
        type: EVENT_TYPES.STRETCH,
        params: { stretch: 8, time: 7000 },
      };
      break;
    case "x":
      eventToBeAdded = {
        id: `texture-stretch-${timeline.events.length + 1}`,
        type: EVENT_TYPES.STRETCH,
        params: { stretch: 0, time: 7000 },
      };
      break;
    case "t":
      console.log(JSON.stringify(timeline.events));
    default:
      break;
  }
});

const loadTime = Date.now();

const EVENT_TYPES = {
  PALETTE: 1,
  TEXTURE: 2,
  STRETCH: 3,
};

const TEXTURES = {
  STRIPES: 1,
  GRID: 2,
};

class Event {
  constructor({ id, type, start = 0, params = {} }) {
    this.id = id;
    this.type = type;
    this.start = start;
    this.params = params;
  }
  hasStarted(time) {
    return this.start <= time;
  }
  beginsBefore(time) {
    return this.start < time;
  }
  beginsAfter(time) {
    return this.start > time;
  }
}

class Timeline {
  constructor(events) {
    this.events = events.map((event) => new Event({ ...event }));
  }

  addEvent(event) {
    const lastIndex = this.events.findLastIndex(
      (other) => other.type === event.type && other.beginsBefore(event.start)
    );
    if (lastIndex === -1) {
      this.events.push(event);
    } else {
      this.events.splice(lastIndex + 1, 0, event);
    }
  }

  getCurrentEvents(time) {
    const current = [];
    for (let type in EVENT_TYPES) {
      const startedEventsByType = this.events.filter(
        (seq) => seq.type === EVENT_TYPES[type] && seq.hasStarted(time)
      );
      if (startedEventsByType.length > 0) {
        current.push(startedEventsByType[startedEventsByType.length - 1]);
      }
    }
    return current;
  }
}

const timeline = new Timeline([
  { id: "palette-1", type: 1, start: 0, params: { index: 8 } },
  {
    id: "palette-17",
    type: 1,
    start: 467.80200000000013,
    params: { index: 8 },
  },
  { id: "palette-52", type: 1, start: 8301.713, params: { index: 4 } },
  { id: "palette-18", type: 1, start: 16368.29, params: { index: 0 } },
  {
    id: "palette-19",
    type: 1,
    start: 32600.974000000002,
    params: { index: 0 },
  },
  { id: "palette-20", type: 1, start: 40801.396, params: { index: 1 } },
  { id: "palette-21", type: 1, start: 48901.072, params: { index: 2 } },
  { id: "palette-22", type: 1, start: 56934.833, params: { index: 3 } },
  { id: "palette-23", type: 1, start: 65167.837, params: { index: 5 } },
  { id: "palette-24", type: 1, start: 82084.279, params: { index: 1 } },
  { id: "palette-25", type: 1, start: 89534.653, params: { index: 6 } },
  { id: "palette-26", type: 1, start: 97617.663, params: { index: 4 } },
  { id: "palette-27", type: 1, start: 105584.76, params: { index: 9 } },
  { id: "palette-53", type: 1, start: 109793.032, params: { index: 3 } },
  { id: "palette-28", type: 1, start: 113917.76, params: { index: 0 } },
  { id: "palette-54", type: 1, start: 122101.614, params: { index: 3 } },
  { id: "palette-29", type: 1, start: 122184.096, params: { index: 5 } },
  {
    id: "palette-30",
    type: 1,
    start: 129867.87100000001,
    params: { index: 7 },
  },
  { id: "palette-31", type: 1, start: 136384.277, params: { index: 6 } },
  { id: "palette-55", type: 1, start: 140426.623, params: { index: 3 } },
  { id: "palette-32", type: 1, start: 143533.991, params: { index: 5 } },
  { id: "palette-33", type: 1, start: 150701.12, params: { index: 8 } },
  { id: "palette-34", type: 1, start: 156700.88, params: { index: 9 } },
  { id: "palette-35", type: 1, start: 160800.716, params: { index: 5 } },
  { id: "palette-36", type: 1, start: 163817.262, params: { index: 7 } },
  { id: "palette-37", type: 1, start: 166851.223, params: { index: 6 } },
  { id: "palette-38", type: 1, start: 169884.435, params: { index: 3 } },
  { id: "palette-39", type: 1, start: 173900.941, params: { index: 2 } },
  { id: "palette-40", type: 1, start: 176984.151, params: { index: 1 } },
  { id: "palette-41", type: 1, start: 183133.905, params: { index: 5 } },
  { id: "palette-42", type: 1, start: 187251.155, params: { index: 7 } },
  { id: "palette-43", type: 1, start: 191300.993, params: { index: 8 } },
  { id: "palette-44", type: 1, start: 195367.497, params: { index: 9 } },
  { id: "palette-56", type: 1, start: 199284.084, params: { index: 4 } },
  { id: "palette-57", type: 1, start: 207092.846, params: { index: 8 } },
  { id: "palette-53", type: 1, start: 212423.664, params: { index: 7 } },
  { id: "palette-58", type: 1, start: 213709.248, params: { index: 3 } },
  { id: "palette-54", type: 1, start: 216157.232, params: { index: 8 } },
  { id: "palette-59", type: 1, start: 232742.561, params: { index: 3 } },
  { id: "palette-61", type: 1, start: 242392.916, params: { index: 8 } },
  { id: "texture-stripes-1", type: 2, start: 0, params: { texture: 1 } },
  { id: "texture-grid-3", type: 2, start: 31971.708, params: { texture: 2 } },
  {
    id: "texture-stripes-4",
    type: 2,
    start: 65155.21400000001,
    params: { texture: 1 },
  },
  { id: "texture-grid-5", type: 2, start: 97338.01, params: { texture: 2 } },
  {
    id: "texture-stripes-6",
    type: 2,
    start: 113604.776,
    params: { texture: 1 },
  },
  {
    id: "texture-grid-7",
    type: 2,
    start: 129771.54500000001,
    params: { texture: 2 },
  },
  {
    id: "texture-stripes-8",
    type: 2,
    start: 146221.637,
    params: { texture: 1 },
  },
  { id: "texture-grid-9", type: 2, start: 154671.299, params: { texture: 2 } },
  {
    id: "texture-stripes-10",
    type: 2,
    start: 162755.058,
    params: { texture: 1 },
  },
  { id: "texture-grid-11", type: 2, start: 166854.894, params: { texture: 2 } },
  {
    id: "texture-stripes-12",
    type: 2,
    start: 171021.394,
    params: { texture: 1 },
  },
  { id: "texture-grid-13", type: 2, start: 178887.746, params: { texture: 2 } },
  {
    id: "texture-stripes-14",
    type: 2,
    start: 187304.825,
    params: { texture: 1 },
  },
  { id: "texture-grid-15", type: 2, start: 192421.287, params: { texture: 2 } },
  {
    id: "texture-stripes-16",
    type: 2,
    start: 197987.731,
    params: { texture: 1 },
  },
  { id: "texture-grid-52", type: 2, start: 206323.908, params: { texture: 2 } },
  {
    id: "texture-stripes-55",
    type: 2,
    start: 224474.304,
    params: { texture: 1 },
  },
  { id: "texture-grid-60", type: 2, start: 235400.788, params: { texture: 2 } },
  {
    id: "texture-stripes-62",
    type: 2,
    start: 247751.035,
    params: { texture: 1 },
  },
  {
    id: "stretch-stretch-45",
    type: 3,
    start: 97807.839,
    params: { stretch: 8, time: 7000 },
  },
  {
    id: "texture-stretch-46",
    type: 3,
    start: 107957.433,
    params: { stretch: 0, time: 7000 },
  },
  {
    id: "stretch-stretch-52",
    type: 3,
    start: 190785.125,
    params: { stretch: 8, time: 7000 },
  },
  {
    id: "texture-stretch-63",
    type: 3,
    start: 253417.475,
    params: { stretch: 0, time: 7000 },
  },
]);

/*
const timeline = new Timeline([
  { id: "palette-1", type: 1, start: 0, params: { index: 8 } },
  { id: "grid-1", type: 2, start: 0, params: { texture: 1 } },
  { id: "texture-grid-3", type: 2, start: 31971.708, params: { texture: 2 } },
  {
    id: "texture-stripes-4",
    type: 2,
    start: 65155.21400000001,
    params: { texture: 1 },
  },
  { id: "texture-grid-5", type: 2, start: 97338.01, params: { texture: 2 } },
  {
    id: "texture-stripes-6",
    type: 2,
    start: 113604.776,
    params: { texture: 1 },
  },
  {
    id: "texture-grid-7",
    type: 2,
    start: 129771.54500000001,
    params: { texture: 2 },
  },
  {
    id: "texture-stripes-8",
    type: 2,
    start: 146221.637,
    params: { texture: 1 },
  },
  { id: "texture-grid-9", type: 2, start: 154671.299, params: { texture: 2 } },
  {
    id: "texture-stripes-10",
    type: 2,
    start: 162755.058,
    params: { texture: 1 },
  },
  { id: "texture-grid-11", type: 2, start: 166854.894, params: { texture: 2 } },
  {
    id: "texture-stripes-12",
    type: 2,
    start: 171021.394,
    params: { texture: 1 },
  },
  { id: "texture-grid-13", type: 2, start: 178887.746, params: { texture: 2 } },
  {
    id: "texture-stripes-14",
    type: 2,
    start: 187304.825,
    params: { texture: 1 },
  },
  { id: "texture-grid-15", type: 2, start: 192421.287, params: { texture: 2 } },
  {
    id: "texture-stripes-16",
    type: 2,
    start: 197987.731,
    params: { texture: 1 },
  },
]);
*/
/*
const timeline = new Timeline([
  {
    id: "palette-1",
    type: EVENT_TYPES.PALETTE,
    start: 0,
    params: { index: 0 },
  },
  {
    id: "grid-1",
    type: EVENT_TYPES.TEXTURE,
    start: 0,
    params: { texture: TEXTURES.STRIPES },
  },
]);
*/
/*
const timeline = {
  events: [
    //new Event("stretch-1", EVENT_TYPES.STRETCH, 65000),
    //new Event("stretch-2", EVENT_TYPES.STRETCH, 90000),
    //new Event("stretch-3", EVENT_TYPES.STRETCH, 110000),
    //new Event("stretch-4", EVENT_TYPES.STRETCH, 150000),
    new Event({
      id: "palette-1",
      type: EVENT_TYPES.PALETTE,
      start: 0,
      params: {
        index: 0,
      },
    }),
    new Event({
      id: "stripes-1",
      type: EVENT_TYPES.TEXTURE,
      start: 0,
      params: { texture: TEXTURES.STRIPES },
    }),
    new Event({
      id: "grid-1",
      type: EVENT_TYPES.TEXTURE,
      start: 5000,
      params: { texture: TEXTURES.GRID },
    }),
  ],
  getCurrentEvents(time) {
    const current = [];
    for (let type in EVENT_TYPES) {
      const startedEventsByType = this.events.filter(
        (seq) => seq.type === EVENT_TYPES[type] && seq.hasStarted(time)
      );
      if (startedEventsByType.length > 0) {
        current.push(startedEventsByType[startedEventsByType.length - 1]);
      }
    }
    return current;
  },
};
*/
class StripeGenerator {
  constructor({ height = 1, maxWidth = 1, y = 0, steps = 1, palette }) {
    this.y = y;
    this.maxWidth = maxWidth;
    this.height = height;
    this.steps = steps;
    this.width = Math.ceil(Math.random() * maxWidth);
    this.color = palette[Math.floor(palette.length * Math.random())];
    this.canvas = document.createElement("canvas");
    this.canvas.width = maxWidth;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = `rgb(0,0,0)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(context, alpha = 1.0, jitter = 0.0, palette) {
    this.context.drawImage(
      context.canvas,
      0,
      this.y,
      this.canvas.width,
      this.canvas.height,
      0 - this.steps,
      0,
      context.canvas.width,
      this.height
    );

    this.context.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    this.context.fillRect(
      this.canvas.width - this.steps - 1,
      0,
      this.steps,
      this.canvas.height
    );

    context.globalAlpha = alpha;
    context.drawImage(this.canvas, 0, this.y + Math.random() * jitter);
    //context.drawImage(this.canvas, 0, this.y + Math.random());
    //context.drawImage(this.canvas, 0, this.y + Math.random() * 0.1);
    context.globalAlpha = 1.0;

    this.width -= this.steps;
    if (this.width < 1) {
      this.width = Math.ceil((Math.random() * this.maxWidth) / 3);
      this.color = palette[Math.floor(palette.length * Math.random())];
      this.steps = Math.ceil(Math.random() * 3);
      //this.height = Math.ceil(Math.random() * (textureHeight / 32));
    }
  }
  render2(context, alpha = 1.0, jitter = 0.0, palette) {
    context.globalAlpha = alpha;
    context.drawImage(
      context.canvas,
      0,
      this.y,
      context.canvas.width,
      this.height,
      0 - this.steps,
      this.y,
      context.canvas.width,
      this.height
    );

    context.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    context.fillRect(
      this.canvas.width - this.steps - 1,
      this.y,
      this.steps,
      this.canvas.height
    );

    /*
    context.globalAlpha = alpha; //0.75;
    context.drawImage(context.canvas, 0, this.y + Math.random() * jitter);
    //context.drawImage(this.canvas, 0, this.y + Math.random());
    //context.drawImage(this.canvas, 0, this.y + Math.random() * 0.1);
    context.globalAlpha = 1.0;
    */
    context.globalAlpha = 1.0;

    this.width -= this.steps;
    if (this.width < 1) {
      this.width = Math.ceil((Math.random() * this.maxWidth) / 3);
      this.color = palette[Math.floor(palette.length * Math.random())];
      this.steps = Math.ceil(Math.random() * 3);
      //this.height = Math.ceil(Math.random() * (textureHeight / 32));
    }
  }
}

const palette1 = [
  [255, 0, 0],
  [32, 32, 32],
  [32, 32, 64],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette1 = [
  [128, 128, 128],
  [128, 128, 128],
  [128, 128, 128],
  [255, 128, 128],

  /*
  [96, 96, 110],
  [96, 96, 110],
  [96, 96, 110],
  [255, 128, 128],
  */
];
gridPalette1.noise = [32, 32, 32];
gridPalette1.accent = [255, 32, 32];
gridPalette1.bg = [0, 0, 0, 1];

const palette2 = [
  [255, 128, 0],
  [0, 0, 0],
  [255, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette2 = [
  [96, 32, 32],
  [128, 32, 32],
  [255, 128, 32],
  [128, 32, 32],
  [96, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
];
gridPalette2.accent = [255, 225, 32];
gridPalette2.noise = [128, 32, 32];

const palette3 = [
  [0, 64, 250],
  [0, 16, 32],
  [0, 32, 32],
  [0, 0, 32],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const gridPalette3 = [[0, 0, 0]];
gridPalette3.accent = [255, 16, 16];
gridPalette3.noise = [32, 32, 255];
/*
const gridPalette3 = [
  [0, 32, 150],
  [0, 32, 200],
  [0, 64, 255],
  [0, 32, 200],
  [0, 32, 150],
  [0, 16, 100],
  [0, 16, 50],
  [0, 16, 16],
  [0, 16, 50],
  [0, 16, 100],
];
gridPalette3.accent = [0, 16, 16];
//gridPalette3.noise = [16, 64, 16];
*/

const palette4 = [
  [0, 0, 0],
  [255, 32, 0],
  [0, 32, 255],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette4 = [[32, 32, 255]];
gridPalette4.accent = [255, 32, 32];
gridPalette4.bg = [0, 0, 0, 0.3];

const palette5 = [
  [255, 255, 255],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette5 = [
  [255, 255, 255],
  [64, 64, 64],
  [32, 32, 32],
  [64, 64, 64],
  [255, 255, 255],
  [16, 16, 16],
  [255, 255, 255],
  [16, 16, 16],
];
//gridPalette4.bg = [32, 32, 32, 0.3];

const palette6 = [
  [255, 128, 0],
  [0, 128, 255],
  [128, 64, 128],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette6 = [[32, 32, 255]];
gridPalette6.noise = [32, 128, 200];
gridPalette6.accent = [255, 128, 32];

const palette7 = [
  [255, 255, 255],
  [0, 0, 0],
];
const gridPalette7 = [[255, 255, 255]];
gridPalette7.noise = [255, 255, 255];
gridPalette7.accent = [0, 0, 0];

const palette8 = [
  [0, 255, 0],
  [0, 128, 100],
  [0, 0, 0],
];
const gridPalette8 = [
  /*
  [0, 255, 0],
  [0, 128, 0],
  [0, 64, 0],
  [0, 32, 0],
  [0, 64, 0],
  [0, 128, 0],*/
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 255, 255],
];
gridPalette8.accent = [0, 255, 255];
gridPalette8.noise = [0, 140, 64];
gridPalette8.bg = [0, 128, 0, 1];

const palette9 = [
  [255, 0, 255],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const gridPalette9 = [
  [255, 32, 255],
  [32, 32, 32],
];

/*
const palette10 = [
  [0, 0, 0],
  [255, 32, 32],
  [32, 255, 255],
];
const gridPalette10 = [[0, 0, 0]];
gridPalette10.accent = [32, 255, 255];
gridPalette10.noise = [32, 32, 32];
*/
const palette10 = [
  [0, 0, 0],
  [255, 32, 32],
  [32, 255, 255],
];
const gridPalette10 = [
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [128, 255, 255],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [255, 28, 128],
];
gridPalette10.bg = [0, 128, 170, 0.4];
gridPalette10.accent = [255, 255, 255];
//gridPalette10.noise = [32, 32, 32];

const stripePalettes = [
  palette1,
  palette2,
  palette3,
  palette4,
  palette5,
  palette6,
  palette7,
  palette8,
  palette9,
  palette10,
];

const gridPalettes = [
  gridPalette1,
  gridPalette2,
  gridPalette3,
  gridPalette4,
  gridPalette5,
  gridPalette6,
  gridPalette7,
  gridPalette8,
  gridPalette9,
  gridPalette10,
];

//const stripePalettes = [palette9];

//let stripeColors = stripePalettes[0];

const stripes = [];

const textureWidth = 128;
const textureHeight = 256 * 2;
//let stretch = 0.0;
let startTime = 0;
/*
function play() {
  console.log("play");
  const audio = document.getElementById("music");
  audio.play();
  audio
}*/

function main() {
  let y = 0;
  startTime = Date.now() - loadTime;
  while (y < textureHeight) {
    const height = Math.ceil(Math.random() * (textureHeight / 32));
    stripes.push(
      new StripeGenerator({
        y,
        height,
        maxWidth: textureWidth,
        steps: Math.ceil(Math.random() * 3),
        palette: stripePalettes[0],
      })
    );
    y += height;
  }

  const glCanvas = document.querySelector("#webgl-canvas");
  glCanvas.width = window.innerWidth;
  glCanvas.height = window.innerHeight;
  const gl = glCanvas.getContext("webgl");

  const noiseCanvas1 = document.createElement("canvas");
  noiseCanvas1.width = textureWidth;
  noiseCanvas1.height = textureHeight;

  const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector(
    "#fragment-shader-2d"
  ).text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = createProgram(gl, vertexShader, fragmentShader);

  const programInfo = {
    program,
    attributes: {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
    },
    uniforms: {
      projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
      uSampler: gl.getUniformLocation(program, "uSampler"),
      uSampler2: gl.getUniformLocation(program, "uSampler2"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uStretch: gl.getUniformLocation(program, "uStretch"),
    },
  };

  const depth = -11.9;
  let width = 2.0;

  const buffers = {
    position: createBuffer(gl, [
      // Left wall
      -width / 2,
      -1.0,
      2.0,
      -width / 2,
      -1.0,
      depth,
      -width / 2,
      1.0,
      depth,
      -width / 2,
      1.0,
      2.0,
      // Right wall
      width / 2,
      -1.0,
      depth,
      width / 2,
      -1.0,
      2.0,
      width / 2,
      1.0,
      2.0,
      width / 2,
      1.0,
      depth,
      // Floor
      -width / 2,
      -1.0,
      2.0,
      width / 2,
      -1.0,
      2.0,
      width / 2,
      -1.0,
      depth,
      -width / 2,
      -1.0,
      depth,
      // Ceiling
      -width / 2,
      1.0,
      depth,
      width / 2,
      1.0,
      depth,
      width / 2,
      1.0,
      2.0,
      -width / 2,
      1.0,
      2.0,
      // back

      -width / 2,
      -1.0,
      depth,
      width / 2,
      -1.0,
      depth,
      width / 2,
      1.0,
      depth,
      -width / 2,
      1.0,
      depth,

      /*
      -width * 5,
      -3.0,
      depth - 1.0,
      width * 5,
      -3.0,
      depth - 1.0,
      width * 5,
      3.0,
      depth - 1.0,
      -width * 5,
      3.0,
      depth - 1.0,
      */
    ]),
    //color: createBuffer(gl, colors),
    indices: createIndexBuffer(gl, [
      0,
      1,
      2,
      0,
      2,
      3, // left
      4,
      5,
      6,
      4,
      6,
      7, // right
      8,
      9,
      10,
      8,
      10,
      11, // floor
      12,
      13,
      14,
      12,
      14,
      15, // ceiling
      16,
      17,
      18,
      16,
      18,
      19, // back
    ]),
    textureCoord: createBuffer(
      gl,
      [
        // Left wall
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right wall
        1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        // Floor
        0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        // Ceiling
        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
        // back
        0.5, 0.5, 0.51, 0.5, 0.51, 0.51, 0.5, 0.51,
      ]
    ),
  };

  const shadowTexture = createAmbientLightTexture(gl, 8, 64);
  const texture1 = createTexture(gl, noiseCanvas1.width, noiseCanvas1.height);

  copyCanvasToTexture(gl, noiseCanvas1, texture1);

  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  //let then = 0;
  const debugTimeElement = document.getElementById("debug-time");
  const debugOutputElement = document.getElementById("debug-output");
  const seqOutputElement = document.getElementById("debug-seq");

  //let stretchEnded = 0;
  //let lastReportedTime = 0;

  function render(now) {
    now -= startTime;
    /*
    if (reportTime) {
      console.log(`${Math.floor(now)},${lastReportedTime}`);
      reportTime = false;
      lastReportedTime = Math.floor(now);
    }*/

    //now += 10000;
    debugTimeElement.textContent = now;
    if (
      window.innerWidth !== gl.canvas.width ||
      window.innerHeight !== gl.canvas.height
    ) {
      gl.canvas.width = window.innerWidth;
      gl.canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    //now *= 0.001; // convert to seconds
    //deltaTime = now - then;
    //then = now;
    //generateNoiseToCanvas(noiseCanvas1);
    //copyCanvasToTexture(gl, noiseCanvas1, texture1);
    /*
    stripeColors =
      stripePalettes[Math.floor(now * 0.00004) % stripePalettes.length];
    const gridcolors =
      gridPalettes[Math.floor(now * 0.00004) % gridPalettes.length];
      */

    const currentEvents = timeline.getCurrentEvents(now);

    seqOutputElement.textContent = currentEvents.map((seq) => seq.id).join(",");

    if (eventToBeAdded) {
      timeline.addEvent(new Event({ ...eventToBeAdded, start: now }));
      eventToBeAdded = undefined;
    }

    let paletteIndex = 0;
    //let gridColors = gridPalettes[0];

    let stretchTarget = 0;
    let stretchTime = 0;
    let stretchStart = 0;

    currentEvents.forEach((seq) => {
      switch (seq.type) {
        case EVENT_TYPES.PALETTE:
          paletteIndex = seq.params.index;
          debugOutputElement.textContent = seq.params.index;
          break;
        case EVENT_TYPES.TEXTURE:
          switch (seq.params.texture) {
            case TEXTURES.STRIPES:
              generateStripesToCanvas(
                noiseCanvas1,
                stripes,
                now,
                stripePalettes[paletteIndex]
              );
              break;
            case TEXTURES.GRID:
              generateGridToCanvas(
                noiseCanvas1,
                gridPalettes[paletteIndex],
                now
              );
              break;
            default:
              break;
          }
          break;
        case EVENT_TYPES.STRETCH:
          stretchStart = seq.start;
          stretchTarget = seq.params.stretch;
          stretchTime = seq.params.time;
          break;
        default:
          break;
      }
    });

    let stretch = 0;

    if (stretchTarget > 0) {
      stretch =
        easeInOutQuart(Math.min(1, (now - stretchStart) / stretchTime)) *
        stretchTarget;
    } else {
      stretch =
        8 - easeInOutQuart(Math.min(1, (now - stretchStart) / stretchTime)) * 8;
    }

    /*
    if (shouldStretch) {
      //stretch += 0.01;
      stretchEnded = now;
      debugOutputElement.textContent = stretchEnded;
      if (stretch < 8) {
        stretch = easeInOutQuart((now - stretchStart) / stretchLength) * 8.0;
      }
    } else if (stretch > 0) {
      stretch = (stretch - 0.01) * 0.99;
      //stretch = (1.0 - easeInOutQuart((now - stretchEnded) / 10000)) * 8.0;
      //debugOutputElement.textContent = stretchEnded;
    }
*/
    /*
    if (Math.floor(now * 0.0001) % 2 === 0 || now < 50000) {
      generateStripesToCanvas(noiseCanvas1, stripes, now, stripeColors);
    } else {
      generateGridToCanvas(noiseCanvas1, gridcolors, now);
    }*/

    //generateGridToCanvas(noiseCanvas1, gridcolors, now);
    copyCanvasToTexture(gl, noiseCanvas1, texture1);

    drawScene(gl, programInfo, buffers, texture1, shadowTexture, now, stretch);
    //rotation += deltaTime / 2;
    requestAnimationFrame(render);
  }

  document.querySelector("body").classList.add("bg-color-shifter");
  glCanvas.classList.add("canvas-animations");
  document.getElementById("outron").classList.add("logo-animations");
  requestAnimationFrame(render);
}

function drawScene(
  gl,
  programInfo,
  buffers,
  texture,
  shadowTexture,
  now,
  stretch
) {
  gl.clearColor(1.0, 1.0, 1.0, 0.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = ((60 + Math.sin(now * 0.0001) * 20.0) * Math.PI) / 180; // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Compute the camera's matrix
  //const camera = [Math.sin(rotation) * 3, Math.cos(rotation) * 3, -6];
  //const target = [0, 0, 0];
  //const up = [0, 1, 0];
  //mat4.lookAt(modelViewMatrix, camera, target, up);

  // Make a view matrix from the camera matrix.
  //mat4.inverse(modelViewMatrix);

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [
      0.0 + Math.cos(now * 0.0005) * 0.15,
      0.0 + Math.sin(now * 0.0001) * 0.15,
      0.0, // + Math.sin(now * 0.001) * 1.0,
    ]
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    now * 0.00015, // amount to rotate in radians
    [0, 0, 1]
  );
  /*
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    rotation, // amount to rotate in radians
    [1, 0, 0]
  ); // axis to rotate around

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    rotation * 0.5, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around
  
*/
  /*
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  */

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers.position, programInfo);

  //setColorAttribute(gl, buffers.color, programInfo);

  setTextureAttribute(gl, buffers.textureCoord, programInfo);
  //setNormalAttribute(gl, buffers.normal, programInfo);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniforms.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniforms.modelViewMatrix,
    false,
    modelViewMatrix
  );
  //gl.uniformMatrix4fv(programInfo.uniforms.normalMatrix, false, normalMatrix);

  gl.uniform1f(programInfo.uniforms.uTime, now * 0.0001);
  gl.uniform1f(programInfo.uniforms.uStretch, stretch);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniforms.uSampler, 0);

  // Tell WebGL we want to affect shadow texture unit 1
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture to texture unit 1
  gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
  // Tell the shader we bound the texture to texture unit 1
  gl.uniform1i(programInfo.uniforms.uSampler2, 1);

  {
    const vertexCount = 5 * 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, position, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setColorAttribute(gl, color, programInfo) {
  const numComponents = 4; // pull out 4 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, color);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexColor);
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, textureCoord, programInfo) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
  gl.vertexAttribPointer(
    programInfo.attributes.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.textureCoord);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, normal, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexNormal);
}

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

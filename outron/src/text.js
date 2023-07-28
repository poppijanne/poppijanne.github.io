// astral
// Adapt
// Decadence
// Byterapers
// Aikapallo
// Future Crew
// Darkki
// Ivory
// Tekotuotanto
// Kewlers
// RIBBON
// HBC
// CNCD
// FAIRLIGHT
// Pyrotech
// Andromeda Software Development
// Wide Load
// Peetu Nuottajärvi

const FONT_RESIZE_FACTOR = 10;

class SVGCommand {
  constructor(cmd) {
    this.cmd = cmd;
    this.params = [];
  }

  addParam(param) {
    if (param === "") {
      return;
    }
    if (isNaN(param)) {
      throw new Error(`param ${param} is not a number`);
    }
    let intParam = parseFloat(param);
    intParam = Math.round(intParam * FONT_RESIZE_FACTOR);

    this.params.push(parseFloat(intParam));
  }
}

class SVGPath {
  constructor(path) {
    this.path = path;
    this.commands = [];
    let command;
    let param;

    for (let i = 0; i < path.length; i++) {
      const char = path.charAt(i);
      if (
        char === "-" &&
        param !== "" &&
        param.charAt(param.length - 1) !== "e"
      ) {
        if (command) command.addParam(param);
        param = char;
      } else if (char === " ") {
        if (command) command.addParam(param);
        param = "";
      } else if (char === "-") {
        param += "-";
      } else if (char === ".") {
        param += char;
      } else if (char === "e") {
        param += char;
      } else if (isNaN(char)) {
        if (command) command.addParam(param);
        command = new SVGCommand(char);
        param = "";
        this.commands.push(command);
      } else {
        param += char;
      }
    }
  }

  addCommand(cmd) {
    this.commands.push(cmd);
  }

  toString(x = 0, y = 0) {
    let d = "";
    this.commands.forEach((command, ci) => {
      d += command.cmd;

      command.params.forEach((param, i) => {
        // set x and y for first 'm', rest are relative
        if (ci === 0 && i === 0) {
          param += x;
        } else if (ci === 0 && i === 1) {
          param += y;
        }

        d += ` ${param}`;
      });
    });
    return d;
  }
}

const FONT1 = {
  A: new SVGPath(
    `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v10.583h2.6458v-5.2917h7.9375v5.2917h2.6458v-10.583c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v2.6458h-7.9375z`
  ),
  B: new SVGPath(
    `m2.6e-6 -2.6667e-7v13.229h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66146-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375zm0 5.2917h7.9375v2.6458h-7.9375z`
  ),
  C: new SVGPath(
    `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h10.583v-2.6458h-10.583v-7.9375h10.583v-2.6458z`
  ),
  D: new SVGPath(
    `m5.9e-6 -1.2667e-6v13.229h10.583c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v7.9375h-7.9375z`
  ),
  E: new SVGPath(
    `m5.9e-6 -1.2667e-6v13.229h13.229v-2.6458h-10.583v-2.6458h7.9375v-2.6458h-7.9375v-2.6458h10.583v-2.6458z`
  ),
  F: new SVGPath(
    `m5.9e-6 -1.2667e-6v13.229h2.6458v-5.2917h7.9375v-2.6458h-7.9375v-2.6458h10.583v-2.6458z`
  ),
  G: new SVGPath(
    `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h9.2604c0.66146 0 1.3229-0.66146 1.3229-1.3229v-6.6146h-7.9375v2.6458h5.2917v2.6458h-7.9375v-7.9375h10.583v-2.6458z`
  ),
  H: new SVGPath(
    `m5.9e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-13.229h-2.6458v5.2917h-7.9375v-5.2917z`
  ),
  I: new SVGPath(`m6.4667e-6 -5e-7v13.229h2.6458v-13.229z`),
  J: new SVGPath(
    `m10.583-1.2667e-6v10.583h-7.9375v-2.6458h-2.6458v2.6458c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-10.583z`
  ),
  K: new SVGPath(
    `m5.9e-6 -1.2667e-6v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-5.2917l-1.3229-1.3229 1.3229-1.3229v-5.2917h-2.6458v5.2917h-7.9375v-5.2917z`
  ),
  L: new SVGPath(`m2.6e-6 -1.2667e-6v13.229h13.229v-2.6458h-10.583v-10.583z`),
  M: new SVGPath(
    `m5.9e-6 -9.6667e-7v13.229h2.6458v-10.583h2.6458v2.6458h2.6458v-2.6458h2.6458v10.583h2.6458v-13.229h-5.2917l-1.3229 1.3229-1.3229-1.3229z`
  ),
  N: new SVGPath(
    `m13.229-9.6667e-7h-2.6458v8.3783c-2.7928-2.7928-5.5855-5.5855-8.3783-8.3783h-2.205v13.229h2.6458v-8.3783c2.7928 2.7928 5.5855 5.5855 8.3783 8.3783h2.205v-2.205z`
  ),
  O: new SVGPath(
    `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v7.9375h-7.9375z`
  ),
  P: new SVGPath(
    `m5.9e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375z`
  ),
  Q: new SVGPath(
    `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h6.6146l-2.6458-2.6458h-3.9688v-7.9375h7.9375v3.9688l2.6458 2.6458v-6.6146c0-1.3229-1.3229-2.6458-2.6458-2.6458zm5.071 5.5123-2.2045 2.2045 5.5118 5.5123 2.205-2.205z`
  ),
  R: new SVGPath(
    `m5.6e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-5.2917l-1.3229-1.3229c0.66146 0 1.3229-0.66146 1.3229-1.3229v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375z`
  ),
  S: new SVGPath(
    `m1.3229-2.6667e-7c-0.66146 0-1.3229 0.66146-1.3229 1.3229v5.2917c0 0.66146 0.66146 1.3229 1.3229 1.3229h9.2604v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-5.2917c0-0.66146-0.66146-1.3229-1.3229-1.3229h-9.2604v-2.6458h10.583v-2.6458h-10.583z`
  ),
  T: new SVGPath(
    `m8.6e-6 -9.6667e-7v2.6458h5.2917v10.583h2.6458v-10.583h5.2917v-2.6458z`
  ),
  U: new SVGPath(
    `m5.9e-6 -9.6667e-7v10.583c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-10.583h-2.6458v10.583h-7.9375v-10.583z`
  ),
  V: new SVGPath(
    `m5.9e-6 -9.6667e-7v7.9375l5.2917 5.2917h2.6458l5.2917-5.2917v-7.9375h-2.6458v6.6146l-3.9688 3.9688-2.6458-2.6458-1.3229-1.3229v-6.6146z`
  ),
  W: new SVGPath(
    `m5.9e-6 -1.2667e-6v10.583l2.6458 2.6458h2.6458l1.3229-1.3229 1.3229 1.3229h2.6458l2.6458-2.6458v-10.583h-2.6458v10.583h-2.6458v-2.6458h-2.6458v2.6458h-2.6458v-10.583z`
  ),
  X: new SVGPath(
    `m2.205-1.2667e-6 -2.205 2.205 4.4096 4.4096-4.4096 4.4096 2.205 2.205 4.4096-4.4096 4.4096 4.4096 2.205-2.205-4.4095-4.4096 4.4095-4.4096-2.205-2.205-4.4096 4.4095z`
  ),
  Y: new SVGPath(
    `m5.9e-6 -2.6667e-7v5.2917c0 1.3229 1.3229 2.6458 2.6458 2.6458h2.6458v5.2917h2.6458v-5.2917h2.6458c1.3229 0 2.6458-1.3229 2.6458-2.6458v-5.2917h-2.6458v5.2917h-7.9375v-5.2917z`
  ),
  Z: new SVGPath(
    `m5.9e-6 -1.2667e-6v2.6458h8.3783c-2.7928 2.7928-5.5855 5.5855-8.3783 8.3783v2.205h13.229v-2.6458h-8.3783c2.7928-2.7928 5.5855-5.5855 8.3783-8.3783v-2.205h-2.205z`
  ),
  "\u00C4": new SVGPath(
    `m1.3229-3e-7v1.3229h2.6458v-1.3229zm7.9375 0v1.3229h2.6458v-1.3229zm-6.6146 2.6458c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375h2.6458v-2.6458h7.9375v2.6458h2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v2.6458h-7.9375z`
  ),
  "\u00D6": new SVGPath(
    `m1.3229-2.6667e-7v1.3229h2.6458v-1.3229zm7.9375 0v1.3229h2.6458v-1.3229zm-6.6146 2.6458c-1.3229 0-2.6458 1.3229-2.6458 2.6458v5.2917c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-5.2917c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v5.2917h-7.9375v-2.6458z`
  ),
  0: new SVGPath(
    `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm1.7637 2.6458h6.1738v6.1738zm-1.7637 1.7637 6.1738 6.1738h-6.1738z`
  ),
  1: new SVGPath(
    `m2.6458-2.6667e-7 -2.6458 2.6458h2.6458v10.583h2.6458v-13.229z`
  ),
  2: new SVGPath(
    `m5.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-7.9375c-1.3229 0-2.6458 1.3229-2.6458 2.6458v5.2917h13.229v-2.6458h-10.583v-2.6458h9.2604c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458z`
  ),
  3: new SVGPath(
    `m5.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-7.9375v2.6458h7.9375v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66146-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229z`
  ),
  4: new SVGPath(
    `m5.6e-6 -1.2667e-6v7.9375h10.583v5.2917h2.6458v-13.229h-2.6458v5.2917h-7.9375v-5.2917z`
  ),
  5: new SVGPath(
    `m5.9e-6 -1.2667e-6v7.9375h10.583v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458h-7.9375v-2.6458h10.583v-2.6458z`
  ),
  6: new SVGPath(
    `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v9.2604c0 0.66146 0.66146 1.3229 1.3229 1.3229h10.583c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458h-7.9375v-2.6458h10.583v-2.6458zm0 7.9375h7.9375v2.6458h-7.9375z`
  ),
  7: new SVGPath(
    `m8.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-5.2917v2.6458h5.2917v5.2917h2.6458v-13.229z`
  ),
  8: new SVGPath(
    `m1.3229-1.2667e-6c-0.66146 0-1.3229 0.66147-1.3229 1.3229v3.9688c0 0.66146 0.66146 1.3229 1.3229 1.3229-0.66146 0-1.3229 0.66146-1.3229 1.3229v3.9688c0 0.66146 0.66146 1.3229 1.3229 1.3229h10.583c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229zm1.3229 2.6458h7.9375v2.6458h-7.9375zm0 5.2917h7.9375v2.6458h-7.9375z`
  ),
  9: new SVGPath(
    `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v2.6458c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375v5.2917h2.6458v-11.906c0-0.66145-0.66146-1.3229-1.3229-1.3229zm0 2.6458h7.9375v2.6458h-7.9375z`
  ),
  ".": new SVGPath(`m2.7333e-6 10.583h2.6458v2.6458h-2.6458z`),
  "!": new SVGPath(
    `m0 0v7.9375h2.6458v-7.9375h-2.6458zm0 10.583v2.6458h2.6458v-2.6458h-2.6458z`
  ),
  getCharacterWidth(c) {
    switch (c) {
      case "I":
        return Math.round(2.6458 * FONT_RESIZE_FACTOR);
      case ".":
        return Math.round(2.6458 * FONT_RESIZE_FACTOR);
      case "!":
        return Math.round(2.6458 * FONT_RESIZE_FACTOR);
      case "1":
        return Math.round(2.6458 * 2 * FONT_RESIZE_FACTOR);
      default:
        return Math.round(13.229 * FONT_RESIZE_FACTOR);
    }
  },
};

console.log(FONT1.A.toString());

function textToSVG({
  text,
  cw = 50,
  ch = 50,
  duration = 10,
  letterSpacing = 1.3229,
  fill,
  charStyle,
  stroke,
  strokeWidth = 0.3,
  bloom = true,
  animation = "text-ch-fadein",
  shadowFill, // = "#f004",
  delay,
}) {
  let characters = "";
  let x = 0;

  [...text].forEach((c, index) => {
    if (FONT1[c] !== undefined) {
      const style =
        charStyle !== undefined
          ? charStyle
          : `opacity:0; animation: ${duration}s ease-in-out ${
              delay !== undefined ? delay : index / 10
            }s forwards ${animation}`;

      const path = FONT1[c].toString(x);

      if (shadowFill !== undefined) {
        characters += `
            <g 
                style="${style}"
                transform="translate(${
                  x + FONT_RESIZE_FACTOR
                } ${FONT_RESIZE_FACTOR})" 
                fill="${shadowFill}" 
                >
                <path d="${FONT1[c]}"/>   
            </g>
        `;
      }
      characters += `
        <g 
            style="${style}"

            fill="${fill || "none"}" 
            ${
              stroke
                ? `stroke="${stroke}" stroke-width="${
                    strokeWidth * FONT_RESIZE_FACTOR
                  }"`
                : ""
            }>
            ${
              bloom
                ? `<path d="${FONT1[c].toString(x)}" filter="url(#blur-1)"/>`
                : ""
            }
            <path d="${FONT1[c].toString(x)}"/>
        </g>
    `;
    }
    x += FONT1.getCharacterWidth(c) + letterSpacing * FONT_RESIZE_FACTOR;
  });

  const vx = -5 * FONT_RESIZE_FACTOR,
    vy = -5 * FONT_RESIZE_FACTOR,
    vw = Math.round(x + 10 * FONT_RESIZE_FACTOR),
    vh = Math.round(23.229 * FONT_RESIZE_FACTOR),
    blurX = Math.round(-0.091554 * FONT_RESIZE_FACTOR),
    blurY = Math.round(-0.091554 * FONT_RESIZE_FACTOR),
    blurWidth = Math.round(1.1831 * FONT_RESIZE_FACTOR),
    blurHeight = Math.round(1.1831 * FONT_RESIZE_FACTOR),
    gradientX = Math.round(6.6146 * FONT_RESIZE_FACTOR),
    gradientY1 = Math.round(-2.6667 * FONT_RESIZE_FACTOR),
    gradientY2 = Math.round(13.229 * FONT_RESIZE_FACTOR);

  const svg = `
    <svg version="1.1" viewBox="${vx} ${vy} ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur-1" x="${blurX}" y="${blurY}" width="${blurWidth}" height="${blurHeight}" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="${Math.round(0.50465728 * 5)}"/>
      </filter>
      <linearGradient id="gradient-ghost" x1="${gradientX}" x2="${gradientX}" y1="${gradientY1}" y2="${gradientY2}" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fefefe" offset="0"/>
        <stop stop-color="#fefefe" stop-opacity=".035294" offset=".7"/>
        <stop stop-color="#fefefe" offset="1"/>
      </linearGradient>
      <linearGradient id="gradient-metal" x1="${gradientX}" x2="${gradientX}" y1="${gradientY1}" y2="${gradientY2}" gradientUnits="userSpaceOnUse">
        <stop stop-color="#505050" offset="0"/>
        <stop stop-color="#fefefe" offset=".65517"/>
        <stop stop-color="#4c4c4c" offset=".69655"/>
        <stop stop-color="#fefefe" offset="1"/>
     </linearGradient>
     <linearGradient id="gradient-sunset" x1="${gradientX}" x2="${gradientX}" y1="${gradientY1}" y2="${gradientY2}" gradientUnits="userSpaceOnUse">
       <stop stop-color="#f04" offset="0"/>
       <stop stop-color="#ff2" offset="1"/>
    </linearGradient>
    </defs>
    ${characters}
    </svg>
    `;
  return svg;
}

const TEXT_STYLES = {
  METAL: {
    fill: "url(#gradient-metal)",
    stroke: "url(#gradient-ghost)",
  },
  SOLID_RED: {
    fill: "#f00",
    stroke: "#f00",
  },
  PINK_STROKE: {
    stroke: "#f0f",
  },
  SOLID_WHITE: {
    fill: "#fefefe",
    stroke: "#fefefe",
  },
  SOLID_TEAL: {
    fill: "#0de",
  },
  SOLID_VIOLET: {
    fill: "#e0e",
    stroke: "#e0e",
  },
  SOLID_VIOLET: {
    fill: "#e0e",
    stroke: "#e0e",
  },
  SUNSET: {
    fill: "url(#gradient-sunset)",
  },
  SUNSET_STROKE: {
    stroke: "url(#gradient-sunset)",
  },
  WHITE_STROKE: {
    stroke: "#fefefe",
  },
};
/*
const TEXT_FILLS = {
  SOLID_WHITE: "#fff",
  SOLID_RED: "#f00",
  GRAY_METAL: "url(#gradient-metal)",
  SUNSET: "url(#gradient-sunset)",
  getStyle(style) {
    return this[style] || style;
  },
};

const TEXT_STROKES = {
  SOLID_WHITE: 0,
  SOLID_RED: 1,
  WHITE_GHOST: 10,
  getStyle(style) {
    switch (style) {
      case this.SOLID_WHITE:
        return "#fff";
      case this.SOLID_RED:
        return "#f00";
      case this.WHITE_GHOST:
        return "url(#gradient-ghost)";
    }
    return style;
  },
};*/

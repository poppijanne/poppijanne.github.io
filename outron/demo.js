// FULL SPECTRUM

let reportTime = false;
let eventToBeAdded = undefined;
let currentTexture = 0;
let fps = 0;

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
    case "h":
      eventToBeAdded = {
        id: `hit-${timeline.events.length + 1}`,
        type: EVENT_TYPES.HIT,
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
  HIT: 4,
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

let timeline = new Timeline(timelineEvents);

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

  render(context, alpha = 1.0, jitter = 0.0, palette, delta) {
    this.context.drawImage(
      context.canvas,
      0,
      this.y,
      this.canvas.width,
      this.canvas.height,
      0 - this.steps * delta,
      0,
      context.canvas.width,
      this.height
    );

    this.context.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    this.context.fillRect(
      this.canvas.width - this.steps * delta - 1,
      0,
      this.steps * delta,
      this.canvas.height
    );

    this.context.fillStyle = `rgb(0,0,0)`;
    this.context.fillRect(
      this.canvas.width - this.steps - 1,
      0,
      this.steps * delta,
      1
    );
    this.context.fillRect(
      this.canvas.width - this.steps * delta - 1,
      this.canvas.height - 1,
      this.steps * delta,
      1
    );

    context.globalAlpha = alpha;
    context.drawImage(
      this.canvas,
      0,
      this.y + (Math.random() - Math.random()) * jitter
    );
    /*
    context.drawImage(
      this.canvas,
      0,
      this.y - jitter //(Math.random() + Math.random()) * jitter * delta
    );*/
    //context.drawImage(this.canvas, 0, this.y + Math.random());
    //context.drawImage(this.canvas, 0, this.y + Math.random() * 0.1);
    context.globalAlpha = 1.0;

    this.width -= this.steps * delta;
    if (this.width < 1) {
      this.width = Math.ceil((Math.random() * this.maxWidth) / 3);
      this.color = palette[Math.floor(palette.length * Math.random())];
      this.steps = Math.ceil(Math.random() * 3);
      //this.height = Math.ceil(Math.random() * (textureHeight / 32));
    }
  }
}

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

function main({ musicEnabled, clearEffects }) {
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
        id: "texture-stripes-1",
        type: EVENT_TYPES.TEXTURE,
        start: 0,
        params: { texture: TEXTURES.STRIPES },
      },
    ]);
  }

  while (y < textureHeight) {
    const height = Math.max(4, Math.ceil(Math.random() * (textureHeight / 32)));
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
  const eventOutputElement = document.getElementById("debug-event");
  const fpsOutputElement = document.getElementById("debug-fps");
  const deltaOutputElement = document.getElementById("debug-delta");
  const audio = document.getElementById("music");

  //let stretchEnded = 0;
  //let lastReportedTime = 0;

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers.position, programInfo);

  setTextureAttribute(gl, buffers.textureCoord, programInfo);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  /*
  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniforms.uSampler, 0);

  // Tell WebGL we want to affect shadow texture unit 1
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture to texture unit 1
  gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
  // Tell the shader we bound the texture to texture unit 1
  gl.uniform1i(programInfo.uniforms.uSampler2, 1);
  */
  let past = 0;

  function render(now) {
    if (musicEnabled === true) {
      now = audio.currentTime * 1000;
    } else {
      now -= startTime;
    }

    const delta = (now - past) / 8.0;
    past = now;

    //now -= startTime;
    //console.log(audio.currentTime);
    /*
    if (reportTime) {
      console.log(`${Math.floor(now)},${lastReportedTime}`);
      reportTime = false;
      lastReportedTime = Math.floor(now);
    }*/
    if (audio.paused !== true || !musicEnabled) {
      //now += 10000;
      debugTimeElement.textContent = now;
      deltaOutputElement.textContent = delta;
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

      eventOutputElement.textContent = currentEvents
        .map((event) => event.id)
        .join(",");

      if (eventToBeAdded) {
        timeline.addEvent(new Event({ ...eventToBeAdded, start: now }));
        eventToBeAdded = undefined;
      }

      let paletteIndex = 0;
      let hit = false;
      //let gridColors = gridPalettes[0];

      let stretchTarget = 0;
      let stretchTime = 0;
      let stretchStart = 0;

      currentEvents.forEach((event) => {
        switch (event.type) {
          case EVENT_TYPES.PALETTE:
            paletteIndex = event.params.index;
            debugOutputElement.textContent = event.params.index;
            break;
          case EVENT_TYPES.HIT:
            if (now - event.start < 100) {
              hit = true;
            }
            break;
          case EVENT_TYPES.TEXTURE:
            switch (event.params.texture) {
              case TEXTURES.STRIPES:
                generateStripesToCanvas(
                  noiseCanvas1,
                  stripes,
                  now,
                  stripePalettes[paletteIndex],
                  hit,
                  delta
                );
                break;
              case TEXTURES.GRID:
                generateGridToCanvas(
                  noiseCanvas1,
                  gridPalettes[paletteIndex],
                  now,
                  hit,
                  delta
                );
                break;
              default:
                break;
            }
            break;
          case EVENT_TYPES.STRETCH:
            stretchStart = event.start;
            stretchTarget = event.params.stretch;
            stretchTime = event.params.time;
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
          8 -
          easeInOutQuart(Math.min(1, (now - stretchStart) / stretchTime)) * 8;
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

      drawScene(
        gl,
        programInfo,
        buffers,
        texture1,
        shadowTexture,
        now,
        stretch
      );
      //rotation += deltaTime / 2;
    }
    requestAnimationFrame(render);
  }

  document.querySelector("body").classList.add("bg-color-shifter");
  glCanvas.classList.add("canvas-animations");
  document.getElementById("outron").classList.add("logo-animations");
  requestAnimationFrame(render);
  const fpsCounter = setInterval(() => {
    fpsOutputElement.textContent = fps;
    fps = 0;
  }, 1000);
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
  fps++;
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

  /*
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers.position, programInfo);

  setTextureAttribute(gl, buffers.textureCoord, programInfo);



  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

*/

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

function easeOutCubic(x) {
  return 1.0 - Math.pow(1.0 - x, 3.0);
}

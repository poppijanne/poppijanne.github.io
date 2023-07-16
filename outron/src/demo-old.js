// FULL SPECTRUM

let reportTime = false;
let eventToBeAdded = undefined;
let currentTexture = 0;
let fps = 0;

// Used in fragment shader
let kickCounter = 0;
let effectNro = 0;
let effectFade = 0;
let effectFadeNro = 0;
let effectFadeEventID = "";

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
        type: EVENT_TYPES.EFFECTFADE,
        params: {
          id: 0,
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

const stripes = [];

const textureWidth = 128;
const textureHeight = 512;
//let stretch = 0.0;
let startTime = 0;

function main({
  musicEnabled,
  clearEffects,
  showDevTools,
  showTextures,
  showEvents,
}) {
  let y = 0;
  startTime = Date.now() - loadTime;

  const greets = [
    "hello",
    "amiga!",
    "astral",
    "Adapt",
    "C64",
    "Decadence",
    "Byterapers",
    "Aikapallo",
    "Farbrausch",
    "Future Crew",
    "Darkki",
    "Division",
    "Ivory",
    "Tekotuotanto",
    "Kewlers",
    "MSX",
    "RIBBON",
    "HBC",
    "Epoch",
    "PuavoHard",
    "CNCD",
    "FAIRLIGHT",
    "Pyrotech",
    "rawArgon",
    "Peisik",
    "hedelmae",
    "Moppi Productions",
    "Spectrum",
    "Synthwave lovers",
    "Extream",
    "Fiture Crew",
    "Mazor",
    "Armada",
    "Matt Current",
    "ASD",
    "Wide Load",
    "TPOLM",
    "XZM",
    "nosfe",
    "Britelite",
    "Byproduct",
    "Traction",
    "Random",
    "Truck",
    "Trilobit",
    "Mature Furk",
    "GRiMM",
    "King Thrill",
    "Little Bitchard",
    "Jumalauta",
    "Atari",
    "Peetu Nuottaj\u00C4rvi",
    "taat",
    "compo crew",
    "thank you",
    "assembly",
    "for your wonderful art",
    "and warm memories",
  ];

  const styles = [
    "METAL",
    "SOLID_RED",
    "SUNSET",
    "PINK_STROKE",
    "SOLID_TEAL",
    "SUNSET_STROKE",
    "SOLID_VIOLET",
  ];

  const textSlides = ["text", "text-2"];
  let time = 73387;

  /*
  greets.forEach((greet, index) => {
    timeline.addEvent(
      new Event({
        type: EVENT_TYPES.TEXT,
        start: time, //68133 + index * 4480,
        params: {
          text: greet,
          style: styles[index % 7],
          slide: textSlides[index % 2],
          duration: 2,
        },
      })
    );
    time += Math.max(4480 / 3, greet.length * 140);
  });*/

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

  while (y < textureHeight) {
    const height = Math.max(6, Math.ceil(Math.random() * (textureHeight / 32)));
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
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(noiseCanvas1);

  const laserCanvas = document.createElement("canvas");
  laserCanvas.width = 256;
  laserCanvas.height = 256;
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(laserCanvas);

  const lightCanvas1 = createTunnelLightCanvas1(
    gl,
    textureWidth,
    textureHeight
  );
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(lightCanvas1);

  const lightCanvas2 = createTunnelLightCanvas2(
    gl,
    textureWidth,
    textureHeight
  );
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(lightCanvas2);

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = textureWidth;
  finalCanvas.height = textureHeight;
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(finalCanvas);

  const vertexShaderSource = document.querySelector("#vertex-shader").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader").text;

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
      //uSampler2: gl.getUniformLocation(program, "uSampler2"),
      w: gl.getUniformLocation(program, "w"),
      h: gl.getUniformLocation(program, "h"),
      kickCounter: gl.getUniformLocation(program, "kickCounter"), // kick counter to shader
      effectNro: gl.getUniformLocation(program, "effectNro"), // number of shader effect 0 = none
      effectFade: gl.getUniformLocation(program, "effectFade"), // time to start the effectfade
      effectFadeNro: gl.getUniformLocation(program, "effectFadeNro"), // type of effect fade
      uTime: gl.getUniformLocation(program, "uTime"),
      uStretch: gl.getUniformLocation(program, "uStretch"),
      uFogDepth: gl.getUniformLocation(program, "uFogDepth"),
      uFogColor: gl.getUniformLocation(program, "uFogColor"),
    },
  };

  geometry.stage.buffers = {
    position: createBuffer(gl, geometry.stage.vertices),
    //color: createBuffer(gl, colors),
    indices: createIndexBuffer(gl, geometry.stage.indices),
    textureCoord: createBuffer(gl, geometry.stage.textureCoord),
  };
  geometry.display.buffers = {
    position: createBuffer(gl, geometry.display.vertices),
    //color: createBuffer(gl, colors),
    indices: createIndexBuffer(gl, geometry.display.indices),
    textureCoord: createBuffer(gl, geometry.display.textureCoord),
  };

  const { canvas: shadowCanvas } = createAmbientLightTexture(
    gl,
    textureWidth,
    textureHeight
  );
  const stageTexture = createTexture(gl, textureWidth, textureHeight);
  const displayTexture = createTexture(gl, textureWidth, textureHeight);
  if (showTextures)
    document.getElementById("debug-canvas").appendChild(shadowCanvas);

  mergeCanvas(finalCanvas, noiseCanvas1);
  mergeCanvas(finalCanvas, shadowCanvas);
  copyCanvasToTexture(gl, finalCanvas, stageTexture);
  copyCanvasToTexture(gl, noiseCanvas1, displayTexture);

  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  //let then = 0;
  const debugTimeElement = document.getElementById("debug-time");
  const debugOutputElement = document.getElementById("debug-output");
  const fpsOutputElement = document.getElementById("debug-fps");
  const deltaOutputElement = document.getElementById("debug-delta");
  const audio = document.getElementById("music");
  const bodyElement = document.querySelector("body");

  bodyElement.style.height = window.innerHeight + "px";

  //let stretchEnded = 0;
  //let lastReportedTime = 0;

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  /*
  setPositionAttribute(gl, buffers.position, programInfo);

  setTextureAttribute(gl, buffers.textureCoord, programInfo);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  */
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
  let bgColor = [1, 1, 1, 1];
  let currentText = "";
  let currentTextId = "";

  //let stretch = 0;

  if (showEvents) {
    renderEvents(timeline, 0);
  }

  function render(now) {
    if (musicEnabled === true) {
      now = audio.currentTime * 1000;
    } else {
      now -= startTime;
    }

    const delta = Math.max(1, Math.round((now - past) / 8.333));
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
      debugTimeElement.textContent = Math.floor(now);
      deltaOutputElement.textContent = delta;
      if (
        window.innerWidth !== gl.canvas.width ||
        window.innerHeight !== gl.canvas.height
      ) {
        bodyElement.style.height = window.innerHeight + "px";
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

      if (eventToBeAdded) {
        timeline.addEvent(new Event({ ...eventToBeAdded, start: now }));
        eventToBeAdded = undefined;
        if (showEvents) renderEvents(timeline, now);
      }

      let paletteIndex = 0;
      let hit = false;
      let hitId = undefined;
      let kick = false;
      let kickId = undefined;
      let kickStart = 0;
      const kickLength = 400;
      let shake = false;
      let shakeStart = 0;
      const shakeLength = 400;
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
          case EVENT_TYPES.SHAKE:
            if (now - event.start < shakeLength) {
              shake = true;
              shakeStart = event.start;
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
                  delta,
                  bgColor
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
          case EVENT_TYPES.DISPLAY:
            document.getElementById(event.params.id).className =
              event.params.className;
            break;
          case EVENT_TYPES.LIGHT_COLOR:
            const targetColor = lightPalette[event.params.index];
            bgColor[0] = (bgColor[0] * 99 + targetColor[0]) / 100;
            bgColor[1] = (bgColor[1] * 99 + targetColor[1]) / 100;
            bgColor[2] = (bgColor[2] * 99 + targetColor[2]) / 100;
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
            effectNro = event.params.id;
            break;
          case EVENT_TYPES.EFFECTFADE:
            effectFadeNro = event.params.id;
            if (effectFadeEventID !== event.id) {
              effectFade = now;
              effectFadeEventID = event.id;
            }
            //console.log(event.id, event.start, now, now - event.start);
            if (effectFadeNro === 2 && now - event.start > 1000) {
              // fadeouts needs to reset the situation after effect.. now hardcoded 1 sec
              effectFadeNro = 3; // and this is the see through effect as a base
            }

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
      if (stretch !== stretchTarget) {
        stretch = (stretch * 99 + stretchTarget) / 100;
      }*/

      /*
    if (Math.floor(now * 0.0001) % 2 === 0 || now < 50000) {
      generateStripesToCanvas(noiseCanvas1, stripes, now, stripeColors);
    } else {
      generateGridToCanvas(noiseCanvas1, gridcolors, now);
    }*/
      drawLasers(laserCanvas, kick, kickId, hit, hitId, delta, bgColor, now);

      //generateGridToCanvas(noiseCanvas1, gridcolors, now);
      //copyCanvasToTexture(gl, noiseCanvas1, texture1);
      setTunnelLightCanvasColor(lightCanvas1, bgColor);
      setTunnelLightCanvasColor(lightCanvas2, bgColor);
      mergeCanvas(finalCanvas, noiseCanvas1);
      mergeCanvas(finalCanvas, shadowCanvas, "overlay");
      //mergeCanvas(finalCanvas, laserCanvas, "luminosity");
      mergeCanvas(finalCanvas, lightCanvas1, "source-over");

      let y = 0;
      let f = 1.0 - (now - kickStart) / kickLength;
      kickCounter = f;

      if (kick) {
        mergeCanvas(finalCanvas, lightCanvas2, "source-over", f);
      }

      if (shake) {
        y = Math.sin(now * f * 0.1) * 0.005 /* * f*/;
      }
      //
      //mergeCanvas(finalCanvas, shadowCanvas, "multiply");
      copyCanvasToTexture(gl, finalCanvas, stageTexture);
      copyCanvasToTexture(gl, laserCanvas, displayTexture);

      drawScene({
        gl,
        programInfo,
        stageTexture,
        displayTexture,
        now,
        stretch,
        x: 0,
        y,
        z: 0,
        fogDepth: kick
          ? -STAGE_DEPTH - (kickLength - (now - kickStart)) / 100
          : -STAGE_DEPTH,
        //bgColor: hsvToRgb((Math.floor(now * 0.1) % 100) / 100, 1.0, 1.0),
        bgColor,
        kickCounter,
      });

      if (showEvents) {
        updateEvents(timeline, now);
      }
    }
    requestAnimationFrame(render);
  }

  glCanvas.classList.add("canvas-animations");

  requestAnimationFrame(render);
  const fpsCounter = setInterval(() => {
    fpsOutputElement.textContent = fps;
    fps = 0;
  }, 1000);
}

function drawScene({
  gl,
  programInfo,
  stageTexture,
  displayTexture,
  now,
  stretch,
  x,
  y,
  z,
  fogDepth,
  bgColor,
  kickCounter,
}) {
  fps++;
  gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0); // Clear to black, fully opaque
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
      x + Math.cos(now * 0.0005) * 0.15,
      y + Math.sin(now * 0.0001) * 0.15,
      z + 2.0 + Math.sin(now * 0.0005) * 2.0,
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
  gl.uniform1f(programInfo.uniforms.w, gl.canvas.width);
  gl.uniform1f(programInfo.uniforms.h, gl.canvas.height);

  gl.uniform1f(programInfo.uniforms.kickCounter, kickCounter);
  gl.uniform1f(programInfo.uniforms.effectNro, effectNro);
  gl.uniform1f(programInfo.uniforms.effectFade, effectFade * 0.0001);
  gl.uniform1f(programInfo.uniforms.effectFadeNro, effectFadeNro);

  gl.uniform1f(programInfo.uniforms.uTime, now * 0.0001);
  gl.uniform1f(programInfo.uniforms.uStretch, stretch);
  gl.uniform1f(programInfo.uniforms.uFogDepth, fogDepth);
  gl.uniform4fv(programInfo.uniforms.uFogColor, bgColor);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, stageTexture);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniforms.uSampler, 0);

  //setPositionAttribute(gl, geometry.stage.buffers.position, programInfo);
  //setTextureAttribute(gl, geometry.stage.buffers.textureCoord, programInfo);
  // Tell WebGL which indices to use to index the vertices
  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.stage.buffers.indices);

  /*
  // Tell WebGL we want to affect shadow texture unit 1
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture to texture unit 1
  gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
  // Tell the shader we bound the texture to texture unit 1
  gl.uniform1i(programInfo.uniforms.uSampler2, 1);
*/
  /*
  {
    const vertexCount = geometry.stage.indices.length; // 4 * 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }*/
  drawGeometry(gl, geometry.stage, programInfo);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, displayTexture);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniforms.uSampler, 0);

  drawGeometry(gl, geometry.display, programInfo);
}

function drawGeometry(gl, geometry, programInfo) {
  setPositionAttribute(gl, geometry.buffers.position, programInfo);
  setTextureAttribute(gl, geometry.buffers.textureCoord, programInfo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.buffers.indices);
  gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
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

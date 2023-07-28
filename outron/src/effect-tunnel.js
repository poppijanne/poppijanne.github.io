const TEXTURES = {
  STRIPES: 1,
  GRID: 2,
};

class TunnelEffect {
  constructor({ id, canvas, showTextures = false }) {
    this.id = id;
    this.canvas = canvas;
    this.gl = this.canvas.getContext("webgl");

    this.bgColor = [0, 0, 0, 1];

    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;
    this.kickLength = 400;
    this.kickCounter = 0;

    this.hit = false;
    this.hitId = undefined;

    this.paletteIndex = 0;

    this.stretchTarget = 0;
    this.stretchTime = 0;
    this.stretchStart = 0;

    //this.shake = false;
    this.shakeId = "";
    this.shakeCounter = 0;

    const textureWidth = 128;
    const textureHeight = 512;

    this.wallCanvas = document.createElement("canvas");
    this.wallCanvas.width = textureWidth;
    this.wallCanvas.height = textureHeight;
    if (showTextures)
      document.getElementById("debug-canvas").appendChild(this.wallCanvas);

    this.laserCanvas = document.createElement("canvas");
    this.laserCanvas.width = 256;
    this.laserCanvas.height = 256;
    if (showTextures)
      document.getElementById("debug-canvas").appendChild(this.laserCanvas);

    this.lightCanvas1 = createTunnelLightCanvas1(
      this.gl,
      textureWidth,
      textureHeight
    );
    if (showTextures)
      document.getElementById("debug-canvas").appendChild(this.lightCanvas1);

    this.lightCanvas2 = createTunnelLightCanvas2(
      this.gl,
      textureWidth,
      textureHeight
    );
    if (showTextures)
      document.getElementById("debug-canvas").appendChild(this.lightCanvas2);

    this.finalCanvas = document.createElement("canvas");
    this.finalCanvas.width = textureWidth;
    this.finalCanvas.height = textureHeight;
    if (showTextures)
      document.getElementById("debug-canvas").appendChild(this.finalCanvas);

    this.ambientLightCanvas = createAmbientLightCanvas(
      this.gl,
      textureWidth,
      textureHeight
    );
    if (showTextures)
      document
        .getElementById("debug-canvas")
        .appendChild(this.ambientLightCanvas);

    this.stripes = [];

    let y = 0;

    while (y < textureHeight) {
      const height = Math.max(
        6,
        Math.ceil(Math.random() * (textureHeight / 32))
      );
      this.stripes.push(
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

    this.programInfo = new ProgramInfo({
      gl: this.gl,
      vertexShaderId: "tunnel-vertex-shader",
      fragmentShaderId: "tunnel-fragment-shader",
      attributes: ["vertexPosition", "textureCoord"],
      uniforms: [
        "projectionMatrix",
        "modelViewMatrix",
        "sampler",
        "stretch",
        "flicker",
      ],
    });

    this.programInfo.addBuffersFromGeometry("stage", geometry.stage);
    this.programInfo.addBuffersFromGeometry("display", geometry.display);

    this.wallTexture = createTexture(this.gl, textureWidth, textureHeight);
    this.displayTexture = createTexture(this.gl, textureWidth, textureHeight);

    mergeCanvas(this.finalCanvas, this.wallCanvas);
    mergeCanvas(this.finalCanvas, this.ambientLightCanvas);
    copyCanvasToTexture(this.gl, this.finalCanvas, this.wallTexture);
    copyCanvasToTexture(this.gl, this.laserCanvas, this.displayTexture);

    // Flip image pixels into the bottom-to-top order that WebGL expects.
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  processEvents(events = [], now = 0, delta = 1) {
    this.stretchTarget = 0;
    this.stretchTime = 0;
    this.stretchStart = 0;

    this.hit = false;
    this.hitId = undefined;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;

    events.forEach((event) => {
      switch (event.type) {
        case EVENT_TYPES.PALETTE:
          this.paletteIndex = event.params.index;
          //debugOutputElement.textContent = event.params.index;
          break;

        case EVENT_TYPES.HIT:
          if (now - event.start < 100) {
            this.hit = true;
            this.hitId = event.id;
          }
          break;
        case EVENT_TYPES.KICK:
          if (now - event.start < this.kickLength) {
            this.kick = true;
            this.kickId = event.id;
            this.kickStart = event.start;
            if (this.shakeId !== event.id) {
              this.shakeId = event.id;
              this.shakeCounter = 1.0;
            }
            //this.shake = true;
            //this.shakeStart = event.start;
          }
          break;
        case EVENT_TYPES.TEXTURE:
          switch (event.params.texture) {
            case TEXTURES.STRIPES:
              generateStripesToCanvas(
                this.wallCanvas,
                this.stripes,
                now,
                stripePalettes[this.paletteIndex],
                this.hit,
                delta
              );
              break;
            case TEXTURES.GRID:
              generateGridToCanvas(
                this.wallCanvas,
                gridPalettes[this.paletteIndex],
                now,
                this.hit,
                delta,
                this.bgColor
              );
              break;
            default:
              break;
          }
          break;
        case EVENT_TYPES.STRETCH:
          this.stretchStart = event.start;
          this.stretchTarget = event.params.stretch;
          this.stretchTime = event.params.time;
          break;
        case EVENT_TYPES.LIGHT_COLOR:
          const targetColor = lightPalette[event.params.index];
          this.bgColor[0] = (this.bgColor[0] * 99 + targetColor[0]) / 100;
          this.bgColor[1] = (this.bgColor[1] * 99 + targetColor[1]) / 100;
          this.bgColor[2] = (this.bgColor[2] * 99 + targetColor[2]) / 100;
          break;
        default:
          break;
      }
    });
  }

  render(now = 0, delta = 1) {
    const gl = this.gl;

    let stretch = 0;

    if (this.stretchTarget > 0) {
      stretch =
        easeInOutQuart(
          Math.min(1, (now - this.stretchStart) / this.stretchTime)
        ) * this.stretchTarget;
    } else {
      stretch =
        8 -
        easeInOutQuart(
          Math.min(1, (now - this.stretchStart) / this.stretchTime)
        ) *
          8;
    }

    drawLasers(
      this.laserCanvas,
      this.kick,
      this.kickId,
      this.hit,
      this.hitId,
      delta,
      this.bgColor,
      now
    );

    setTunnelLightCanvasColor(this.lightCanvas1, this.bgColor);
    setTunnelLightCanvasColor(this.lightCanvas2, this.bgColor);
    mergeCanvas(this.finalCanvas, this.wallCanvas);
    mergeCanvas(this.finalCanvas, this.ambientLightCanvas, "overlay");
    mergeCanvas(this.finalCanvas, this.lightCanvas1, "source-over");

    let y = 0,
      x = 0,
      z = 0;
    let f = 1.0 - (now - this.kickStart) / this.kickLength;
    //this.kickCounter = f;

    if (this.kick) {
      mergeCanvas(this.finalCanvas, this.lightCanvas2, "source-over", f);
    }

    if (this.shakeCounter > 0) {
      y = Math.sin(this.shakeCounter * 20.0) * 0.02 /* * f*/;
      this.shakeCounter -= 0.1;
    }
    //
    //mergeCanvas(finalCanvas, shadowCanvas, "multiply");
    copyCanvasToTexture(gl, this.finalCanvas, this.wallTexture);
    copyCanvasToTexture(gl, this.laserCanvas, this.displayTexture);

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.programInfo.program);
    gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 1.0); // Clear to BG color, fully opaque
    //gl.clearDepth(1.0); // Clear everything
    //gl.enable(gl.DEPTH_TEST); // Enable depth testing
    //gl.depthFunc(gl.LEQUAL); // Near things obscure far things
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

    // Set the shader uniforms
    gl.uniformMatrix4fv(
      this.programInfo.uniforms.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      this.programInfo.uniforms.modelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.uniform1f(this.programInfo.uniforms.stretch, stretch);

    gl.uniform1f(
      this.programInfo.uniforms.flicker,
      (Math.sin(now * 0.03) + Math.cos(now * 0.02)) * 0.01
    );

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.wallTexture);
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(this.programInfo.uniforms.sampler, 0);

    drawGeometry(gl, this.programInfo.buffers.stage, this.programInfo);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.displayTexture);
    gl.uniform1i(this.programInfo.uniforms.sampler, 0);

    drawGeometry(gl, this.programInfo.buffers.display, this.programInfo);
  }
}

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
    // copy target canvas to stripe canvas
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

    // draw rect to right edge with stripe color
    this.context.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    this.context.fillRect(
      this.canvas.width - this.steps * delta - 1,
      0,
      this.steps * delta + 1,
      this.canvas.height
    );

    // add black line on top and bottom
    this.context.fillStyle = `rgba(0,0,0,${alpha})`;
    this.context.fillRect(
      this.canvas.width - this.steps * delta - 1,
      0,
      this.steps * delta + 1,
      1
    );
    this.context.fillRect(
      this.canvas.width - this.steps * delta - 1,
      this.canvas.height - 1,
      this.steps * delta + 1,
      1
    );

    context.globalAlpha = alpha;

    context.drawImage(
      this.canvas,
      0,
      this.y + (Math.random() - Math.random()) * jitter
    );

    //context.drawImage(this.canvas, 0, this.y + 0.1 * jitter);
    //context.drawImage(this.canvas, 0, this.y - 0.1 * jitter);

    //context.drawImage(this.canvas, 0, this.y);

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

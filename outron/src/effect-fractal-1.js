class Fractal1Effect {
  constructor({ id, canvas, clear = true }) {
    this.id = id;
    this.canvas = canvas;
    this.clear = clear;
    this.gl = this.canvas.getContext("webgl");
    this.step = 0;
    this.halfResolution = true;
    this.halfStep = true;

    this.bgColor = [0, 0, 0, 1];

    this.hit = false;
    this.hitId = undefined;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;
    this.kickLength = 400;
    this.kickCounter = 0;

    this.programInfo = new ProgramInfo({
      gl: this.gl,
      vertexShaderId: "flat-vertex-shader",
      fragmentShaderId: "fractal-1-fragment-shader",
      attributes: ["vertexPosition"],
      uniforms: [
        "width",
        "height",
        "time",
        "kickCounter",
        "color",
        "flicker",
        "rotate1",
        "rotate2",
      ],
    });

    this.programInfo.addBuffersFromGeometry("display", geometry.screen);

    this.rotate2Matrix = [
      Math.cos(0.1),
      -Math.sin(0.1),
      Math.sin(0.1),
      -Math.cos(0.1),
    ];
  }

  processEvents(events = [], now = 0, delta = 1) {
    this.hit = false;
    this.hitId = undefined;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;

    events.forEach((event) => {
      switch (event.type) {
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
            this.shake = true;
            this.shakeStart = event.start;
          }
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

  render(now = 0) {
    const gl = this.gl;

    let f = 1.0 - (now - this.kickStart) / this.kickLength;
    this.kickCounter = f;
    const time = now * 0.0001;
    const timePlusKick =
      (time + (this.kickCounter > 0 ? this.kickCounter * 0.01 : 0)) * 7.0;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.programInfo.program);
    if (this.clear) {
      gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 0.0); // Clear to BG color, fully opaque
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    gl.uniform1f(this.programInfo.uniforms.width, gl.canvas.width);
    gl.uniform1f(this.programInfo.uniforms.height, gl.canvas.height);

    gl.uniform1f(this.programInfo.uniforms.kickCounter, this.kickCounter);
    gl.uniform1f(
      this.programInfo.uniforms.flicker,
      (Math.sin(time * 300.0) + Math.cos(time * 200.0)) * 0.01
    );

    gl.uniform1f(this.programInfo.uniforms.time, timePlusKick);
    gl.uniform4fv(this.programInfo.uniforms.color, [
      this.bgColor[0],
      this.bgColor[1],
      this.bgColor[2],
      1.0,
    ]);

    const a = 0.1 + timePlusKick * 0.1;

    this.rotate1Matrix = [Math.cos(a), -Math.sin(a), Math.sin(a), -Math.cos(a)];

    gl.uniformMatrix2fv(
      this.programInfo.uniforms.rotate1,
      false,
      this.rotate1Matrix
    );
    gl.uniformMatrix2fv(
      this.programInfo.uniforms.rotate2,
      false,
      this.rotate2Matrix
    );

    drawGeometry(gl, this.programInfo.buffers.display, this.programInfo);
  }
}

class MetaBallsEffect {
  constructor({ id, canvas, display = true, clear = true }) {
    this.id = id;
    this.display = display;
    this.canvas = canvas;
    this.clear = clear;
    this.gl = this.canvas.getContext("webgl");
    this.step = 0;
    this.halfStep = true;
    //this.halfResolution = true;

    this.bgColor = [0, 0, 0, 1];

    this.hit = false;
    this.hitId = undefined;
    this.hitCounter = 0;
    this.hitLength = 300;
    this.shakeCounter = 0;
    this.shakeLength = 500;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;
    this.kickLength = 300;
    this.kickCounter = 0;

    this.programInfo = new ProgramInfo({
      gl: this.gl,
      vertexShaderId: "flat-vertex-shader",
      fragmentShaderId: "metaball-fragment-shader",
      attributes: ["vertexPosition"],
      uniforms: [
        "width",
        "height",
        "time",
        "kickCounter",
        "hitCounter",
        "color",
        "flicker",
        "lightPosition",
        "rayOrigin",
        "noise[0]",
        "noise[1]",
        "noise[2]",
        "noise[3]",
        "noise[4]",
        "noise[5]",
        "noise[6]",
        "noise[7]",
        "noise[8]",
        "noise[9]",
        "noise[10]",
        "noise[11]",
        "noise[12]",
        "noise[13]",
        "noise[14]",
        "noise[15]",
        "noise[16]",
        "noise[17]",
        "noise[18]",
        "noise[19]",
        "noise[20]",
        "noise[21]",
        "noise[22]",
        "noise[23]",
      ],
    });

    this.programInfo.addBuffersFromGeometry("display", geometry.screen);

    this.noise = [];
    for (let i = 0; i < 12; i++) {
      this.noise.push(noise(i));
      console.log(noise(i));
    }
    for (let i = 0; i < 12; i++) {
      this.noise.push(noise(i + 18));
      console.log(noise(i + 18));
    }
  }

  processEvents(events = [], now = 0, delta = 1) {
    this.hit = false;
    this.hitId = undefined;
    this.hitStart = 0;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;
    this.shakeStart = 0;

    events.forEach((event) => {
      switch (event.type) {
        case EVENT_TYPES.HIT:
          if (now - event.start < this.hitLength) {
            this.hit = true;
            this.hitId = event.id;
            this.hitStart = event.start;
          }
          break;
        case EVENT_TYPES.SHAKE:
          if (now - event.start < this.shakeLength) {
            this.shakeStart = event.start;
          }
          break;
        case EVENT_TYPES.KICK:
          if (now - event.start < this.kickLength) {
            this.kick = true;
            this.kickId = event.id;
            this.kickStart = event.start;
            //this.shake = true;
            //this.shakeStart = event.start;
          }
          break;
        case EVENT_TYPES.LIGHT_COLOR:
          const targetColor = lightPalette[event.params.index];
          this.bgColor[0] = (this.bgColor[0] * 49 + targetColor[0]) / 50;
          this.bgColor[1] = (this.bgColor[1] * 49 + targetColor[1]) / 50;
          this.bgColor[2] = (this.bgColor[2] * 49 + targetColor[2]) / 50;
          break;
        default:
          break;
      }
    });
  }

  render(now = 0) {
    if (!this.display) {
      return;
    }

    const gl = this.gl;

    let f = Math.max(0, 1.0 - (now - this.kickStart) / this.kickLength);
    //this.kickCounter = f;
    this.kickCounter = Math.cos(now * 0.05) * f * 0.05;

    const time = now * 0.0001;
    const timePlusKick = (time + (f > 0 ? f * 0.01 : 0)) * 3.0;

    f = Math.max(0, 1.0 - (now - this.hitStart) / this.hitLength);
    this.hitCounter = Math.sin(now * 0.1) * f * 0.05;

    f = Math.max(0, 1.0 - (now - this.shakeStart) / this.shakeLength);
    this.hitCounter += Math.cos(now * 0.9) * f * 0.2;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.programInfo.program);
    if (this.clear) {
      gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 0.0); // Clear to BG color, fully opaque
      //gl.clearDepth(1.0); // Clear everything

      //gl.enable(gl.DEPTH_TEST); // Enable depth testing
      //gl.depthFunc(gl.LEQUAL); // Near things obscure far things
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    gl.uniform1f(this.programInfo.uniforms.width, gl.canvas.width);
    gl.uniform1f(this.programInfo.uniforms.height, gl.canvas.height);

    gl.uniform1f(this.programInfo.uniforms.kickCounter, this.kickCounter);
    gl.uniform1f(this.programInfo.uniforms.hitCounter, this.hitCounter);
    gl.uniform1f(
      this.programInfo.uniforms.flicker,
      (Math.sin(time * 300.0) + Math.cos(time * 200.0)) * 0.01
    );

    const s = Math.sin(timePlusKick);
    const c = Math.cos(timePlusKick);
    const rayOrigin = { x: 0, y: 1, z: -4 };
    rayOrigin.x *= c;
    rayOrigin.x *= -s;
    rayOrigin.y *= s;
    rayOrigin.y *= c;

    gl.uniform3f(this.programInfo.uniforms.lightPosition, 0, 0, 9);
    gl.uniform3f(
      this.programInfo.uniforms.rayOrigin,
      rayOrigin.x,
      rayOrigin.y,
      rayOrigin.z
    );

    gl.uniform1f(this.programInfo.uniforms.time, timePlusKick);
    gl.uniform4fv(this.programInfo.uniforms.color, [
      this.bgColor[0],
      this.bgColor[1],
      this.bgColor[2],
      1.0,
    ]);

    //gl.uniform1fv(this.programInfo.uniforms.noise, this.noise);

    for (let i = 0; i < this.noise.length; i++) {
      gl.uniform1f(this.programInfo.uniforms[`noise[${i}]`], this.noise[i]);
    }

    drawGeometry(gl, this.programInfo.buffers.display, this.programInfo);
  }
}

function noise(n) {
  n *= 210.9524;
  return (
    Math.sin(n * 22.26346) * 1.5 +
    Math.cos(n * 4.3354312) * 0.25 +
    Math.sin(n * 2.233) * 0.1
  );
}

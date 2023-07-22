class CyborgEffect {
  constructor({ id, canvas, clear = true }) {
    this.id = id;
    this.clear = clear;
    this.canvas = canvas;
    this.gl = this.canvas.getContext("webgl");

    this.bgColor = [0, 0, 0, 1];

    this.hit = false;
    this.hitId = undefined;
    this.kick = false;
    this.kickId = undefined;
    this.kickStart = 0;
    this.kickLength = 400;
    this.kickCounter = 0;

    this.element = document.getElementById("cyborg");
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
          this.bgColor[0] = (this.bgColor[0] * 29 + targetColor[0]) / 30;
          this.bgColor[1] = (this.bgColor[1] * 29 + targetColor[1]) / 30;
          this.bgColor[2] = (this.bgColor[2] * 29 + targetColor[2]) / 30;
          break;
        default:
          break;
      }
    });
  }

  render(now = 0) {
    const gl = this.gl;
    let f = Math.max(0, 1.0 - (now - this.kickStart) / this.kickLength);
    this.kickCounter = f;
    const time = now * 0.0001;
    const timePlusKick =
      (time + (this.kickCounter > 0 ? this.kickCounter * 0.01 : 0)) * 40.0;
    const flicker = (Math.sin(time * 300.0) + Math.cos(time * 200.0)) * 0.01;
    /*
    let f = 1.0 - (now - this.kickStart) / this.kickLength;
    this.kickCounter = f;
    const time = now * 0.0001;
    const timePlusKick =
      (time + (this.kickCounter > 0 ? this.kickCounter * 0.01 : 0)) * 3.0;
*/
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(
      Math.min(
        1.0,
        Math.max(0, this.bgColor[0] * 0.75 + flicker + this.kickCounter * 0.5)
      ),
      Math.min(
        1.0,
        Math.max(0, this.bgColor[1] * 0.75 + flicker + this.kickCounter * 0.5)
      ),
      Math.min(
        1.0,
        Math.max(0, this.bgColor[2] * 0.75 + flicker + this.kickCounter * 0.5)
      ),
      1.0
    ); // Clear to BG color, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}

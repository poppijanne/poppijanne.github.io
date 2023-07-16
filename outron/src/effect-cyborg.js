class CyborgEffect {
  constructor({ id, canvas, display = true, clear = true }) {
    this.id = id;
    this.display = display;
    this.canvas = canvas;
    this.clear = clear;
    this.gl = this.canvas.getContext("webgl");

    this.bgColor = [0, 0, 0, 0.5];

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
    if (!this.display) {
      this.element.style.display = "none";
      return;
    }

    this.element.style.display = "flex";

    const gl = this.gl;

    let f = 1.0 - (now - this.kickStart) / this.kickLength;
    this.kickCounter = f;
    const time = now * 0.0001;
    const timePlusKick =
      (time + (this.kickCounter > 0 ? this.kickCounter * 0.01 : 0)) * 3.0;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], 0.0); // Clear to BG color, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.element.style.display = "flex";
  }
}

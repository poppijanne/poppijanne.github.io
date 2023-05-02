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

const EFFECTS = {
  0: {
    name: "Spinning Floppy",
    effects: ["floppy"],
  },
};

class EffectRenderer {
  constructor(effects = [], canvas) {
    this.effects = effects;
    this.bodyElement = document.querySelector("body");
    this.step = 0;
    this.textureToCanvas = new TextureToCanvas({
      id: "texture-to-canvas",
      canvas,
      display: true,
      resolution: 1.5,
    });
    this.canvas = canvas;
    this.context = this.canvas.getContext("webgl", { alpha: false });
    this.texture = WebGLUtils.createTexture(
      this.context,
      this.canvas.width,
      this.canvas.height
    );
  }

  processEvents(effectsId, events = [], now, delta) {
    EFFECTS[effectsId].effects.forEach((effectId) => {
      const effect = this.effects.find((effect) => effect.id === effectId);
      if (effect) {
        effect.processEvents(events, now, delta);
      }
    });
  }

  renderEffects(effectsId, canvas, now, delta, resolution = 1.5) {
    this.bodyElement.style.height = window.innerHeight + "px";

    const width = Math.ceil(window.innerWidth * resolution);
    const height = Math.ceil(window.innerHeight * resolution);
    if (canvas.width !== width || canvas.height !== height) {
      console.log("renderEffect resize canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      this.context.deleteTexture(this.texture);
      this.texture = WebGLUtils.createTexture(
        this.context,
        canvas.width,
        canvas.height
      );
    }
    //const context = canvas.getContext("2d");
    //context.clearRect(0, 0, canvas.width, canvas.height);

    let texture = this.texture;

    EFFECTS[effectsId].effects.forEach((effectId) => {
      const effect = this.effects.find((effect) => effect.id === effectId);
      if (!effect.halfStep || this.step === 0) {
        const fxCanvas = this.renderEffect(effect, canvas, now, delta);
        WebGLUtils.copyCanvasToTexture(this.context, fxCanvas, texture);
      }
      //if (effect.canvas) {
      //  effect.canvas.isUsed = true;
      //}
    });

    this.step = (this.step + 1) % 2;

    this.textureToCanvas.render(now, texture, canvas);

    /* REMOVE
    this.effects.forEach((effect) => {
      if (effect.canvas) {
        if (!effect.canvas.isUsed && effect.canvas.style.display !== "none") {
          effect.canvas.style.display = "none";
        } else if (
          effect.canvas.isUsed &&
          effect.canvas.style.display === "none"
        ) {
          effect.canvas.style.display = null;
        }
      }
    });
    */
  }
  renderEffect(effect, canvas, now, delta, motionblur = true) {
    /*
    const resolution = effect.resolution !== undefined ? effect.resolution : 1;
    const width = Math.ceil(window.innerWidth * resolution);
    const height = Math.ceil(window.innerHeight * resolution);
    if (effect.canvas.width !== width || effect.canvas.height !== height) {
      effect.canvas.width = width;
      effect.canvas.height = height;
      effect.canvas.style.width = "100%";
      effect.canvas.style.height = "100%";
    }*/

    return effect.render({ canvas, now, delta, x: 0, y: 0, z: 0 });

    //const fxCanvas = effect.render(canvas, texture, now, delta, 0, 0, 0);
    //mergeCanvas(canvas.getContext("2d"), fxCanvas, "source-over", 1.0);

    /*
    if (!motionblur) {
      const fxCanvas = effect.render(canvas, now, delta, 0, 0, 0);
      mergeCanvas(canvas.getContext("2d"), fxCanvas, "source-over", 1.0);
    } else {
      const context = canvas.getContext("2d");
      const blurs = [
        [0, 0, 0],
        [1, 0, -1],
        [-1, 0, 0],
        [0, 1, -1],
        [0, -1, 0],
        [-1, -1, -1],
        [1, 1, 0],
        [-1, 1, -1],
        [1, -1, 0],
        [0.9, 0, -0.9],
        [-0.9, 0, 0],
        [0, 0.9, 0.9],
        [0, -0.9, 0],
        [-0.9, -0.9, -0.9],
        [0.9, 0.9, 0],
        [-0.9, 0.9, 0.9],
        [0.9, -0.9, 0],
        [0.8, 0, -0.8],
        [-0.8, 0, 0],
        [0, 0.8, 0.8],
        [0, -0.8, 0],
        [-0.8, -0.8, -0.8],
        [0.8, 0.8, 0],
        [-0.8, 0.8, 0.8],
        [0.8, -0.8, 0],
        [0.7, 0, -0.7],
        [-0.7, 0, 0],
        [0, 0.7, 0.7],
        [0, -0.7, 0],
        [-0.7, -0.7, -0.7],
        [0.7, 0.7, 0],
        [-0.7, 0.7, 0.7],
        [0.7, -0.7, 0],
      ];
      const range = 60;
      const frames = blurs.length - 1; //8 * 4;
      let j = 0;
      for (let i = -range / 2; i <= range / 2; i += range / frames) {
        const x = blurs[j][0] * 0.02;
        const y = blurs[j][1] * 0.02;
        const z = blurs[j][2] * 0.02;
        const fxCanvas = effect.render(canvas, now + i, delta, x, y, z);
        mergeCanvas(context, fxCanvas, "source-over", 1.0 / frames);
        j = (j + 1) % blurs.length;
      }
      
    }
    */
  }
}

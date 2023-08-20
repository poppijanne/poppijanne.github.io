const EFFECTS = {
  0: {
    name: "cube",
    effects: ["cube"],
  },
};

class EffectRenderer {
  constructor(effects = []) {
    this.effects = effects;
    this.bodyElement = document.querySelector("body");
    this.step = 0;
  }
  processEvents(effectsId, events = [], now, delta) {
    EFFECTS[effectsId].effects.forEach((effectId) => {
      const effect = this.effects.find((effect) => effect.id === effectId);
      if (effect) {
        effect.processEvents(events, now, delta);
      }
    });
  }

  renderEffects(effectsId, now, delta) {
    this.bodyElement.style.height = window.innerHeight + "px";

    this.effects.forEach((effect) => {
      if (effect.canvas) {
        effect.canvas.isUsed = false;
      }
    });

    EFFECTS[effectsId].effects.forEach((effectId) => {
      const effect = this.effects.find((effect) => effect.id === effectId);
      if (!effect.halfStep || this.step === 0) {
        this.renderEffect(effect, now, delta);
      }
      if (effect.canvas) {
        effect.canvas.isUsed = true;
      }
    });

    this.step = (this.step + 1) % 2;

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
  }
  renderEffect(effect, now, delta) {
    const resolution = effect.resolution !== undefined ? effect.resolution : 1;
    const width = Math.ceil(window.innerWidth * resolution);
    const height = Math.ceil(window.innerHeight * resolution);
    if (effect.canvas.width !== width || effect.canvas.height !== height) {
      effect.canvas.width = width;
      effect.canvas.height = height;
      effect.canvas.style.width = "100%";
      effect.canvas.style.height = "100%";
    }
    effect.render(now, delta);
  }
}

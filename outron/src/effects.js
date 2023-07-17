const EFFECTS = {
  0: {
    name: "tunnel + metaballs",
    effects: ["tunnel", "metaballs"],
  },
  1: {
    name: "fractal 1",
    effects: ["fractal 1"],
  },
  2: {
    name: "rosebud + metaballs",
    effects: ["rosebud", "metaballs"],
  },
  3: {
    name: "tunnel",
    effects: ["tunnel"],
  },
  4: {
    name: "fractal 2 + metaballs",
    effects: ["fractal 2", "metaballs"],
  },
  5: {
    name: "tunnel + cyborg",
    effects: ["tunnel", "cyborg"],
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
    if (
      window.innerWidth !== effect.canvas.width ||
      window.innerHeight !== effect.canvas.height
    ) {
      if (effect.halfResolution) {
        effect.canvas.width = Math.ceil(window.innerWidth / 3);
        effect.canvas.height = Math.ceil(window.innerHeight / 3);
        effect.canvas.style.width = "100%";
        effect.canvas.style.height = "100%";
      } else {
        effect.canvas.width = window.innerWidth;
        effect.canvas.height = window.innerHeight;
      }
    }
    effect.render(now, delta);
  }
}

class EffectRenderer {
  constructor(effects = []) {
    this.effects = effects;
    this.bodyElement = document.querySelector("body");
    this.step = 0;
  }
  processEvents(events = [], now, delta) {
    this.effects.forEach((effect) => {
      if (effect.display) {
        effect.processEvents(events, now, delta);
      }
    });
  }

  displayEffect(id) {
    const effect = this.effects.find((effect) => effect.id === id);
    if (effect === undefined) {
      console.error(`effect ${id} not found`);
      return;
    }
    effect.display = true;
    this.effects.forEach((e) => {
      if (e.id !== effect.id && e.canvas === effect.canvas) {
        e.display = false;
      }
    });
  }

  hideEffect(id) {
    const effect = this.effects.find((effect) => effect.id === id);
    effect.display = false;
  }

  renderEffects(now, delta) {
    this.bodyElement.style.height = window.innerHeight + "px";
    this.effects.forEach((effect) => {
      if (!effect.halfStep || this.step === 0) {
        this.renderEffect(effect, now, delta);
      }
    });
    this.step = (this.step + 1) % 2;
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

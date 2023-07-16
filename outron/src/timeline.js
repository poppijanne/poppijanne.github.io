class Timeline {
  constructor(events) {
    this.events = events
      .sort((event1, event2) => event1.start - event2.start)
      .map((event) => new Event({ ...event }));
  }

  addEvent(event) {
    const lastIndex = this.events.findLastIndex((other) =>
      other.beginsBefore(event.start)
    );
    if (lastIndex === -1) {
      this.events.push(event);
    } else {
      this.events.splice(lastIndex + 1, 0, event);
    }
  }

  removeEventById(id) {
    this.events = this.events.filter((event) => event.id !== id);
  }

  getCurrentEvents(time) {
    const current = [];
    for (let type in EVENT_TYPES) {
      const startedEventsByType = this.events.filter(
        (event) => event.type === EVENT_TYPES[type] && event.hasStarted(time)
      );
      if (startedEventsByType.length > 0) {
        current.push(startedEventsByType[startedEventsByType.length - 1]);
      }
    }
    return current;
  }

  getEventsByType(type) {
    return this.events.filter((event) => event.type === type);
  }
}

const EVENT_TYPES = {
  HIT: 4,
  KICK: 5,
  PALETTE: 1,
  LIGHT_COLOR: 6,
  TEXTURE: 2,
  STRETCH: 3,
  DISPLAY: 7,
  SHAKE: 8,
  TEXT: 9,
  EFFECT: 10,
  EFFECTFADE: 11,
  toString(type) {
    switch (type) {
      case EVENT_TYPES.HIT:
        return "Hit";
      case EVENT_TYPES.KICK:
        return "Kick";
      case EVENT_TYPES.PALETTE:
        return "Palette";
      case EVENT_TYPES.TEXTURE:
        return "Texture";
      case EVENT_TYPES.STRETCH:
        return "Stretch";
      case EVENT_TYPES.LIGHT_COLOR:
        return "Light Color";
      case EVENT_TYPES.DISPLAY:
        return "Display";
      case EVENT_TYPES.SHAKE:
        return "Shake";
      case EVENT_TYPES.TEXT:
        return "Text";
      case EVENT_TYPES.EFFECT:
        return "Effect";
      case EVENT_TYPES.EFFECTFADE:
        return "Effect Fade";
      default:
        return "?";
    }
  },
};

class Event {
  constructor({ id, type, start = 0, params }) {
    this.id =
      id || `${EVENT_TYPES.toString(type)}-${this.generateId()}`.toLowerCase(); //id;
    this.type = type;
    this.start = Math.round(start);
    if (params && Object.keys(params).length > 0) {
      this.params = params;
    }
  }
  hasStarted(time) {
    return this.start <= time;
  }
  beginsBefore(time) {
    return this.start < time;
  }
  beginsAfter(time) {
    return this.start > time;
  }
  generateId() {
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += Math.floor(Math.random() * 16).toString(16);
    }
    return id;
  }
}

function generateEventId() {
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += Math.random().toString(16);
  }
  return id;
}

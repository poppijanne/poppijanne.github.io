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
  EFFECT: 1,
  BEAT: 2,
  CLASSNAME: 4,
  CAMERA: 10,
  LIGHT: 20,
  LIGHT_COLOR: 21,
  BG_LIGHT_COLOR: 22,
  TEXT: 30,
  toString(type) {
    switch (type) {
      case EVENT_TYPES.EFFECT:
        return "Effect";
      case EVENT_TYPES.BEAT:
        return "Beat";
      case EVENT_TYPES.CLASSNAME:
        return "Class";
      case EVENT_TYPES.CAMERA:
        return "Camera";
      case EVENT_TYPES.LIGHT:
        return "Light";
      case EVENT_TYPES.LIGHT_COLOR:
        return "Light color";
      case EVENT_TYPES.BG_LIGHT_COLOR:
        return "BG light color";
      case EVENT_TYPES.TEXT:
        return "Text";
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

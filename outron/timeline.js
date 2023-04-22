class Timeline {
  constructor(events) {
    this.events = events
      .sort((event1, event2) => event1.start - event2.start)
      .map((event) => new Event({ ...event }));
  }

  addEvent(event) {
    const lastIndex = this.events.findLastIndex(
      (other) => other.type === event.type && other.beginsBefore(event.start)
    );
    if (lastIndex === -1) {
      this.events.push(event);
    } else {
      this.events.splice(lastIndex + 1, 0, event);
    }
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
}

class Event {
  constructor({ id, type, start = 0, params = {} }) {
    this.id = id;
    this.type = type;
    this.start = start;
    this.params = params;
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
}

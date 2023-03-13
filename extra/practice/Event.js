class CustomEvent {
  eventHandler = {};
  on(event, handler) {
    if (!this.eventHandler[event]) {
      this.eventHandler[event] = [];
    }
    this.eventHandler[event].push(handler);
  }
  once(event, handler) {
    const callback = ({ eventMsg, type: event }) => {
      handler({ eventMsg, type: event });
      this.off(event, handler);
    };
    if (!this.eventHandler[event]) {
      this.eventHandler[event] = [];
    }
    this.eventHandler[event].push(callback);
  }
  emit(event, eventMsg) {
    if (this.eventHandler[event]) {
      this.eventHandler[event].forEach((handler) => {
        handler({ eventMsg, type: event });
      });
    }
  }
  off(event, handler) {
    if (this.eventHandler[event]) {
      this.eventHandler[event] = this.eventHandler[event].filter(
        (item) => item !== handler
      );
    }
  }
}

let a = new CustomEvent();
a.on("msg", () => {
  console.log("msg on");
});
a.emit("msg");

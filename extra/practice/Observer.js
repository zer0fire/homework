class Subject {
  constructor() {
    this.observerList = [];
  }
  addObserver(observer) {
    this.observerList.push(observer);
  }
  removeObserver(observer) {
    this.observerList = this.observerList.filter((other) => observer !== other);
  }
  notifyObserver(message) {
    this.observerList.forEach((observer) => observer.notified(message));
  }
}
class Observer {
  constructor(name, subject) {
    this.name = name;
    if (subject) {
      subject.addObserver(this);
    }
  }
  notified(message) {
    console.log(this.name, "got message", message);
  }
}

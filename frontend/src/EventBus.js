
class EventBus {

  constructor() {
    this.eventListeners = {}
  }

  addListener(eventType, cb) {
    if(!this.eventListeners.hasOwnProperty(eventType)) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(cb);
  }

  removeListener(eventType, cb) {
    if(this.eventListeners.hasOwnProperty(eventType)) {
      this.eventListeners[eventType].foreach((el, index) => {
        if(el === cb) {
          //remove this listener from the listeners array
          this.eventListeners[eventType].splice(index,1);
        }
      });
    }
  }

  fireEvent(eventType, args) {
    if(this.eventListeners.hasOwnProperty(eventType)) {
      this.eventListeners[eventType].forEach((cb) => {
        cb(...args);
      });
    }
  }
}

//single instance that will be used by entire app
const appEventBus = new EventBus();

export default appEventBus;

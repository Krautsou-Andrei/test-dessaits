export default function Listeners() {
  this.entries = [];
}

Listeners.prototype.add = function (element, event, fn) {
  this.entries.push({ element: element, event: event, fn: fn });
  element.addEventListener(event, fn);
};



Listeners.prototype.removeByElement = function (element) {
  this.entries = this.entries.filter(function (listener) {
    if (listener.element === element) {
      element.removeEventListener(listener.event, listener.fn);
      return false; 
    }
    return true; 
  });
};

Listeners.prototype.removeAll = function () {
  this.entries = this.entries.filter(function (listener) {
    listener.element.removeEventListener(listener.event, listener.fn);
    return false;
  });
};

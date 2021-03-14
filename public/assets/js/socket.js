export default class Socket {
  constructor(token, callback) {
    this.token = token;
    this.current = io(``);
    this.init(callback);
  }

  bindEvents(callback) {
    this.current.on('newRequest', callback);
  }

  joinRoom() {
    this.current.emit('joinRoom', this.token);
  }

  init(callback) {
    this.joinRoom();
    this.bindEvents(callback);
  }
}

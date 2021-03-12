let socket;
class Socket {
  constructor(token) {
    this.token = token
    this.current = io(`http://127.0.0.1:3000/`);
    this.requests = []
    this.init()
  }

  bindEvents() {
    // this.current.on('findDir', this.getRequests.bind(this))
    this.current.on('newRequest', this.handleRequest.bind(this));
  }

  joinRoom() {
    this.current.emit('joinRoom', this.token);
  }

  getRequests(requests) {
    this.requests = requests
  }

  handleRequest(request) {
    this.requests.push(request)
    // ezra magic
  }

  init() {
    this.joinRoom();
    this.bindEvents()
  }

}

document.addEventListener('DOMContentLoaded', event => {
  const bin = window.location.toString().split('?bin=')[1];

  socket = new Socket(bin)
})
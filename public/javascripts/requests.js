
class Requests {
  constructor(bin) {
    this.bin = bin;
    this.list = document.querySelector('#requests')
    this.getRequests()
    // this.bindEvents()
  }

  bindEvents() {
    // const button = document.querySelector('#newBin')
    // button.addEventListener('click', this.makeBin.bind(this))
  }

  getRequests() {
    // event.preventDefault()
    fetch(`http://localhost:3000/find/${this.bin}`)
    .then(response => response.json())
    .then(({requests}) => {
      if (requests.length > 0) {
        this.list.innerText = ""
      } else {
        this.list.innerText = 'there are no requests, try making a request to /r/' + this.bin
        return
      }
      requests.forEach(request => {
        const li = document.createElement('li');
        li.innerText = JSON.stringify(request)
        this.list.appendChild(li)
      })
    })
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const params = window.location.pathname.split('/')
  const bin = params[params.length - 1]
  new Requests(bin)
})
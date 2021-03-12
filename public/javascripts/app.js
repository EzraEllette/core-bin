// const API = require("./api")

// const API = require('./api')
class App {
  constructor() {
    this.bindEvents()
  }

  bindEvents() {
    const button = document.querySelector('#newBin')
    button.addEventListener('click', this.makeBin.bind(this))
  }

  makeBin(event) {
    event.preventDefault()
    fetch('/getBin')
      .then(res => {
        console.log(res)
        return res.text()
      })
      .then(data => {
        console.log(data)
        const p = document.createElement('p')
        p.innerText = `You have a new bin! please try accessing it at: ${JSON.stringify(data)}`
        document.querySelector('div').replaceChild(p, document.querySelector('#newBinForm'))
      })
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new App
})
// module.exports = App
const createBinButton = document.getElementById("create-bin");
const myBinsButton = document.getElementById('mostRecent')
createBinButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let token = (await (await fetch("http://localhost:3000/getBin")).json()).bin;
  if (!window.localStorage.getItem("bins")) {
    window.localStorage.setItem("bins", {token: Date.now()});
  } else {
    let bins = window.localStorage.getItem("bins");
    let keys = Object.keys(bins)
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i]
      let v = bins[k]
      if (Date.now() - v > 1200000) {
        delete bins[k]
      }
    }
    // for (let k, v in bins) { // for some reason this format does not work in chrome
    //   if (Date.now() - v > 1200000) {
    //     delete bins[k]
    //   }
    // }
    bins[token] = Date.now();
  }
  location.href = `/requests.html?bin=${token}`;
});


myBinsButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const mostRecent = window.localStorage.getItem('mostRecent')
  if (!mostRecent) return;
  let page = (await (await fetch(mostRecent)).html());
  document.body.innerHTML = page
  location.href = `/requests.html?bin=${token}`;
});

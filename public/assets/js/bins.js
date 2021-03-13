const createBinButton = document.getElementById("create-bin");

createBinButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let token = (await (await fetch("http://localhost:3000/getBin")).json()).bin;
  if (!window.localStorage.getItem("bins")) {
    window.localStorage.setItem("bins", {token: Date.now()});
  } else {
    let bins = window.localStorage.getItem("bins");
    for (let k, v in bins) {
      if (Date.now() - v > 1200000) {
        delete bins[k]
      }
    }
    bins[token] = Date.now();
  }
  console.log(token);
  location.href = `/requests.html?bin=${token}`;
});
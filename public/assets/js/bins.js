const createBinButton = document.getElementById("create-bin");
const modalLayer = document.getElementById("modal-layer");
const modalBox = document.getElementById("modal-box");

function updateBinsBar(token) {
  const binBar = Handlebars.compile(document.getElementById("bins-bar").innerText);
  let bins = JSON.parse(window.localStorage.getItem("bins"));
  if (!bins) {
    bins = {};
  } else {
    for (const k in bins) {
      if (Date.now() - bins[k] > 1200000) {
        delete bins[k]
      }
    }
  }

  if (token) {
    bins[token] = Date.now();
  }
  window.localStorage.setItem("bins", JSON.stringify(bins));

  console.log(JSON.stringify(bins));
  if (Object.keys(bins).length == 0) {
    modalBox.innerText = "There are no bins right now";
  } else {
    console.log(binBar({bins}));
    modalBox.innerHTML = binBar({bins});
  }
}

updateBinsBar();

createBinButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let token = (await (await fetch("http://localhost:3000/getBin")).json()).bin;
  updateBinsBar(token);
  location.href = `/requests.html?bin=${token}`;
});

const myBins = document.getElementById("bins");

myBins.addEventListener("click", (e) => {
  updateBinsBar();
  modalLayer.style.setProperty("display", "inherit")
});

document.getElementById("modal-layer").addEventListener("click", (e) => {
  if (e.currentTarget === e.target) {
    e.target.style.setProperty("display", "none");
  }
});
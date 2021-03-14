import Socket from './socket.js';


const formatRequests = (() => {
  let i = 0;
  return (req) => {
    if (Object.keys(req.headers).length === 0) {
      req.headers = null;
    }

    if (Object.keys(req.body).length === 0) {
      req.body = null;
    } else {
      req.body = JSON.stringify(req.body, null, "   ");
    }
    req.i = i;
    console.log(i);
    i++
  };
})();

const modalLayer = document.getElementById("modal-layer");
const modalBox = document.getElementById("modal-box");

function updateBinsBar(token) {
  const binBar = Handlebars.compile(document.getElementById("bins-bar").innerText);
  let bins = JSON.parse(window.localStorage.getItem("bins"));
  if (!bins) {
    bins = {};
  } else {
    for (let [k, v] in bins) {
      if (Date.now() - v > 1200000) {
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
const myBins = document.getElementById("bins");
updateBinsBar();
myBins.addEventListener("click", (e) => {
  updateBinsBar();
  modalLayer.style.setProperty("display", "inherit")
});

document.getElementById("modal-layer").addEventListener("click", (e) => {
  e.target.style.setProperty("display", "none");
});

(async () => {
  const bin = window.location.toString().split('?bin=')[1];
  document.getElementById("bin-link").innerText = `http://localhost:3000/r/${bin}`;
  const requests = await (await fetch(`http://localhost:3000/bin/${bin}`)).json();
  console.log(requests);

  requests.requests.forEach(formatRequests);

  Handlebars.registerPartial("request-part", document.getElementById("request-part").innerText);
  const requestPartial = Handlebars.compile(document.getElementById("request-part").innerText);
  Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

  const requestsTemplate = Handlebars.compile(document.getElementById("requests-temp").innerText);

  const placeForRequests = document.getElementById("place-for-requests");
  placeForRequests.innerHTML = requestsTemplate(requests);

  new Socket(bin, (request) => {
    formatRequests(request);
    placeForRequests.innerHTML += requestsTemplate({requests: [request]});
  });


})();
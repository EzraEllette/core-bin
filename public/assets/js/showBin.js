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

(async () => {
  const bin = window.location.toString().split('?bin=')[1];
  document.getElementById("bin-link").innerText = `http://localhost:3000/r/${bin}`;
  const requests = await (await fetch(`http://localhost:3000/bin/${bin}`)).json()

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
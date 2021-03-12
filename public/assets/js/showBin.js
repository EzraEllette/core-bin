(async () => {
  const bin = window.location.toString().split('?bin=')[1];
  document.getElementById("bin-link").innerText = `http://localhost:3000/r/${bin}`;
  const requests = await (await fetch(`http://localhost:3000/bin/${bin}`)).json()

  requests.requests.forEach((req) => {
    if (Object.keys(req.headers).length === 0) {
      req.headers = null;
    }

    if (Object.keys(req.body).length === 0) {
      req.body = null;
    } else {
      req.body = JSON.stringify(req.body, null, "   ");
    }
  });

  Handlebars.registerPartial("request-part", document.getElementById("request-part").innerText);

  Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

  const requestsTemplate = Handlebars.compile(document.getElementById("requests-temp").innerText);

  document.getElementById("place-for-requests").innerHTML = requestsTemplate(requests);
})();
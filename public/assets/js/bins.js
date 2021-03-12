const createBinButton = document.getElementById("create-bin");

createBinButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let token = (await (await fetch("http://localhost:3000/getBin")).json()).bin;
  console.log(token);
  location.href = `/requests.html?bin=${token}`;
});
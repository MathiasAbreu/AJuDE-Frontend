
async function verificaTokenExpirado(responseMessage) {
  const responseTexto = await responseMessage.text()
  const responseJson = await JSON.parse(responseTexto)

  if (responseJson["message"].startsWith("Token expirado")) {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userEmail")
    alert("O seu token atual foi expirado, faça o login novamente para prosseguir")
  }
}

const modSignIn = document.getElementById("signInMod");

const campanhaModal = document.getElementById("campanhaMod");


function killAllChildren(elemento) {
  let $campanhaContainer = document.querySelector(elemento);
  if (!$campanhaContainer) return;
  while ($campanhaContainer.firstChild) {
    $campanhaContainer.removeChild($campanhaContainer.firstChild);
  }
}

const checaUsuarioLogado = function () {
  if (localStorage.getItem("userToken") == null) {
    alert("Faça login para prosseguir")
    modSignIn.style.display = "flex";
    return true;
  }
}

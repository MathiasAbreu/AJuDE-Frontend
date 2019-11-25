
async function verificaTokenExpirado(responseMessage) {
  const responseTexto = await responseMessage.text()
  const responseJson = await JSON.parse(responseTexto)

  if (responseJson["message"].startsWith("JWT expirada")) {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userEmail")
    alert("O seu token atual foi expirado, faça o login novamente para prosseguir")
  }
}

const modSignIn = document.getElementById("signInMod");

const discModal = document.getElementById("campanhaMod");


function killAllChildren(elemento) {
  let $discContainer = document.querySelector(elemento);
  if (!$discContainer) return;
  while ($discContainer.firstChild) {
    $discContainer.removeChild($discContainer.firstChild);
  }
}

const checaUsuarioLogado = function () {
  if (localStorage.getItem("userToken") == null) {
    alert("Faça login para prosseguir")
    modSignIn.style.display = "flex";
    return true;
  }
}

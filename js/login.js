import usuarioDadosLogin from "./usuario.js";

const $signUpBt = document.getElementById("signUpBt");
const $signInBt = document.getElementById("signInBt");

const modSignIn = document.getElementById("signInMod");
const modSignUp = document.getElementById("signUpMod");

const campanhaModal = document.getElementById("disciplinaMod");
const btNav = document.getElementById("userEntries");

$signInBt.onclick = () => signIn();
$signUpBt.onclick = () => signUp();

window.onclick = (event) => {
    if (event.target == modSignIn || event.target == modSignUp) {
        modSignIn.style.display = "none"
        modSignUp.style.display = "none"
    } else if (event.target == campanhaModal) {
        campanhaModal.style.display = "none";
    }
}


async function signIn() {
    usuarioDadosLogin.signIn(document.forms["signIn"])
    const jsonBody = JSON.stringify(usuarioDadosLogin.signInToJson());

    const fetcher = await fetch("https://ucdb-plataform1.herokuapp.com/api/v1/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: jsonBody
    })

    const responseTxt = await fetcher.text()

    if (!fetcher.ok) {
        const responseJson = await JSON.parse(responseTxt)
        alert(responseJson["message"] + "\nPor favor, tente novamente.")
        throw new Error("Falha no login, tente novamente!");
    }

    alert("Login feito com sucesso!");
    modSignIn.style.display = "none";
    localStorage.setItem("userToken", responseTxt)
    localStorage.setItem("userEmail", usuarioDadosLogin.signInToJson()["email"])

    aparecerDisconnect()
}


function signUp() {
    usuarioDadosLogin.signUp(document.forms["signUp"])
    const jsonBody = JSON.stringify(usuarioDadosLogin.signUpToJson());

    fetch("https://ucdb-plataform1.herokuapp.com/api/v1/users/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: jsonBody
    })
        .then(response => {
            if (!response.ok) {
                console.log("ERROR: " + response.text());
                throw new Error("Falha no cadastro!");
            }
            return response.text();

        }).then(data => {
            alert("Cadastro realizado com sucesso!")
            modSignUp.style.display = "none";
        });

    return true;
}


if (localStorage.getItem("userToken")) aparecerDisconnect()
else {
    aparecerLoginRegistrar()
}

function aparecerLoginRegistrar() {
    const loginBt = document.createElement("li")
    loginBt.innerHTML = '<button class="header_bt" id="loginBt">Login</button>'
    loginBt.onclick = () => modSignIn.style.display = "flex";

    const cadastroBt = document.createElement("li")
    registrarBt.innerHTML = '<button class="header_bt" id="registerBt">Cadastro</button>'
    registrarBt.onclick = () => modSignUp.style.display = "flex";

    btNav.append(loginBt)
    btNav.append(cadastroBt)
}

function aparecerDisconnect() {
    const disconnectBt = document.createElement("button");

    disconnectBt.className = "header_bt"
    disconnectBt.id = "disconnectarBt"
    disconnectBt.innerText = "Sair"

    disconnectBt.onclick = function () {
        killAllChildren("#userEntries")
        aparecerLoginRegistrar()
        localStorage.removeItem("userToken")
        localStorage.removeItem("userEmail")
    }

    killAllChildren("#userEntries")

    btNav.appendChild(disconnectBt)
}


function killAllChildren(elemento) {
    let $campanhaContainer = document.querySelector(elemento);
    if (!$campanhaContainer) return;
    while ($campanhaContainer.firstChild) {
        $campanhaContainer.removeChild($campanhaContainer.firstChild);
    }
}

export default usuarioDadosLogin;

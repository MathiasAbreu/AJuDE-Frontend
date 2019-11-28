 /*
 Realiza o login
 */
function submitLogin() {
    var email = document.getElementById("login-email").value
    var senha = document.getElementById("login-psw").value


    var data = {
        email: email,
        senha: senha
    }


    fetch('https://ajude-back.herokuapp.com/ajude/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Email ou senha incorretos")
            }
            return response.json()
        })
        .then(function (data) {
            alert("Usuário logado com sucesso")

            // Store
            localStorage.setItem("token", data.token)
            localStorage.setItem("login", email)

            window.location.href = ""
        })
        .catch(function (error) {
            alert(error.message);
        });
}

/*
Desconecta o usuario atual
*/

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = "";
}

/*
Cria uma campanha e envia a mesma pro backend para cadastra-la
*/
function submitCampanha() {
    var nome = document.getElementById("register-Cnome").value
    var descricao = document.getElementById("register-Cdescricao").value
    var meta = document.getElementById("register-Cmeta").value
    var deadLine= document.getElementById("register-Cdeadline").value


    var data = {
        nome: nome,
        descricao: descricao,
        meta: meta,
        dataDeadline: deadLine,
    }

    fetch('https://ajude-back.herokuapp.com/ajude/campanhas/adiciona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erro, tente novamente")
            }
            return response.json()
        })
        .then(function (data) {
            alert("Campanha criada com sucesso com sucesso")

            window.location.href = ""
        })
        .catch(function (error) {
            alert(error.message);
        });
}

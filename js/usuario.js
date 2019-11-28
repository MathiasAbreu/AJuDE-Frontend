/*
 Cadastra um usuario no sistema
*/
function submitRegister() {
    var nome = document.getElementById("register-fName").value
    var ultimoNome = document.getElementById("register-lName").value
    var email = document.getElementById("register-email").value
    var senha = document.getElementById("register-psw").value
    var numeroCartao = document.getElementById("register-card").value


    var data = {
        email: email,
        nome: nome,
        ultimoNome: ultimoNome,
        numeroCartao: numeroCartao,
        senha: senha,

    }


    fetch('https://ajude-back.herokuapp.com/ajude/usuarios/adiciona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            var msg = ""
            if (!response.ok) {
                if (response.status == 409) {
                    msg = "Usuário já existe"
                } else if (response.status == 500) {
                    msg = "Erro do servidor"
                } else {
                    msg = "Senha não contém 8 dígitos"
                }

                throw new Error("Não foi possível completar o cadastro: " + msg)
            }
            return response.text()
        })
        .then(function (data) {
            alert("Usuário cadastrado com sucesso")
            window.location.href = ""
        })
        .catch(function (error) {
            alert(error.message);
        });
}

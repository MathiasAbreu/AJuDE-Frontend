/*
Adiciona um comentario numa campanha
*/
function addComment() {
    var inputComment = document.querySelector("#comment");
    submitComment(inputComment);
}

/*
Registra um novo comentario e manda pro backend
*/
function submitComment(inputComment) {
    var id = location.search.split("?");
    var broke = id[1].split("=");

    var data = {
        text: inputComment.value
    }

    fetch('https://ajude-back.herokuapp.com/ajude/campanhas/' + broke[1] + 'addComentario', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            var msg = ""
            if (!response.ok) {
                msg = "Algo deu errado"
                throw new Error("Comentario falhou!")
            }
            return response.text()
        })
        .then(function (data) {
            subjectProfile(broke[1]);
        })
        .catch(function (error) {
            alert(error.message);
        })
}

/*
Adiciona resposta a um comentario
*/
function addAnswer(id) {
    var inputAnswer = document.querySelector("#answer" + id);
    submitAnswer(inputAnswer, id);
}

/*
Envia a resposta de um comentario pro backend
*/
function submitAnswer(inputAnswer, id) {
    var idSubject = location.search.split("?");
    var broke = idSubject[1].split("=");
    var idComment = id;

    var data = {
        text: inputAnswer.value
    }

    fetch('https://ajude-back.herokuapp.com/ajude/campanhas' + broke[1] + '/addComentario', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            var msg = ""
            if (!response.ok) {
                msg = "Algo deu errado"
                throw new Error("Resposta falhou!")
            }
            return response.text()
        })
        .then(function (data) {
            subjectProfile(broke[1]);
        })
        .catch(function (error) {
            alert(error.message);
        })
}

/*
Apaga um comentario
*/
function removeComment(id) {
    var idSubject = location.search.split("?");
    var broke = idSubject[1].split("=");

    fetch('https://ajude-back.herokuapp.com/ajude/campanhas/delComentario', {
        method: 'DELETE',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${localStorage.token}`
        },

        body: id,
    })
        .then(function (response) {
            var msg = ""
            if (!response.ok) {
                msg = "Algo deu errado"
                throw new Error("Deletar falhouu!")
            }
            return response.text()
        })
        .then(function (data) {
            alert('Apagado com sucesso!')
            subjectProfile(broke[1]);
        })
        .catch(function (error) {
            alert(error.message);
        })

}

/*
Submete resposta com enter
*/
function answerEnter(e, idAnswer) {
    if (e.keyCode == 13) {
        addAnswer(idAnswer);
        return false;
    }
};

/*
Submete comentario com enter
*/
function commentEnter(e) {
    if (e.keyCode == 13) {
        addComment();
        return false;
    }
};

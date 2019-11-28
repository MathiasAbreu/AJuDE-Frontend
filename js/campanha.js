 /*
 Prepara os parametros do request da campanha
 */
window.onload = function subjectDecode() {
    var id = location.search.split("?");
    var broke = id[1].split("=");

    subjectProfile(broke[1]);

}
/*
Realiza o request de uma campanha
*/
function subjectProfile(id) {
    fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaTotal'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${localStorage.token}`
        },

        body: id,
    })
        .then(function (response) {
            if (response.status == 500) {
                throw new Error("Faça o login para prosseguir");
            }
            if (!response.ok) {
                throw new Error("Nenhuma campanha foi encontrada")
            }
            return response.json()
        })
        .then(function (data) {
            var profile = data.nome;
            var responseComments = data.comentarios;
            var listComments = '';
            var listAnswers = '';
            document.getElementById("subjectbyid").innerHTML = '';
            data.comentarios.status != 404 ? responseComments.forEach(function (arrayItem) {
                var responseAwnsers = arrayItem.respostas;
                listAnswers = '';
                arrayItem.respostas.status != 404 ? responseAwnsers.forEach(function (arrayAnwser) {
                    if (arrayAnwser.user.email == localStorage.getItem("login")) {
                        if (arrayAnwser.text != "" && arrayAnwser.text != null) {
                            listAnswers += ('<div class="answer-flex"><div class="card-answer-user">' +
                                '<div class="answer-name">' + arrayAnwser.usuarioQComentou.nome + ' ' + arrayAnwser.usuarioQComentou.ultimoNome + ':' + '</div>' +
                                '<div class="answer-text">' + arrayAnwser.conteudo + ' - ' + '<span class="answer-time">'  + '</span>' + '</div></div>' +
                                '<a class="answer-delete" href="#" onclick="return removeComment(' + arrayAnwser.idResposta + ')"><i class="fas fa-trash-alt"></i></a></div>');
                        }
                    } else {
                        listAnswers += ('<div class="answer-flex"><div class="card-answer">' +
                                '<div class="answer-name">' + arrayAnwser.usuarioQComentou.nome + ' ' + arrayAnwser.usuarioQComentou.ultimoNome + ':' + '</div>' +
                                '<div class="answer-text">' + arrayAnwser.text + ' - ' + '<span class="answer-time">' + '</span>' + '</div></div>' +
                                '</div>');
                    }
                }) : null;
                if (arrayItem.usuarioQComentou.email == localStorage.getItem("login")) {
                    if (arrayItem.conteudo != "" && arrayItem.conteudo != null) {
                        listComments += ('<div class="card-comment-user">' +
                            '<div class="comment-name">' + arrayItem.usuarioQComentou.nome + ' ' + arrayItem.usuarioQComentou.ultimoNome + ':' + '<a class="comment-delete" href="#" onclick="return removeComment(' + arrayItem.idComentario + ')"><i class="fas fa-trash-alt"></i></a>' + '</div>' +
                            '<div class="comment-text">' + arrayItem.conteudo + ' - ' + '<span class="comment-time">' + '</span>' + '</div>' +
                            '<div class="comment-answer">' + listAnswers + '</div>' +
                            "<div class='answer-area'><input type='text' class='answer-submit' onkeypress='return answerEnter(event," + arrayItem.idComentario + ") ' placeholder='digite uma resposta...' id='answer" + arrayItem.idComentario + "' ><a class='answer-button' href='#' onclick='return addAnswer(" + arrayItem.idResposta + ")'><i class='fas fa-reply'></i></a></div>" +
                            '</div>')
                    }
                } else {
                    if (arrayItem.conteudo != "" && arrayItem.conteudo != null) {
                        listComments += ('<div class="card-comment">' +
                            '<div class="comment-name">' + arrayItem.usuarioQComentou.nome + ' ' + arrayItem.usuarioQComentou.ultimoNome + ':' + '</div>' +
                            '<div class="comment-text">' + arrayItem.text + ' - ' + '<span class="comment-time">' + '</span>' + '</div>' +
                            '<div class="comment-answer">' + listAnswers + '</div>' +
                            "<div class='answer-area'><input type='text' class='answer-submit' onkeypress='return answerEnter(event," + arrayItem.idComentario + ") ' placeholder='digite uma resposta...' id='answer" + arrayItem.idComentario + "' ><a class='answer-button' href='#' onclick='return addAnswer(" + arrayItem.idResposta + ")'><i class='fas fa-reply'></i></a></div>" +
                            '</div>');
                    }
                }
            }) : null;

            var likeStatus = "";

            if (data.usuarioQCurtiu.email == localStorage.getItem("login")) {
                likeStatus = "button-liked";
            } else {
                likeStatus = "button-like";
            }

            document.getElementById("subjectbyid").innerHTML = "<div class='subject-name'>" + profile + "</div>" + "</br><div class='card-like'><a class=" + likeStatus + " href='#' onclick='return addLike()'><i class='fas fa-heart'></i></a><span class='number-likes'>" + data.curtidas + "</div></br>" +
                "<div class='comment-area'><input type='text' class='comment-submit' onkeypress='return commentEnter(event)' placeholder='faça um comentário...' id='comment'><a class='comment-button' href='#' onclick='return addComment()'><i class='fas fa-comment-dots'></i></a></div>" +
                "<div class='center'>" + listComments + "</div><div></div><div></div><div></div></div>";
        })
        .catch(function (error) {
            alert(error.message);
            logout();
        });
}

/*
 Envia os dados da pesquisa realizada pela usuario
*/
function submitSearch() {

    var typingTimer;
    var doneTypingInterval = 1000;
    var $input = $('#search');

    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

}

/*
Formata as campanhas recebidas no JSON
*/
function formatarCampanhas(listaCampanhas) {
    var repos = listaCampanhas;
    document.getElementById("campanhas").innerHTML = "";
    var list = '';


    listaCampanhas.status != 404 ? repos.forEach(function (arrayItem) {

        list += ('<div class="card-container">' +
            '<hr>' +
            '<div class="card">' +
            '<div class="content">' +
            arrayItem.id + ' - ' + arrayItem.nome +
            '</div>' +
            '<button class="w3-button-sub">' +
            "<a href='subjectProfile.html?id=" +arrayItem.id + "'>Acessar campanha</a>" +
            '</button>' +
            '</div>' +
            '<hr>' +
            '</div>');
    }) : null;

    document.getElementById("campanhas").innerHTML = list;


}

/*
Faz a requisicao das campanhas pro backend
*/
function doneTyping() {
    var search = document.getElementById("search")
    if (search != '') {
        var value = search.value;
        var encodeValue = encodeURIComponent(value);

        fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaSubstring'), {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json; charset=utf-8'

                },

                body: encodeValue,
            })
            .then(function (response) {
                if (!response.ok) {
                    var list = ('<div class="card-container">' +
                        '<hr>' +
                        '<div class="card">' +
                        '<div class="content">' +
                        "Nenhuma campanha foi encontrada" +
                        '</div>' +
                        '</div>' +
                        '<hr>' +
                        '</div>');
                    document.getElementById("campanhas").innerHTML = list;
                } else {
                    console.log(response.json()
                        .then(function (data) {
                            formatarCampanhas(data);
                        })
                    );
                }
                return response.json()
            })
    }
}

/*
Chama a funcao que formata o perfil das campanhas
*/
function perfilCampanha(idCampanha) {
    formatarPerfil(idCampanha);
}

/*
Faz request pro backend realizando a pesquisa
*/
function formatarPerfil(idCampanha) {
    fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaSubstring'), {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=utf-8'
            },

            body: idCampanha,
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Nenhuma campanha encontrada")
            }
            return response.json()
        })
        .then(function (data) {
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function doNothing() {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if( keyCode == 13 ) {


    if(!e) var e = window.event;

    e.cancelBubble = true;
    e.returnValue = false;

    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

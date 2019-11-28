
window.onload = function loadOrdenacao() {
    metaOrdem();
}

function likesOrdem(){
    fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaTotal'), {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: "likes",
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Não foi possível ordenar")
            }
            return response.json()
        })
        .then(function (data) {
            renderOrdemLike(data);
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function renderOrdemLike(data){
    var title = "Ordenando campanhas por likes...";
    var responseLike = data;
    var listLike = '';
    var buttonLikes = '';

    var button = '<div class="like-buttons">' +
    '<span class="button-left"><a href="#" class="button-active" id="sleep" onclick="return metaOrdem()"><i class="fas fa-heart"></i></a></span>' +
    '<span class="button-right"><a href="#" class="button-sleep" id="sleep" onclick="return dataOrdem()"><i class="fas fa-comment"></i></a></span>' +
'</div>';
    document.getElementById('ordemId').innerHTML = '';

    data.status != 404 ? responseMeta.forEach(function (arrayLike){

        if(arrayLike.curtidaUser){
            buttonMeta = 'button-liked';
        } else{
            buttonMeta = 'button-unlike';
        }

        listLike+= ('<div class="card-ranking">' +
                    '<div class="ranking-text">' + ".&nbsp;&nbsp;&nbsp;" + arrayLike.campanha +'</div>' +
                    "<div class='card-like'><a class='button-ext' href='subjectProfile.html?id=" +arrayLike.id + "'><i class='fas fa-pager'></i></a><a class=" + buttonMeta + " href='#' onclick='return addLike("+ arrayLike.id+")'><i class='fas fa-heart'></i></a><span class='number-likes'>" + arrayLike.quantidadeLikes + "</div>" +
                    '</div>');
        }

    }): null;

    document.getElementById('ordemId').innerHTML = button + "<div class='ordem-name'>" + title + "</div>" + listLike;
}


function dataOrdem(){
    fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaTotal'), {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: "data",
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Não foi possível ordenar")
            }
            return response.json()
        })
        .then(function (data) {
            renderOrdemData(data);
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function renderOrdemData(data){
    var title = "Ordenaçao de campanhas pela data";
    var responseData = data;
    var listLike = '';

    var button = '<div class="like-buttons">' +
    '<span class="button-left"><a href="#" class="button-active" id="sleep" onclick="return metaOrdem()"><i class="fas fa-heart"></i></a></span>' +
    '<span class="button-left"><a href="#" class="button-active" id="sleep" onclick="return likesOrdem()"><i class="fas fa-heart"></i></a></span>' +
'</div>';
    document.getElementById('ordemId').innerHTML = '';

    data.status != 404 ? responseData.forEach(function (arrayLike){

    listLike+= ('<div class="card-ranking">' +
                '<div class="ranking-text">' + ".&nbsp;&nbsp;&nbsp;" + arrayLike.campanha +'</div>' +
                "<div class='card-like'><a class='button-ext' href='subjectProfile.html?id=" +arrayLike.id + "'><i class='fas fa-pager'></i></a><a class='button-liked'><i class='fas fa-comment'></i></a><span class='number-likes'>" + arrayLike.dataDeadline + "</span></div>" +
                '</div>');
        }

    }): null;

    document.getElementById('ordemId').innerHTML = button + "<div class='ordem-name'>" + title + "</div>" + listLike;
}

function metaOrdem(){
    fetch(('https://ajude-back.herokuapp.com/ajude/campanhas/buscaTotal'), {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: "meta",
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Não foi possível ordenar")
            }
            return response.json()
        })
        .then(function (data) {
            renderOrdemMeta(data);
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function renderOrdemMeta(data){
    var title = "Ordenaçao de campanhas pela meta";
    var responseMeta = data;
    var listMeta = '';

    var button = '<div class="like-buttons">' +
    '<span class="button-left"><a href="#" class="button-active" id="sleep" onclick="return likesOrdem()"><i class="fas fa-heart"></i></a></span>' +
    '<span class="button-left"><a href="#" class="button-active" id="sleep" onclick="return dataOrdem()"><i class="fas fa-heart"></i></a></span>' +
'</div>';
    document.getElementById('ordemId').innerHTML = '';

    data.status != 404 ? responseMeta.forEach(function (arrayLike){

    listLike+= ('<div class="card-ranking">' +
                '<div class="ranking-text">' + ".&nbsp;&nbsp;&nbsp;" + arrayLike.campanha +'</div>' +
                "<div class='card-like'><a class='button-ext' href='subjectProfile.html?id=" +arrayLike.id + "'><i class='fas fa-pager'></i></a><a class='button-liked'><i class='fas fa-comment'></i></a><span class='number-likes'>" + arrayLike.meta + "</span></div>" +
                '</div>');
        }

    }): null;

    document.getElementById('ordemId').innerHTML = button + "<div class='ordem-name'>" + title + "</div>" + listLike;
}


function addLike(id) {
    fetch('https://ajude-back.herokuapp.com/ajude/campanhas/' + id + '/addLike', {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${localStorage.token}`
        },
    })
        .then(function (response) {
            var msg = ""
            if (!response.ok) {
                msg = "Algo deu errado"
                throw new Error("Erro!")
            }
            return response.text()
        })
        .then(function (data) {
            metaOrdem();
        })
        .catch(function (error) {
            alert(error.message);
        })
}

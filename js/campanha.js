//Tempo que o usuario tem de digitacao na barra de pesquisa de campanhas ate que o sistema faca o fetch para buscar campanhas
var bufferTime = null;

//Barra de pesquisa de perfis de campanhas
const $campanhaSearchBar = document.getElementById("campanhaSearchBar");

//Muda a cor do botao de acordo com a escolha do usuario de curtir ou nao o perfil da campanha
function mudarCorBotaoLike(flag) {
    if (flag) document.getElementById("likeBt").style = "filter: invert(32%) sepia(95%) saturate(1073%) hue-rotate(103deg) brightness(95%) contrast(105%);"
    else document.getElementById("likeBt").style = ""
}

//Recebe (parte) do nome da campanha a ser buscada
$campanhaSearchBar.onkeyup = async function () {
    if (!$campanhaSearchBar.value) {
        killAllChildren("#campanhaSearchBar")
        return;
    }

    if (bufferTime != null) clearTimeout(bufferTime);                           //Restart the buffer if it is the first time being called
    bufferTime = setTimeout(await CampanhaBtControler, 400);                  //Starts the buffer countdown, if the uses don't write anything new in 300ms,
    //it will run the button creator function
}

//Controla a criacao de botoes das campanhas dinamicamente
var CampanhaBtControler = async function () {
    if (!$campanhaSearchBar.value) return;

    killAllChildren(".campanhas_container"); //:D

    const CampanhasList = await campanhaFetcher()

    CampanhasList.forEach(Subject => {
        CampanhaButtonCreator(Subject["id"], Subject["nome"], Subject["meta"]);
    });
}

//Cria botoes baseados no nome e ids das campanhas, e adiciona estes ao HTML da pagina
function CampanhaButtonCreator(campanhaId, campanhaNome) {
    let button = document.createElement("button");
    button.id = campanhaId;
    button.innerText = (campanhaId + " - " + campanhaNome);
    button.onclick = () => {
        if (loggedInCheck()) return;
        perfilModController(campanhaId);
    }
    button.className = "campanhaBt";

    document.querySelector(".campanhas_container").appendChild(button);
}

//Recupera todas as campanhas que tem o nome/parte dele igual ao pesquisado pelo usuario
async function campanhaFetcher() {
    if (!$campanhaSearchBar.value) return;

    const requestUrl = "https://http://ajude-back.herokuapp.com/ajude/campanhas/buscaSubstring" + $campanhaSearchBar.value.replace(/ /g, "%20");
    let fetcher = await fetch(requestUrl)
    if (!fetcher.ok) throw new Error("Subject fetch failed");
    let campanhaJson = await fetcher.json();

    return campanhaJson;
}

//Controla o modal dos perfis das campanhas, limpando e adicionando a este as informacoes da campanha escolhida pelo usuario
async function perfilModController(campanhaId) {
    killAllChildren("#comentariosContainer");
    killAllChildren("#perfilComentarioDiv");
    comentarioPerfilInputCreator(campanhaId)

    const perfilJson = await perfilFetcher(campanhaId);

    perfilModalLikeControler(perfilJson["id"], perfilJson["nome"], perfilJson["quantidadeLikes"], perfilJson["dataDeadline"], perfilJson["descricao"], perfilJson["meta"])

    mudarCorBotaoLike(perfilJson["flagLike"])

    let subComentarioDivNumber = 0;

    perfilJson["comentarios"].forEach(comentario => {
        if (!comentario["apagado"]) {

            comentarioPrincipalCreator(campanhaId, comentario["id"], comentario["usuario"]["firstName"] + " " + comentario["usuario"]["lastName"],
                comentario["date"] + " " + comentario["hora"], comentario["usuario"]["email"], comentario["comentario"]);

            subComentarioDivNumber++;
            comentario["comentarioDocomentario"].forEach(subComentario => {
                if (!subComentario["apagado"]) {
                    comentarioComentarioCreator(campanhaId, comentario["id"], subComentario["id"], subComentario["usuario"]["firstName"] + " " + subComentario["usuario"]["lastName"],
                        subComentario["date"] + " " + subComentario["hora"], subComentario["usuario"]["email"], subComentario["comentario"])
                }
            })
        }
    });

    campanhaModal.style.display = "block";
}

//Realiza a ligacao entre a aplicacao front e back, recuperando as informacoes de um perfil de uma campanha a partir de seu id
async function perfilFetcher(id) {
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const requestUrl = "ttps://ajude-back.herokuapp.com/ajude/campanhas/" + id + "/busca";

    let fetcher = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    });

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }

    let perfilData = await fetcher.json();

    return perfilData;
}

//Controla as informacoes sobre like de uma campanha e as adicionam na pagina dinamicamente
function perfilModalLikeControler(idCampanha, nomeCampanha, numLikes) {
    document.querySelector("#nomeCampanha").innerText = nomeCampanha;
    const $likeInfo = document.querySelector("#likeInfo")

    killAllChildren("#likeInfo")

    const likeBt = document.createElement("input")
    likeBt.type = "image"
    likeBt.src = "./img/like.png"
    likeBt.id = "likeBt"
    likeBt.onclick = async () => {
        const likeUpdate = await curtirPerfil(idCampanha)
        mudarCorBotaoLike(likeUpdate[0])

        document.querySelector("#likeNum").innerText = likeUpdate[1]
    }

    const likeCounter = document.createElement("p")
    likeCounter.id = "likeNum"
    likeCounter.innerText = numLikes;

    $likeInfo.append(likeBt, likeCounter)
}

//Realiza a ligacao entre a aplicacao front e back, possibilitando ao usuario curtir um determinado perfil de uma campanha a partir de seu id
async function curtirPerfil(id) {
    const requestUrl = "https://ajude-back.herokuapp.com/ajude/campanhas/" + id + "/addLike";
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]

    const fetcher = await fetch(requestUrl, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    });

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();
    const responseJson = await JSON.parse(responseTxt);
    return [responseJson["flagLike"], responseJson["qtdLikes"]]
};

// COMENTARIOS BEGIN \\

//Função que cria o esqueleto de um comentario, este podendo ser comentário principal, ou uma resposta de um comentário
function estruturaDataGeralComentario(autor, data, comentario) {
    const comentarioData = document.createElement("div")
    comentarioData.className = "comentarioData"

    const donoComentarioDiv = document.createElement("div")
    donoComentarioDiv.className = "donoComentario"

    const autorP = document.createElement("p")
    autorP.className = "autor"
    autorP.innerText = autor;

    const timeDataP = document.createElement("p")
    timeDataP.className = "timeData"
    timeDataP.innerText = data

    donoComentarioDiv.append(autorP, timeDataP)

    const comentarioTextH = document.createElement("h5")
    comentarioTextH.id = "comentarioText"
    comentarioTextH.innerText = comentario;

    comentarioData.append(donoComentarioDiv, comentarioTextH)

    return comentarioData;
}

//Constroi a estrutura dos comentarios de comentarios dos perfis das campanhas e adiciona esta ao HTML da página
function comentarioComentarioCreator(campanhaId, comPaiId, comentarioId, autor, data, email, comentario) {
    const comentarioDoComentario = document.createElement("div");
    comentarioDoComentario.className = "comentarioComentario"

    const comentarioComentarioDiv = document.createElement("div")
    comentarioDoComentario.className = "comentarioComentarioDiv"


    const comentarioData = estruturaDataGeralComentario(autor, data, comentario)

    comentarioComentarioDiv.append(comentarioData, usuarioDonoDoComentario(comentarioId, campanhaId, email))
    comentarioDoComentario.appendChild(comentarioComentarioDiv)

    document.getElementById("comentarioDe" + comPaiId).appendChild(comentarioDoComentario)
}

//Constroi a estrutura dos comentarios dos perfis das campanhas e adiciona esta ao HTML da página
function comentarioPrincipalCreator(campanhaId, comentarioId, autor, data, email, comentario) {
    const perfilComentario = document.createElement("div");
    perfilComentario.className = "perfilComentario"

    const comentarioDiv = document.createElement("div")
    comentarioDiv.className = "comentario"

    const comentarioData = estruturaDataGeralComentario(autor, data, comentario)

    const subComentarioInp = document.createElement("input")
    subComentarioInp.type = "text"
    subComentarioInp.className = "subComentario"
    subComentarioInp.placeholder = "Escreva um novo comentario"

    subComentarioInp.onkeyup = async function (event) {
        if (event.keyCode === 13) {
            await adicionarSubComentario(campanhaId, comentarioId, subComentarioInp.value);
            await perfilModController(campanhaId);
        }
    }

    const subComentarioContainer = document.createElement("div")
    subComentarioContainer.className = "subComentarioContainer"
    subComentarioContainer.id = "comentarioDe" + comentarioId;

    comentarioDiv.append(comentarioData, subComentarioInp, usuarioDonoDoComentario(comentarioId, campanhaId, email), subComentarioContainer)
    perfilComentario.appendChild(comentarioDiv)

    document.querySelector("#comentariosContainer").appendChild(perfilComentario);
}

//Verifica se o usuario logado atualmente e o dono do comentario, passado como parametro, caso verdadeiro, adiciona a opcao de deletar este comentario.
function usuarioDonoDoComentario(comentarioId, campanhaId, email) {
    if (localStorage.getItem("userEmail") == email) {
        const comentarioDelete = document.createElement("input")
        comentarioDelete.type = "image"
        comentarioDelete.className = "comentarioDelete"
        comentarioDelete.src = "./img/excluir.png"
        comentarioDelete.onclick = async function () {
            await deletarComentarioFetcher(campanhaId, comentarioId)
            await perfilModController(campanhaId)
        }
        return comentarioDelete;
    }
    return "";
}

//Cria uma area de insercao de comentarios no perfil da campanha escolhida pelo usuario
function comentarioPerfilInputCreator(id) {
    const input = document.createElement("input")

    input.type = "text"
    input.id = "comentarioPerfilInp"
    input.placeholder = "Adicionar um comentario"

    input.onkeyup = async function (event) {
        if (event.keyCode === 13) {
            await comentarPerfil(id, document.getElementById("comentarioPerfilInp").value)
            await perfilModController(id)
        }
    }

    document.getElementById("perfilComentarioDiv").appendChild(input)
}

//Realiza a ligacao entre a aplicacao front e back, para que seja possivel adicionar um comentario de um comentario
async function adicionarSubComentario(campanhaId, comentarioId, comentario) {
    const requestUrl = "https://ajude-back.herokuapp.com/ajude/" + campanhaId + "&idComentario=" + comentarioId;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const jsonBody = JSON.stringify(comentarioToJson(comentario))

    const fetcher = await fetch(requestUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        },
        body: jsonBody
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);
        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();

    return false;
};

//Padroniza o envio de comentario para o backend
function comentarioToJson(comentario) {
    const comentarioJson = {
        "comentario": comentario
    };

    return comentarioJson;
}

//Recebe um comentario de um determinado perfil de campanha e manda este para o backend.
async function comentarPerfil(id, comentario) {
    const requestUrl = "https://ajude-back.herokuapp.com/ajude/campanhas/{identificadorURL}/addComentario" + id;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const jsonBody = JSON.stringify(comentarioToJson(comentario))

    const fetcher = await fetch(requestUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        },
        body: jsonBody
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);

        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();
    return false;
};

//Recebe um comentario de um determinado perfil de campanha e manda este para o backend.
async function deletarComentarioFetcher(idPerfil, idComentario) {
    const requestUrl = "https://ajude-back.herokuapp.com/ajude/campanhas/{identificadorURL}/delComentario + idPerfil + "&idComentario=" + idComentario;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]

    const fetcher = await fetch(requestUrl, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);

        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();

};

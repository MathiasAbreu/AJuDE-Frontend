//Opcao de ordenacao por numero de likes
const $likeNumberOption = document.getElementById("rankByLikeNumb")

//Opcao de ordenacao por meta
const $metaNumberOption = document.getElementById("rankByMetaNumb")

//Opcao de ordenacao por data
const $dataNumberOption = document.getElementById("rankByDataNumb")

//Faz a chamada para ordenar por numero de likes.
$likeNumberOption.onclick = () => {
    $likeNumberOption.className = "opcaoAtivada"
    $metaNumberOption.className = ""
    $dataNumberOption.className = ""
    rankingByControler("Like")
}

//Faz a chamada para ordenar por meta.
$metaNumberOption.onclick = () => {
    $metaNumberOption.className = "opcaoAtivada"
    $likeNumberOption.className = ""
    $dataNumberOption.className = ""
    rankingByControler("Meta")
}

//Faz a chamada para ordenar por data.
$dataNumberOption.onclick = () => {
    $dataNumberOption.className = "opcaoAtivada"
    $likeNumberOption.className = ""
    $metaNumberOption.className = ""
    rankingByControler("Data")
}

//Controla a ordenacao do ranking de acordo com o parametro option passado como parametro, limpando o container de ranking
//e redirecionando os dados necessarios para a criacao de cada campanha no HTML
async function rankingByControler(option) {

    const campanhasList = await getOrderBy(option)

    killAllChildren(".ranking-container")

    for (let index = 0; index < campanhasList.length; index++) {
        const campanha = campanhasList[index];
        console.log(campanhasList[index])
        campanhaOrder(campanha["nome"], campanha["meta"], campanha["data"]);
    }
}

//Realiza a ligacao entre a aplicacao front e back, e faz a requisicao do ranking de perfis de campanhas ordenadas de acordo com opcao escolhida
async function getOrderBy(option) {
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const requestUrl = "https://http://ajude-back.herokuapp.com/ajude/campanhas/buscaTotal";

    let fetcher = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        },

        body: option
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }
    console.log(fetcher)
    let orderJson = await fetcher.json();
    return orderJson;
}

const loggedInCheck = function () {
    if (localStorage.getItem("userToken") == null) {
        alert("Faça login para continuar")

        document.getElementById("signInMod").style.display = "flex";
        return true;
    }
}

//Cria a estrutura de HTML de cada campanha presente na ordenacao
function campanhaOrder(campanhaNome, meta, data) {

    const campanhaDiv = document.createElement("div");
    campanhaDiv.className = "campanhaDiv";

    const campanhaInfoList = document.createElement("ul");
    campanhaInfoList.className = "campanhaInfoList";

    const campanhaNome = document.createElement("li")
    campanhaNome.className = "nomeCampanha"
    campanhaNome.innerText = "-> " + campanhaNome

    const campanhaQtdsInfo = document.createElement("li")
    campanhaQtdsInfo.className = "campanhaQtdsInfo"
    campanhaQtdsInfo.innerText = "Meta: " + meta + " - Termino: " + data

    campanhaDiv.append(campanhaNome, campanhaQtdsInfo)

    document.querySelector(".ranking-container").appendChild(campanhaDiv);
}

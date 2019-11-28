
function addLike() {
    var idSubject = location.search.split("?");
    var broke = idSubject[1].split("=");

    fetch('https://ajude-back.herokuapp.com/ajude/campanhas/' + broke[1] + '/addLike', {
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
                throw new Error("Operaçao nao completada!")
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

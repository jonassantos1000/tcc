const loader = document.querySelector("#loading");

function exibirCVE(dataset){
    document.querySelector('#div_erro').classList.add("d-none");

    let cve = document.querySelector('#cve');
    let titulo_cve = document.querySelector("#titulo_cve")
    let resumo_cve = document.querySelector("#resumo_cve")

    cve.classList.remove("d-none");
    cve.classList.add("d-flex");

    titulo_cve.innerHTML = dataset.id
    resumo_cve.innerHTML = dataset.resume
}
function exibirErro(dataset){
     document.querySelector('#cve').classList.add("d-none");

    let div_erro = document.querySelector('#div_erro');
    let titulo_cve = document.querySelector("#titulo_erro")
    let resumo_cve = document.querySelector("#resumo_erro")

    div_erro.classList.remove("d-none");
    div_erro.classList.add("d-flex");

    resumo_cve.innerHTML = "Insira um CVE válido!"
    titulo_cve.innerHTML = dataset.response
    if (dataset.description){
        resumo_cve.innerHTML = dataset.description
    }
}
function getValueSearchBar(){
    return document.querySelector('#barra_pesquisa_cve').value;
}

function displayLoading() {
    loader.classList.add("display");
}

function hideLoading() {
    loader.classList.remove("d-none");
    loader.classList.remove("display");
}

function getCVE(){
    displayLoading()

    fetch(`http://192.168.1.220:5000/vistoria/${getValueSearchBar()}`)
    .then(response => {
        hideLoading()
        if(response.ok){
            response.json().then((response) => {
                exibirCVE(response)
            })
        } else {
           response.json().then((response) => exibirErro(response));
        }

    })
    .catch(function(error) {
        hideLoading()
        dataset = {response: 'Problema de conexão', description: 'Não foi possivel se conectar ao servidor'}
        exibirErro(dataset)
    });
}
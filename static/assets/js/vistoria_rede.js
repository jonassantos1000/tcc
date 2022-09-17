function getVistoriaRede() {
    displayLoading();
    removerErro()
    if (valida_rede_informada()) {
        fetch(`http://192.168.1.220:5000/vistoria/scanner/${getValueSearchBar("#barra_inspecao")}`)
            .then((dataset) => {
                dataset.json()
                    .then((dataset) => { hideLoading() });
            })

            .catch(function (error) {
                hideLoading();
                return exibirErroVistoria("Erro de conexão", "Não foi possivel se conectar ao servidor");
            });
    }else{
        hideLoading();
        exibirErroVistoria("IP Invalido", "Informe um ip valido para prosseguir com a inspeção.")
    }
}


function valida_rede_informada() {
    var valor = getValueSearchBar("#barra_inspecao")
    console.log(valor)
    if (!valor) { return false }
    if (valor.length < 7){ return false }
    return true
}

function exibirErroVistoria(titulo, descricao) {
    let div_erro = document.querySelector("#div_erro");
    let titulo_cve = document.querySelector("#titulo_erro");
    let resumo_cve = document.querySelector("#resumo_erro");
    div_erro.classList.remove("d-none");
    div_erro.classList.add("d-flex");
    resumo_cve.innerHTML = descricao;
    titulo_cve.innerHTML = titulo;
}

function removerErro(){
    let div_erro = document.querySelector("#div_erro");
    div_erro.classList.remove("d-flex");
    div_erro.classList.add("d-none");
}
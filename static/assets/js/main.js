const loader = document.querySelector("#loading");

function exibirCVE(dataset) {
  document.querySelector("#div_erro").classList.add("d-none");

  let cve = document.querySelector("#cve");
  let titulo_cve = document.querySelector("#titulo_cve");
  let resumo_cve = document.querySelector("#resumo_cve");

  cve.classList.remove("d-none");
  cve.classList.add("d-flex");

  titulo_cve.innerHTML = dataset.id;
  resumo_cve.innerHTML = dataset.resume;
}
function exibirErro(titulo, descricao) {
  document.querySelector("#cve").classList.add("d-none");

  let div_erro = document.querySelector("#div_erro");
  let titulo_cve = document.querySelector("#titulo_erro");
  let resumo_cve = document.querySelector("#resumo_erro");

  div_erro.classList.remove("d-none");
  div_erro.classList.add("d-flex");

  resumo_cve.innerHTML = descricao;
  titulo_cve.innerHTML = titulo;
}
function getValueSearchBar() {
  return document.querySelector("#barra_pesquisa_cve").value;
}

function displayLoading() {
  loader.classList.add("display");
}

function hideLoading() {
  loader.classList.remove("d-none");
  loader.classList.remove("display");
}

function cveEhValido() {
  if (!getValueSearchBar()) {
    hideLoading();
    exibirErro(
      "Informação pendente",
      "É necessario informar um CVE para prosseguir com a consulta."
    );
    return false;
  }
  return true;
}

function getCVE() {
  if (cveEhValido()) {
    displayLoading();
    fetch(`http://192.168.1.220:5000/vistoria/${getValueSearchBar()}`)
      .then((dataset) => {
        hideLoading();
        if (dataset.ok) {
          dataset.json().then((dataset) => {
            exibirCVE(dataset);
          });
        } else {
          response
            .json()
            .then((dataset) =>
              exibirErro("Insira um CVE válido!", dataset.response)
            );
        }
      })
      .catch(function (error) {
        hideLoading();
        return exibirErro(
          "Erro de conexão",
          "Não foi possivel se conectar ao servidor"
        );
      });
  }
}

function getVistoriaRede() {
    displayLoading();
    resetarLayout()
    if (valida_rede_informada()) {
        fetch(`http://${server}:5000/vistoria/scanner/${getValueSearchBar("#barra_inspecao").replace("/", "barra")}`)
            .then((dataset) => {
                hideLoading();
                if (dataset.ok) {
                    dataset.json().then((dataset) => {popularRelatorio(dataset)})
                }else {
                    dataset.json().then(exibirErroVistoria("Ops, aconteceu um erro inesperado...", "Parece que tivemos uma oscilação na rede, tente novamente !"))
                }
            })
            .catch(function (error) {
                hideLoading();
                return exibirErroVistoria("Erro de conexão", "Não foi possivel se conectar ao servidor");
            });
    } else {
        hideLoading();
        exibirErroVistoria("IP Invalido", "Informe um ip valido para prosseguir com a inspeção.")
    }
}

function popularRelatorio(dataset){
    divAccordion = document.querySelector('#accordion-pai');
    tituloRelatorio = document.querySelector('#titulo-relatorio');
    document.querySelector('#download').classList.remove("invisible");
    tituloRelatorio.classList.remove("invisible")
    cont = 1
    
    dataset.forEach(element => {
        divAccordionItem = document.createElement('div')
        divAccordionContainer = document.createElement('div')
        divAccordionBody = document.createElement('div')
        tituloAccordion = document.createElement('h2')
        botaoAccordion = document.createElement('button')

        idAccordions = 'accordion' + cont
        tituloAccordion.id = 'heading' + cont
        divAccordionContainer.id = idAccordions
        
        tituloAccordion.classList.add('accordion-header')
        botaoAccordion.classList.add('accordion-button', 'fw-bold')
        divAccordionItem.classList.add('accordion-item')
        divAccordionContainer.classList.add('accordion-collapse','collapse','show')
        divAccordionBody.classList.add('accordion-body')

        botaoAccordion.setAttribute('data-bs-toggle', "collapse")
        botaoAccordion.setAttribute('data-bs-target', `#${idAccordions}`)
        botaoAccordion.setAttribute('aria-expanded', "true")
        botaoAccordion.setAttribute('aria-controls', `#${idAccordions}`)
        botaoAccordion.setAttribute('aria-controls', `#${idAccordions}`)
        divAccordionContainer.setAttribute('aria-labelledby', "heading"+cont)
        divAccordionContainer.setAttribute('data-bs-parent', "#accordionExample")

        botaoAccordion.innerHTML = `HOST: ${element.hostname} - IP: ${element.ip}`
        
        tituloAccordion.append(botaoAccordion)

        if (hostTemVulnerabilidade(element.port)){
            element.port.forEach(element => {
                if (element.list_cve.length != 0){
                    element.list_cve.forEach(port => {
                        alerta = document.createElement('div')
                        porta = document.createElement('h3')
                        cve = document.createElement('h4')
                        severidade = document.createElement('h5')
                        impacto = document.createElement('h5')
                        detalhe = document.createElement('p')
                        referencias = document.createElement('ul')

                        alerta.classList.add('card','alert', 'alert-danger')
                        porta.classList.add('fs-6')
                        cve.classList.add('fs-6')
                        severidade.classList.add('fs-6')
                        impacto.classList.add('fs-6')
                        detalhe.classList.add('fs-7')
                        referencias.classList.add('list-unstyled','fs-7')
                                            
                        porta.innerHTML = `<span class="fw-bold">Porta: </span> ${element.porta}`
                        cve.innerHTML = `<span class="fw-bold">CVE: </span> ${port.id}`
                        severidade.innerHTML = `<span class="fw-bold">Nível de severidade: </span> ${coalesce(port.score.severity)}`
                        impacto.innerHTML = `<span class="fw-bold">Pontuação de impacto: </span> ${coalesce(port.score.impact_score)}`
                        detalhe.innerHTML = `<span class="fw-bold">Detalhe: </span> ${port.resume}`
                        referencias.innerHTML = `<span class="fw-bold">Referências: </span> `
                        port.reference.forEach(referencia => {
                            itemLista = document.createElement('li')
                            linkItem = document.createElement('a')

                            linkItem.href= referencia
                            linkItem.innerHTML = referencia
                            linkItem.setAttribute('target', "_blank")

                            itemLista.append(linkItem)
                            referencias.append(itemLista)
                        })
                        
                        alerta.append(porta)
                        alerta.append(cve)
                        alerta.append(severidade)
                        alerta.append(impacto)
                        alerta.append(detalhe)
                        alerta.append(referencias)
                        divAccordionBody.append(alerta)
                    })
                }
            });

        }else{
            alerta = document.createElement('div')
            descricao = document.createElement('p')

            descricao.innerHTML = 'Não foi encontrado inconformidades de aplicações neste host com base no banco de dados do NVD'
            
            alerta.classList.add('alert', 'alert-primary')

            alerta.append(descricao)
            divAccordionBody.append(alerta)
        }

        divAccordionContainer.append(divAccordionBody)
        divAccordionItem.append(tituloAccordion)
        divAccordionItem.append(divAccordionContainer)
        divAccordion.append(divAccordionItem)
        cont = cont + 1
    });

}

function hostTemVulnerabilidade(portas){
    vulnerabilidade = false
    portas.forEach(element => {
        if (element.list_cve.length != 0){ vulnerabilidade = true }
    });
    return vulnerabilidade
}

function valida_rede_informada() {
    var valor = getValueSearchBar("#barra_inspecao")
    if (!valor) { return false }
    if (valor.length < 7) { return false }
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

function removerErro() {
    let div_erro = document.querySelector("#div_erro");
    div_erro.classList.remove("d-flex");
    div_erro.classList.add("d-none");
}

function coalesce(dados){
    dados = dados == undefined ? "N/A" : dados;
    return dados
}

function resetarLayout(){
    removerErro()
    document.querySelector('#download').classList.add("invisible");
    document.querySelector('#titulo-relatorio').classList.add("invisible");
    document.querySelector('#accordion-pai').innerText = "";
}

function getDate(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear(),
        h = data.getHours(),
        m = data.getMinutes(),
        s = data.getSeconds();
    return diaF+"/"+mesF+"/"+anoF+" "+h+":"+m+":"+s;
}

function gerarPDF(){
    data = getDate()
    window.scrollTo(0,0)
    let report = `
    <div class='d-flex mt-3 justify-content-between'>
        <div class='d-flex'>
            <a class="d-flex col-6 navbar-brand align-items-center me-5" href="/" id="div_logo"><img class="logo-report"
            src="./assets/img/logo.png" alt="Logo do site"></a>
            <h1 class="fs-3 fw-bold ms-5 d-flex align-items-center">Report Security</h1>
        </div>
        <p class='fs-6 d-flex align-items-center me-3'>${data}</p>
    </div>`
    const item = document.querySelector("#relatorio")
    report = report.concat(item.innerHTML).replace('accordion-button', 'accordion-button w-100')
    var opt = {
        margin: [30,30],
        filename: "report_security_"+data+".pdf",
        html2canvas:  { scale: 5, letterRendering: true},
        jsPDF:        { unit: 'pt', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(report).save(); 
}
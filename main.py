import nmap
import nvdlib

def search(rede):
    print("Iniciando PortScan")
    nm = nmap.PortScanner()
    result = nm.scan(hosts=rede, arguments='-T4 -sS -sV')['scan']
    for conteudo in scan:
        print(conteudo)
        print(scan[conteudo])

def searchCPEdata(infoCPE):
    infoCPE=infoCPE
    r = nvdlib.searchCPE(cpeMatchString=infoCPE, cves=True)
    for eachCPE in r:
        for eachVuln in eachCPE.vulnerabilities:
            print(eachVuln)


rede = "192.168.1.0/24"
scan = search(rede)
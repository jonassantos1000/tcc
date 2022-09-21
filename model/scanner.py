from time import sleep
import nmap
import nvdlib
from model.host import Host
from model.port import Port
from model.cve import *


class Scanner:

    def __init__(self, network=None):
        self._network = network
        self._list_content_host = []
        self._nmap = nmap.PortScanner()

    def info_hosts_network(self):
        dataset = self._nmap.scan(hosts=self._network, arguments='-T4 -sS -sV')['scan']
        for host in dataset:
            if 'tcp' in dataset[host]:
                self._list_content_host.append(self._popular_objeto(dataset[host]))
        return self._list_content_host

    def find_cve_by_cpe(self, info_cpe, product):
        try:
            dataset = nvdlib.searchCPE(cpeMatchString=info_cpe, keyword=product, cves=True, key='2dac879e-d189-4424-9378-ea4e4e06d283')
            list_cve = []
            for result in dataset:
                for vulnerabilite in result.vulnerabilities:
                    list_cve.append(CVE(id=vulnerabilite))
            sleep(1)
            return list_cve[len(list_cve)-2:]
        except Exception as error:
            return []


    def find_cve_by_product(self, product):
        sleep(6)
        dataset = nvdlib.searchCVE(keyword=product, limit=2)
        list_cve = []
        if dataset:
            for result in dataset:
                list_cve.append(CVE(id=result.cve.CVE_data_meta.ID))

        return list_cve


    def find_info_cve(self, cve):
        try:
            if str(cve).upper().find('CVE') != -1:
                return nvdlib.getCVE(cve, key='2dac879e-d189-4424-9378-ea4e4e06d283')
        except Exception as error:
            return False

    def get_cve_from_hosts(self):
        for host in self._list_content_host:
            for port in host.get('port'):
                if port.get('cpe'):
                    port['list_cve'] = self.find_cve_by_cpe(port['cpe'], port['product'])

                #if not port['list_cve']:
                    #port['list_cve'] = self.find_cve_by_product(port['name'])

                if port.get('list_cve'):
                    list_cve = []
                    for cve in port.get('list_cve'):
                        dataset = self.find_info_cve(cve.id)
                        if dataset:
                            exploit = None
                            if 'v3exploitability' in dir(dataset):
                                exploit = dataset.v3exploitability
                            elif 'v2exploitability' in dir(dataset):
                                exploit = dataset.v2exploitability
                            score = Score(dataset.score[2], exploit, dataset.score[1]).dict()
                            list_references = [conteudo.url for conteudo in dataset.cve.references.reference_data]
                            cve_completo = CVE(id=cve.id, resume=dataset.cve.description.description_data[0].value
                                               , reference=list_references, score=score).dict()

                            list_cve.append(cve_completo)
                        sleep(1)
                    port['list_cve'] = list_cve


    def vulnerabilitie_network(self):
        #Faz o scanner na rede
        self.info_hosts_network()

        #Chamando metodo para pesquisar os cves com base no cpe ou produto + versão
        self.get_cve_from_hosts()

        return self._list_content_host

    def _popular_objeto(self, dataset):
        list_port = []
        for porta in dataset['tcp']:
            port = Port(porta, dataset['tcp'][porta]['state'],
                        dataset['tcp'][porta]['name'],
                        dataset['tcp'][porta]['product'],
                        dataset['tcp'][porta]['version'],
                        dataset['tcp'][porta]['cpe']
                        )
            list_port.append(port.dict())

        host = Host(dataset['hostnames'][0]['name'],
                    dataset['addresses']['ipv4'],
                    list_port)

        return host.dict()


#scan = Scanner('192.168.1.0/24')
#hosts = scan.vulnerabilitie_network()
#print(hosts)

#for host in hosts:
#    for port in host.port:
 #       port = port.dict()
 #   print(host.dict())
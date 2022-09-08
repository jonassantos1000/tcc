from model.cve import CVE
from model.scanner import Scanner
from model.score import Score


class ScannerService:
    def find_info_by_cve(self, cve):
        scanner = Scanner('127.0.0.1')
        return self._popular_cve(scanner.find_info_cve(cve))

    def _popular_cve(self, dataset):
        if dataset:
            print(dataset)
            exploit = None
            if 'v3exploitability' in dir(dataset):
                exploit = dataset.v3exploitability
            elif 'v2exploitability' in dir(dataset):
                exploit = dataset.v2exploitability
            score = Score(dataset.score[2], exploit, dataset.score[1]).dict()
            list_references = [conteudo.url for conteudo in dataset.cve.references.reference_data]
            cve_completo = CVE(id=dataset.cve.CVE_data_meta.ID, resume=dataset.cve.description.description_data[0].value
                               , reference=list_references, score=score).dict()
            return cve_completo
from model.score import Score

class CVE:
    def __init__(self, id=None, resume=None, reference=[], score=None):
        self._id = id
        self._resume = resume
        self._reference = reference
        self._score = score

    @property
    def id(self):
        return self._id

    @property
    def resume(self):
        return self._resume

    @property
    def reference(self):
        return self._reference

    @property
    def score(self):
        return self._score

    def __str__(self):
        return self.dict()

    def dict(self):
        cve= {}
        for key in self.__dict__:
            cve[key[1:]] = self.__dict__.__getitem__(key)
        return cve
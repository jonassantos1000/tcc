class Score:
    def __init__(self, severity, exploit_score, impact_score):
        self._severity = severity
        self._exploit_score = exploit_score
        self._impact_score = impact_score

    @property
    def severity(self):
        return self._severity

    @property
    def exploit_score(self):
        return self._exploit_score

    @property
    def impact_score(self):
        return self._impact_score

    def __str__(self):
        return self.dict()

    def dict(self):
        score= {}
        for key in self.__dict__:
            score[key[1:]] = self.__dict__.__getitem__(key)
        return score
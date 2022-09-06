class Port:
    def __init__(self, porta, state, name, product, version, cpe, list_cve=[]):
        self._porta= porta
        self._state = state
        self._name = name
        self._product = product
        self._version = version
        self._cpe = cpe
        self._list_cve = list_cve

    @property
    def list_cve(self):
        return self._list_cve

    @list_cve.setter
    def list_cve(self, data_cve):
        self._list_cve = data_cve

    @property
    def porta(self):
        return self._porta

    @property
    def state(self):
        return self._state

    @property
    def name(self):
        return self._name

    @property
    def product(self):
        return self._product

    @property
    def version(self):
        return self._version

    @property
    def cpe(self):
        return self._cpe

    def __str__(self):
        return self.dict()

    def dict(self):
        port= {}
        for key in self.__dict__:
            port[key[1:]] = self.__dict__.__getitem__(key)
        return port
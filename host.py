from port import Port

class Host:
    def __init__(self, hostname, ip, port):
        self._hostname = hostname
        self._ip = ip
        self._port = port

    @property
    def hostname(self):
        return self._hostname

    @property
    def ip(self):
        return self._ip

    @property
    def port(self):
        return self._port

    def dict(self):
        host= {}
        for key in self.__dict__:
            host[key[1:]] = self.__dict__.__getitem__(key)
        return host
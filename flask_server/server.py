import os
import socket
from flask import Flask
from flask_cors import CORS


class Server():
    def __init__(self):
        self.app = Flask(__name__, template_folder='../static', static_folder='../static/assets')
        CORS(self.app)

    def definir_ip_servidor(self):
        ip_local = socket.gethostbyname(socket.gethostname())

        with open('./static/assets/js/main.js', 'a+') as arquivo:
            arquivo.seek(0)
            arquivo_alterado = arquivo.readlines()
            arquivo.truncate(0)
            for linha in arquivo_alterado:
                if linha.find('const server') != -1:
                    arquivo.write(f'const server = "{ip_local}"')
                    arquivo.write('\n')
                else:
                    arquivo.write(linha)

    def run(self):
        self.definir_ip_servidor()
        self.app.run(debug=True, host='0.0.0.0')

server = Server()
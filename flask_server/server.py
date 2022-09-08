import os
from flask import Flask
from flask_cors import CORS


class Server():
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

    def run(self):
        self.app.run(debug=True, host='0.0.0.0')

server = Server()
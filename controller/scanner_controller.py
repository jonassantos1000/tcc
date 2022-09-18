import json
import os

from flask import request, render_template
from flask_server.server import server
from service.scanner_service import ScannerService

app = server.app
service = ScannerService()

@app.route('/vistoria/<cve>', methods=['GET'])
def findById(cve):
    scanner = service.find_info_by_cve(cve)
    if scanner:
        return json.dumps(scanner), 200
    return json.dumps(dict(response='CVE não encontrado', status=400)), 400

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/vistoria', methods=['GET'])
def vistoria():
    return render_template('vistoria.html')

@app.route('/vistoria/scanner/<ip>', methods=['GET'])
def vistoria_scanner(ip):
    return json.dumps(service.scanner_rede(ip.replace("barra", "/"))), 200
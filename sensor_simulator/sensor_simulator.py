import time
import random
import requests

API_URL = "http://localhost:8080/api/leituras"

SENSOR_ID = "sensor-01"

while True:
    temperatura = round(random.uniform(25.0, 35.0), 2)
    umidade = round(random.uniform(30.0, 70.0), 2)

    dados = {
        "sensorId": SENSOR_ID,
        "temperatura": temperatura,
        "umidade": umidade
    }

    try:
        resposta = requests.post(API_URL, json=dados)

        if resposta.status_code == 201:
            print(
                f"Enviado -> "
                f"Temperatura: {temperatura}°C | "
                f"Umidade: {umidade}%"
            )
        else:
            print(
                f"Erro {resposta.status_code}: "
                f"{resposta.text}"
            )

    except requests.exceptions.RequestException as erro:
        print(f"Erro ao conectar com a API: {erro}")

    time.sleep(10)
import sys
import time
from pathlib import Path

import serial
import requests


# ==========================================
# IMPORTAÇÃO DO SERVIÇO DE IA
# ==========================================

PASTA_RAIZ = Path(__file__).resolve().parent.parent
PASTA_IA = PASTA_RAIZ / "ia_service"

sys.path.insert(0, str(PASTA_IA))

from predictor import prever_risco
from weather_service import obter_dados_meteorologicos


# ==========================================
# CONFIGURAÇÕES
# ==========================================

PORTA_SERIAL = "COM4"
BAUD_RATE = 9600

API_URL = "http://localhost:8080/api/leituras"
API_PREDICOES_URL = "http://localhost:8080/api/predicoes"


# ==========================================
# PREDIÇÃO DE RISCO
# ==========================================

def gerar_predicao(
    leitura_id,
    sensor_id,
    temperatura,
    umidade,
    latitude,
    longitude,
    bioma
):

    try:

        print(
            f"[IA] Gerando predição para "
            f"{sensor_id}..."
        )

        # ==================================
        # OPEN-METEO
        # ==================================

        dados_meteorologicos = obter_dados_meteorologicos(
            latitude=latitude,
            longitude=longitude
        )

        pressao = dados_meteorologicos["pressao"]
        dias_sem_chuva = dados_meteorologicos[
            "dias_sem_chuva"
        ]
        precipitacao_hoje = dados_meteorologicos[
            "precipitacao_hoje"
        ]

        print(
            f"[CLIMA] "
            f"Pressão: {pressao:.1f} hPa | "
            f"Dias sem chuva: {dias_sem_chuva} | "
            f"Chuva hoje: {precipitacao_hoje:.2f} mm"
        )

        # ==================================
        # MODELO ONNX
        # ==================================

        risco = prever_risco(
            temperatura=temperatura,
            umidade=umidade,
            dias_sem_chuva=dias_sem_chuva,
            pressao=pressao,
            bioma=bioma
        )

        print(
            f"[IA] Risco calculado: "
            f"{risco * 100:.2f}%"
        )

        # ==================================
        # SALVA A PREDIÇÃO NO SPRING
        # ==================================

        dados_predicao = {
            "leituraId": leitura_id,
            "sensorId": sensor_id,
            "risco": risco
        }

        resposta = requests.post(
            API_PREDICOES_URL,
            json=dados_predicao,
            timeout=5
        )

        if resposta.status_code == 201:

            print(
                f"[PREDIÇÃO SALVA] "
                f"Sensor: {sensor_id} | "
                f"Leitura: {leitura_id} | "
                f"Risco: {risco * 100:.2f}%"
            )

        else:

            print(
                f"[ERRO PREDIÇÃO] "
                f"Status {resposta.status_code} | "
                f"{resposta.text}"
            )

    except requests.exceptions.RequestException as erro:

        print(
            f"[ERRO PREDIÇÃO] "
            f"Falha de comunicação: {erro}"
        )

    except Exception as erro:

        print(
            f"[ERRO PREDIÇÃO] "
            f"Não foi possível gerar a predição: {erro}"
        )


# ==========================================
# ENVIO DA LEITURA PARA A API
# ==========================================

def enviar_leitura(
    sensor_id,
    temperatura,
    umidade,
    latitude,
    longitude,
    regiao,
    bioma
):

    dados = {
        "sensorId": sensor_id,
        "temperatura": temperatura,
        "umidade": umidade,
        "latitude": latitude,
        "longitude": longitude,
        "regiao": regiao,
        "bioma": bioma
    }

    try:

        resposta = requests.post(
            API_URL,
            json=dados,
            timeout=5
        )

        if resposta.status_code == 201:

            # A resposta do Spring contém a leitura
            # que acabou de ser salva.
            leitura_salva = resposta.json()

            leitura_id = leitura_salva.get("id")

            print(
                "[ENVIADO] "
                f"Sensor: {sensor_id} | "
                f"Leitura: {leitura_id} | "
                f"Temp: {temperatura:.2f} °C | "
                f"Umidade: {umidade:.2f}% | "
                f"Lat: {latitude:.6f} | "
                f"Lon: {longitude:.6f} | "
                f"Região: {regiao} | "
                f"Bioma: {bioma}"
            )

            if leitura_id is None:

                print(
                    "[ERRO] A API salvou a leitura, "
                    "mas não retornou o ID."
                )

                return

            # Somente depois que a leitura foi salva
            # com sucesso fazemos a predição.
            gerar_predicao(
                leitura_id=leitura_id,
                sensor_id=sensor_id,
                temperatura=temperatura,
                umidade=umidade,
                latitude=latitude,
                longitude=longitude,
                bioma=bioma
            )

        else:

            print(
                f"[ERRO API] "
                f"Status {resposta.status_code} | "
                f"{resposta.text}"
            )

    except requests.exceptions.RequestException as erro:

        print(
            f"[ERRO API] "
            f"Não foi possível conectar: {erro}"
        )


# ==========================================
# CONEXÃO COM O ARDUINO
# ==========================================

def conectar_arduino():

    print("==========================================")
    print("          FIREWATCH GATEWAY")
    print("==========================================")
    print(f"Porta serial: {PORTA_SERIAL}")
    print(f"Baud rate: {BAUD_RATE}")
    print(f"API leituras: {API_URL}")
    print(f"API predições: {API_PREDICOES_URL}")
    print("==========================================")

    try:

        arduino = serial.Serial(
            port=PORTA_SERIAL,
            baudrate=BAUD_RATE,
            timeout=2
        )

        # O Arduino Uno normalmente reinicia
        # ao abrir a conexão serial.
        time.sleep(2)

        print("\n[OK] Arduino conectado.")
        print("[OK] Aguardando leituras...\n")

        return arduino

    except serial.SerialException as erro:

        print("\n[ERRO] Não foi possível conectar ao Arduino.")
        print(f"Detalhes: {erro}")

        return None


# ==========================================
# PROCESSAMENTO DOS DADOS
# ==========================================

def processar_linha(linha):

    # Formato esperado:
    #
    # sensorId,temperatura,umidade,
    # latitude,longitude,regiao,bioma
    #
    # Exemplo:
    #
    # Arduino_01,31.42,27.81,
    # -21.851073,-46.760875,
    # Mirante Serra da Paulista,
    # Mata Atlântica

    partes = linha.split(",")

    if len(partes) != 7:

        print(
            f"[IGNORADO] Formato inesperado: {linha}"
        )

        return

    try:

        sensor_id = partes[0].strip()

        temperatura = float(partes[1])
        umidade = float(partes[2])

        latitude = float(partes[3])
        longitude = float(partes[4])

        regiao = partes[5].strip()
        bioma = partes[6].strip()

    except ValueError:

        print(
            f"[IGNORADO] Valores inválidos: {linha}"
        )

        return

    # ======================================
    # VALIDAÇÕES
    # ======================================

    if not sensor_id:

        print(
            "[IGNORADO] Sensor sem identificação."
        )

        return

    if temperatura < -40 or temperatura > 80:

        print(
            f"[IGNORADO] Temperatura inválida: "
            f"{temperatura}"
        )

        return

    if umidade < 0 or umidade > 100:

        print(
            f"[IGNORADO] Umidade inválida: "
            f"{umidade}"
        )

        return

    if latitude < -90 or latitude > 90:

        print(
            f"[IGNORADO] Latitude inválida: "
            f"{latitude}"
        )

        return

    if longitude < -180 or longitude > 180:

        print(
            f"[IGNORADO] Longitude inválida: "
            f"{longitude}"
        )

        return

    if not regiao:

        print(
            "[IGNORADO] Região sem identificação."
        )

        return

    if not bioma:

        print(
            "[IGNORADO] Bioma sem identificação."
        )

        return

    # ======================================
    # ENVIA PARA O SPRING BOOT
    # ======================================

    enviar_leitura(
        sensor_id=sensor_id,
        temperatura=temperatura,
        umidade=umidade,
        latitude=latitude,
        longitude=longitude,
        regiao=regiao,
        bioma=bioma
    )


# ==========================================
# EXECUÇÃO PRINCIPAL
# ==========================================

def iniciar():

    arduino = conectar_arduino()

    if arduino is None:
        return

    try:

        while True:

            linha = arduino.readline().decode(
                "utf-8",
                errors="ignore"
            ).strip()

            if not linha:
                continue

            # Arduino pode enviar "ERRO"
            # quando não conseguir ler o DHT22.
            if linha == "ERRO":

                print(
                    "[ARDUINO] Falha na leitura do DHT22."
                )

                continue

            print(
                f"[RECEBIDO] {linha}"
            )

            processar_linha(linha)

    except KeyboardInterrupt:

        print()
        print("==========================================")
        print("Encerrando FireWatch Gateway...")
        print("==========================================")

    except serial.SerialException as erro:

        print()
        print("[ERRO SERIAL]")

        print(
            f"A conexão com o Arduino foi perdida: "
            f"{erro}"
        )

    finally:

        if arduino.is_open:
            arduino.close()

        print(
            "Conexão serial encerrada."
        )


if __name__ == "__main__":
    iniciar()
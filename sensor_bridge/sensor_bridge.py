import time
import serial
import requests

# ==========================================
# CONFIGURAÇÕES
# ==========================================

PORTA_SERIAL = "COM4"
BAUD_RATE = 9600

API_URL = "http://localhost:8080/api/leituras"


# ==========================================
# ENVIO PARA A API
# ==========================================

def enviar_leitura(
    sensor_id,
    temperatura,
    umidade,
    latitude,
    longitude
):

    dados = {
        "sensorId": sensor_id,
        "temperatura": temperatura,
        "umidade": umidade,
        "latitude": latitude,
        "longitude": longitude
    }

    try:
        resposta = requests.post(
            API_URL,
            json=dados,
            timeout=5
        )

        if resposta.status_code == 201:
            print(
                "[ENVIADO] "
                f"Sensor: {sensor_id} | "
                f"Temp: {temperatura:.2f} °C | "
                f"Umidade: {umidade:.2f}% | "
                f"Lat: {latitude:.6f} | "
                f"Lon: {longitude:.6f}"
            )

        else:
            print(
                f"[ERRO API] "
                f"Status {resposta.status_code} | "
                f"{resposta.text}"
            )

    except requests.exceptions.RequestException as erro:
        print(
            f"[ERRO API] Não foi possível conectar: {erro}"
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
    print(f"API: {API_URL}")
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
    # sensorId,temperatura,umidade,latitude,longitude
    #
    # Exemplo:
    # sensor-01,31.42,27.81,-21.123456,-46.123456

    partes = linha.split(",")

    if len(partes) != 5:
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

    except ValueError:
        print(
            f"[IGNORADO] Valores inválidos: {linha}"
        )
        return

    # ======================================
    # VALIDAÇÕES
    # ======================================

    if not sensor_id:
        print("[IGNORADO] Sensor sem identificação.")
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

    # ======================================
    # ENVIA PARA O SPRING BOOT
    # ======================================

    enviar_leitura(
        sensor_id,
        temperatura,
        umidade,
        latitude,
        longitude
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

            print(f"[RECEBIDO] {linha}")

            processar_linha(linha)

    except KeyboardInterrupt:

        print("\n==========================================")
        print("Encerrando FireWatch Gateway...")
        print("==========================================")

    except serial.SerialException as erro:

        print("\n[ERRO SERIAL]")
        print(
            f"A conexão com o Arduino foi perdida: "
            f"{erro}"
        )

    finally:

        if arduino.is_open:
            arduino.close()

        print("Conexão serial encerrada.")


if __name__ == "__main__":
    iniciar()
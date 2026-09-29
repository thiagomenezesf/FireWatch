from datetime import date, timedelta

import requests


# =========================================================
# CONFIGURAÇÕES
# =========================================================

URL_FORECAST = "https://api.open-meteo.com/v1/forecast"
URL_HISTORICO = "https://archive-api.open-meteo.com/v1/archive"

# Quantos dias anteriores serão consultados inicialmente
DIAS_HISTORICO = 30

# Por enquanto, consideramos que qualquer precipitação
# acima de 0 mm significa que houve chuva.
LIMITE_CHUVA_MM = 0.0

TIMEOUT_SEGUNDOS = 10


# =========================================================
# PRESSÃO ATUAL
# =========================================================

def obter_pressao_atual(
    latitude: float,
    longitude: float
) -> float:
    """
    Obtém a pressão atmosférica atual na superfície
    para as coordenadas informadas.

    Retorno:
        pressão em hPa.
    """

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "surface_pressure",
        "timezone": "auto"
    }

    response = requests.get(
        URL_FORECAST,
        params=params,
        timeout=TIMEOUT_SEGUNDOS
    )

    response.raise_for_status()

    dados = response.json()

    current = dados.get("current")

    if not current:
        raise ValueError(
            "O Open-Meteo não retornou dados meteorológicos atuais."
        )

    pressao = current.get("surface_pressure")

    if pressao is None:
        raise ValueError(
            "O Open-Meteo não retornou surface_pressure."
        )

    return float(pressao)


# =========================================================
# PRECIPITAÇÃO DE HOJE
# =========================================================

def obter_precipitacao_hoje(
    latitude: float,
    longitude: float
) -> float:
    """
    Obtém a precipitação acumulada do dia atual
    para as coordenadas informadas.

    Retorno:
        precipitação em mm.
    """

    hoje = date.today().isoformat()

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "precipitation_sum",
        "start_date": hoje,
        "end_date": hoje,
        "timezone": "auto"
    }

    response = requests.get(
        URL_FORECAST,
        params=params,
        timeout=TIMEOUT_SEGUNDOS
    )

    response.raise_for_status()

    dados = response.json()

    daily = dados.get("daily")

    if not daily:
        raise ValueError(
            "O Open-Meteo não retornou dados diários para hoje."
        )

    precipitacoes = daily.get("precipitation_sum")

    if not precipitacoes:
        raise ValueError(
            "O Open-Meteo não retornou precipitation_sum para hoje."
        )

    precipitacao = precipitacoes[0]

    if precipitacao is None:
        raise ValueError(
            "A precipitação de hoje não está disponível."
        )

    return float(precipitacao)


# =========================================================
# HISTÓRICO DE PRECIPITAÇÃO
# =========================================================

def obter_historico_precipitacao(
    latitude: float,
    longitude: float,
    dias_historico: int = DIAS_HISTORICO
) -> list[float]:
    """
    Obtém a precipitação diária dos dias anteriores.

    O dia atual não é consultado aqui porque ele é obtido
    separadamente pela Forecast API.

    Retorno:
        lista de precipitações em ordem cronológica,
        do dia mais antigo para o mais recente.
    """

    if dias_historico <= 0:
        raise ValueError(
            "dias_historico deve ser maior que zero."
        )

    ontem = date.today() - timedelta(days=1)

    data_inicial = ontem - timedelta(
        days=dias_historico - 1
    )

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": data_inicial.isoformat(),
        "end_date": ontem.isoformat(),
        "daily": "precipitation_sum",
        "timezone": "auto"
    }

    response = requests.get(
        URL_HISTORICO,
        params=params,
        timeout=TIMEOUT_SEGUNDOS
    )

    response.raise_for_status()

    dados = response.json()

    daily = dados.get("daily")

    if not daily:
        raise ValueError(
            "O Open-Meteo não retornou o histórico diário."
        )

    precipitacoes = daily.get("precipitation_sum")

    if not precipitacoes:
        raise ValueError(
            "O Open-Meteo não retornou o histórico de precipitação."
        )

    return precipitacoes


# =========================================================
# CÁLCULO DOS DIAS SEM CHUVA
# =========================================================

def calcular_dias_sem_chuva(
    precipitacao_hoje: float,
    historico: list[float]
) -> int:
    """
    Calcula quantos dias consecutivos estão sem chuva,
    considerando também o dia atual.

    Regra atual:

        precipitação > LIMITE_CHUVA_MM
            -> houve chuva

        precipitação <= LIMITE_CHUVA_MM
            -> dia sem chuva
    """

    # Se já houve chuva hoje, a sequência é zerada.
    if precipitacao_hoje > LIMITE_CHUVA_MM:
        return 0

    # Hoje está sem chuva até o momento.
    dias_sem_chuva = 1

    # Percorre o histórico começando por ontem.
    for precipitacao in reversed(historico):

        # Se o dado estiver ausente, não devemos fingir
        # que foi um dia sem chuva.
        if precipitacao is None:
            break

        precipitacao = float(precipitacao)

        if precipitacao <= LIMITE_CHUVA_MM:
            dias_sem_chuva += 1
        else:
            break

    return dias_sem_chuva


# =========================================================
# SERVIÇO METEOROLÓGICO
# =========================================================

def obter_dados_meteorologicos(
    latitude: float,
    longitude: float
) -> dict:
    """
    Obtém os dados meteorológicos necessários para
    alimentar o modelo de IA do FireWatch.

    Retorno:

        {
            "pressao": float,
            "precipitacao_hoje": float,
            "dias_sem_chuva": int
        }
    """

    pressao = obter_pressao_atual(
        latitude,
        longitude
    )

    precipitacao_hoje = obter_precipitacao_hoje(
        latitude,
        longitude
    )

    historico = obter_historico_precipitacao(
        latitude,
        longitude
    )

    dias_sem_chuva = calcular_dias_sem_chuva(
        precipitacao_hoje,
        historico
    )

    return {
        "pressao": pressao,
        "precipitacao_hoje": precipitacao_hoje,
        "dias_sem_chuva": dias_sem_chuva
    }


# =========================================================
# TESTE LOCAL
# =========================================================

if __name__ == "__main__":

    # Arduino_01
    # Mirante Serra da Paulista

    latitude = -21.851073
    longitude = -46.760875

    print("========================================")
    print("       FIREWATCH - OPEN-METEO")
    print("========================================")
    print()

    print("Sensor: Arduino_01")
    print("Região: Mirante Serra da Paulista")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")
    print()

    try:

        dados = obter_dados_meteorologicos(
            latitude,
            longitude
        )

        print("=== DADOS METEOROLÓGICOS ===")
        print(
            f"Pressão atual: "
            f"{dados['pressao']:.1f} hPa"
        )

        print(
            f"Precipitação hoje: "
            f"{dados['precipitacao_hoje']:.2f} mm"
        )

        print(
            f"Dias sem chuva: "
            f"{dados['dias_sem_chuva']}"
        )

    except requests.RequestException as erro:

        print()
        print("[ERRO] Falha ao consultar o Open-Meteo.")
        print(erro)

    except ValueError as erro:

        print()
        print("[ERRO] Os dados recebidos são inválidos.")
        print(erro)

    except Exception as erro:

        print()
        print("[ERRO] Ocorreu um erro inesperado.")
        print(erro)
from pathlib import Path

import numpy as np
import onnxruntime as ort


# =========================================================
# CONFIGURAÇÃO DO MODELO
# =========================================================

PASTA_ATUAL = Path(__file__).resolve().parent
CAMINHO_MODELO = PASTA_ATUAL / "pipeline_mlp.onnx"


# =========================================================
# CARREGAMENTO DO MODELO
# =========================================================

if not CAMINHO_MODELO.exists():
    raise FileNotFoundError(
        f"Modelo ONNX não encontrado em: {CAMINHO_MODELO}"
    )

session = ort.InferenceSession(str(CAMINHO_MODELO))

INPUT_NAME = session.get_inputs()[0].name
OUTPUT_NAME = session.get_outputs()[0].name


# =========================================================
# CONVERSÃO DO BIOMA
# =========================================================

def converter_bioma(bioma: str) -> float:
    """
    Converte o nome do bioma para o mesmo valor utilizado
    atualmente pelo Ia.tsx.

    Mata Atlântica -> 1.0
    outros         -> 0.0
    """

    if not bioma:
        raise ValueError("O bioma não pode ser vazio.")

    bioma_normalizado = bioma.strip().lower()

    if bioma_normalizado in [
        "mata atlântica",
        "mata atlantica"
    ]:
        return 1.0

    return 0.0


# =========================================================
# PREDIÇÃO
# =========================================================

def prever_risco(
    temperatura: float,
    umidade: float,
    dias_sem_chuva: int,
    pressao: float,
    bioma: str
) -> float:
    """
    Executa a inferência utilizando o modelo ONNX.

    Ordem das features esperada pelo modelo:

    1. temperatura
    2. umidade
    3. dias_sem_chuva
    4. pressao
    5. bioma

    Retorna:
        risco entre 0.0 e 1.0
    """

    bioma_convertido = converter_bioma(bioma)

    features = np.array(
        [[
            float(temperatura),
            float(umidade),
            float(dias_sem_chuva),
            float(pressao),
            bioma_convertido
        ]],
        dtype=np.float32
    )

    resultado = session.run(
        [OUTPUT_NAME],
        {
            INPUT_NAME: features
        }
    )

    risco = float(resultado[0].flatten()[0])

    print(f"[DEBUG] Saída original do modelo: {risco}")

    # Mesmo comportamento utilizado no Ia.tsx
    risco = max(0.0, min(1.0, risco))

    return risco


# =========================================================
# TESTE LOCAL COM OPEN-METEO
# =========================================================

if __name__ == "__main__":

    # Importamos aqui apenas para o teste integrado
    from ia_service.weather_serviceAntigo import obter_dados_meteorologicos

    print("[OK] Modelo ONNX carregado.")
    print(f"Entrada: {INPUT_NAME}")
    print(f"Formato: {session.get_inputs()[0].shape}")
    print(f"Saída: {OUTPUT_NAME}")
    print()

    # =====================================================
    # DADOS DO ARDUINO
    # Por enquanto simulados manualmente
    # =====================================================

    sensor_id = "Arduino_01"

    temperatura = 32.5
    umidade = 45.0

    latitude = -21.851073
    longitude = -46.760875

    bioma = "Mata Atlântica"

    print("=== DADOS DO SENSOR ===")
    print(f"Sensor: {sensor_id}")
    print(f"Temperatura: {temperatura} °C")
    print(f"Umidade: {umidade} %")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")
    print(f"Bioma: {bioma}")
    print()

    # =====================================================
    # OPEN-METEO
    # =====================================================

    print("Consultando Open-Meteo...")

    dados_meteorologicos = obter_dados_meteorologicos(
        latitude=latitude,
        longitude=longitude
    )

    pressao = dados_meteorologicos["pressao"]
    dias_sem_chuva = dados_meteorologicos["dias_sem_chuva"]

    print()
    print("=== DADOS METEOROLÓGICOS ===")
    print(f"Pressão: {pressao:.1f} hPa")
    print(
        f"Precipitação hoje: "
        f"{dados_meteorologicos['precipitacao_hoje']:.2f} mm"
    )
    print(f"Dias sem chuva: {dias_sem_chuva}")
    print()

    # =====================================================
    # MODELO ONNX
    # =====================================================

    risco = prever_risco(
        temperatura=temperatura,
        umidade=umidade,
        dias_sem_chuva=dias_sem_chuva,
        pressao=pressao,
        bioma=bioma
    )

    print("=== PREDIÇÃO DE RISCO ===")
    print(f"Risco bruto: {risco}")
    print(f"Risco percentual: {risco * 100:.2f}%")
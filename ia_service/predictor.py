from pathlib import Path

import numpy as np
import onnxruntime as ort


# =========================================================
# Modelo ONNX
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "modelo_arvore_depth17.onnx"

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Modelo ONNX não encontrado: {MODEL_PATH}"
    )

session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name


# =========================================================
# Codificação dos biomas
# Mesma codificação utilizada durante o treinamento
# =========================================================

BIOMA_CODIGOS = {
    "Amazônia": 0,
    "Amazonia": 0,

    "Caatinga": 1,

    "Cerrado": 2,

    "Mata Atlântica": 3,
    "Mata Atlantica": 3,

    "Pampa": 4,

    "Pantanal": 5,
}


def obter_codigo_bioma(bioma: str) -> int:
    if bioma not in BIOMA_CODIGOS:
        raise ValueError(
            f"Bioma inválido: '{bioma}'. "
            f"Biomas disponíveis: {list(BIOMA_CODIGOS.keys())}"
        )

    return BIOMA_CODIGOS[bioma]


# =========================================================
# Predição
# =========================================================

def prever_risco(
    temperatura: float,
    dias_sem_chuva: int,
    rajadas_vento_10m: float,
    umidade: float,
    bioma: str,
    pressao_msl: float
) -> float:

    bioma_codigo = obter_codigo_bioma(bioma)

    # IMPORTANTE:
    # Esta ordem deve ser exatamente a mesma usada no treinamento:
    #
    # 1. temperatura
    # 2. numero_dias_sem_chuva
    # 3. rajadas_vento_10m
    # 4. umidade_ar_pct
    # 5. bioma_codigo
    # 6. pressao_msl

    features = np.array([[
        float(temperatura),
        float(dias_sem_chuva),
        float(rajadas_vento_10m),
        float(umidade),
        float(bioma_codigo),
        float(pressao_msl)
    ]], dtype=np.float32)

    resultado = session.run(
        [output_name],
        {input_name: features}
    )

    risco = float(
        np.asarray(resultado[0]).flatten()[0]
    )

    # Segurança para manter o risco no intervalo utilizado pelo FireWatch.
    risco = max(0.0, min(1.0, risco))

    return risco


# =========================================================
# Teste local
# =========================================================

if __name__ == "__main__":

    print("[OK] Modelo carregado")
    print(f"[OK] Modelo: {MODEL_PATH.name}")
    print(f"[OK] Input: {input_name}")
    print(f"[OK] Output: {output_name}")

    risco = prever_risco(
        temperatura=30.0,
        dias_sem_chuva=8,
        rajadas_vento_10m=13.3,
        umidade=45.0,
        bioma="Mata Atlântica",
        pressao_msl=1012.8
    )

    print(f"[TESTE] Risco previsto: {risco:.6f}")
    print(f"[TESTE] Risco previsto: {risco * 100:.2f}%")
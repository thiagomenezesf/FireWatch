from pathlib import Path

import numpy as np
import onnxruntime as ort


# =========================================================
# Modelo ONNX
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "modelo_arvore_ofc.onnx"

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
# Predição
# =========================================================

def prever_risco(
    temperatura: float,
    umidade: float,
    dias_sem_chuva: int,
    pressao_msl: float
) -> float:

   

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
        float(umidade),
        float(dias_sem_chuva),
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
        temperatura=22.0,
        umidade=59.0,
        dias_sem_chuva=1,
        pressao_msl=1012.8
    )

    print(f"[TESTE] Risco previsto: {risco:.6f}")
    print(f"[TESTE] Risco previsto: {risco * 100:.2f}%")
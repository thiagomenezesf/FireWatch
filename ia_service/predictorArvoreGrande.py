from pathlib import Path

import numpy as np
import onnxruntime as ort


# ==========================================================
# MODELO
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "modelo_arvore.onnx"


# ==========================================================
# MAPEAMENTO DOS BIOMAS
# Mesmo mapeamento utilizado durante o treinamento.
# ==========================================================

BIOMA_CODIGOS = {
    "Amazônia": 0,
    "Caatinga": 1,
    "Cerrado": 2,
    "Mata Atlântica": 3,
    "Pampa": 4,
    "Pantanal": 5,
}


# ==========================================================
# CARREGAMENTO DO MODELO
# ==========================================================

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


print("[IA] Modelo carregado com sucesso.")
print(f"[IA] Modelo: {MODEL_PATH.name}")
print(f"[IA] Entrada: {input_name}")
print(f"[IA] Saída: {output_name}")


# ==========================================================
# CONVERTER BIOMA
# ==========================================================

def obter_codigo_bioma(bioma: str) -> float:

    bioma_limpo = bioma.strip()

    if bioma_limpo not in BIOMA_CODIGOS:
        raise ValueError(
            f"Bioma inválido: '{bioma}'. "
            f"Biomas aceitos: {list(BIOMA_CODIGOS.keys())}"
        )

    return float(
        BIOMA_CODIGOS[bioma_limpo]
    )


# ==========================================================
# PREDIÇÃO
# ==========================================================

def prever_risco(
    temperatura: float,
    dias_sem_chuva: int,
    rajadas_vento_10m: float,
    umidade: float,
    bioma: str,
    pressao_msl: float
) -> float:

    bioma_codigo = obter_codigo_bioma(
        bioma
    )


    # ======================================================
    # IMPORTANTE:
    #
    # Esta ordem é EXATAMENTE a mesma usada no treinamento:
    #
    # 1 temperatura
    # 2 numero_dias_sem_chuva
    # 3 rajadas_vento_10m
    # 4 umidade_ar_pct
    # 5 bioma_codigo
    # 6 pressao_msl
    # ======================================================

    features = np.array(
        [[
            float(temperatura),
            float(dias_sem_chuva),
            float(rajadas_vento_10m),
            float(umidade),
            float(bioma_codigo),
            float(pressao_msl)
        ]],
        dtype=np.float32
    )


    print("\n[IA] Entrada enviada ao modelo:")

    print(
        f"     Temperatura:       {temperatura:.2f} °C"
    )

    print(
        f"     Dias sem chuva:    {dias_sem_chuva}"
    )

    print(
        f"     Rajada vento 10m:  {rajadas_vento_10m:.2f}"
    )

    print(
        f"     Umidade:           {umidade:.2f} %"
    )

    print(
        f"     Bioma:             {bioma}"
    )

    print(
        f"     Código bioma:      {bioma_codigo}"
    )

    print(
        f"     Pressão MSL:       {pressao_msl:.2f}"
    )


    # ======================================================
    # EXECUTAR MODELO
    # ======================================================

    resultado = session.run(
        [output_name],
        {
            input_name: features
        }
    )


    # O modelo de regressão pode retornar estruturas
    # diferentes dependendo de como foi exportado.
    # flatten() permite pegar o primeiro valor numérico.
    
    risco_bruto = float(
        np.asarray(
            resultado[0]
        ).flatten()[0]
    )


    print(
        f"[IA] Saída bruta do modelo: {risco_bruto:.6f}"
    )


    # ======================================================
    # GARANTIR INTERVALO 0 - 1
    #
    # O alvo risco_fogo utilizado no treinamento estava
    # entre 0 e 1.
    # ======================================================

    risco = max(
        0.0,
        min(
            1.0,
            risco_bruto
        )
    )


    print(
        f"[IA] Risco final: {risco:.6f}"
    )

    print(
        f"[IA] Risco percentual: {risco * 100:.2f}%"
    )


    return risco


# ==========================================================
# TESTE LOCAL
# ==========================================================

if __name__ == "__main__":

    risco = prever_risco(

        temperatura=30.0,

        dias_sem_chuva=8,

        rajadas_vento_10m=13.3,

        umidade=45.0,

        bioma="Mata Atlântica",

        pressao_msl=1012.8

    )


    print(
        f"\nResultado final: {risco * 100:.2f}%"
    )
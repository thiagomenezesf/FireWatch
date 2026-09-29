const API_BASE_URL = "http://localhost:8080/api";

const LEITURAS_URL = `${API_BASE_URL}/leituras`;
const PREDICOES_URL = `${API_BASE_URL}/predicoes`;


// ==========================================
// INTERFACES
// ==========================================

export interface LeituraSensor {
  id?: number;
  sensorId: string;
  temperatura: number;
  umidade: number;
  latitude: number;
  longitude: number;
  regiao: string;
  bioma: string;
  dataHora?: string;
}

export interface PredicaoRisco {
  id: number;
  sensorId: string;
  risco: number;
  dataHora: string;

  leitura: LeituraSensor;
}

export type NovaLeituraSensor = Omit<
  LeituraSensor,
  "id" | "dataHora"
>;


// ==========================================
// GET - LISTAR TODAS AS LEITURAS
// ==========================================

export async function listarLeituras(): Promise<LeituraSensor[]> {

  const response = await fetch(LEITURAS_URL);

  if (!response.ok) {
    throw new Error(
      "Erro ao buscar as leituras."
    );
  }

  return response.json();
}


// ==========================================
// GET - BUSCAR LEITURA POR ID
// ==========================================

export async function buscarLeituraPorId(
  id: number
): Promise<LeituraSensor> {

  const response = await fetch(
    `${LEITURAS_URL}/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar a leitura ${id}.`
    );
  }

  return response.json();
}


// ==========================================
// POST - CRIAR LEITURA
// ==========================================

export async function criarLeitura(
  leitura: NovaLeituraSensor
): Promise<LeituraSensor> {

  const response = await fetch(
    LEITURAS_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(leitura),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao cadastrar a leitura."
    );
  }

  return response.json();
}


// ==========================================
// GET - LISTAR TODAS AS PREDIÇÕES
// ==========================================

export async function listarPredicoes(): Promise<
  PredicaoRisco[]
> {

  const response = await fetch(
    PREDICOES_URL
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao buscar as predições de risco."
    );
  }

  return response.json();
}
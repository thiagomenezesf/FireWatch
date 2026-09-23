const API_URL = "http://localhost:8080/api/leituras";

export interface LeituraSensor {
  id?: number;
  sensorId: string;
  temperatura: number;
  umidade: number;
  latitude: number;
  longitude: number;
  regiao: string;
  dataHora?: string;
}

export type NovaLeituraSensor = Omit<LeituraSensor, "id" | "dataHora">;


// ==========================================
// GET - LISTAR TODAS
// ==========================================

export async function listarLeituras(): Promise<LeituraSensor[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao buscar as leituras.");
  }

  return response.json();
}


// ==========================================
// GET - BUSCAR POR ID
// ==========================================

export async function buscarLeituraPorId(
  id: number
): Promise<LeituraSensor> {

  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar a leitura ${id}.`);
  }

  return response.json();
}


// ==========================================
// POST - CRIAR
// ==========================================

export async function criarLeitura(
  leitura: NovaLeituraSensor
): Promise<LeituraSensor> {

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(leitura),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar a leitura.");
  }

  return response.json();
}


// ==========================================
// PUT - ATUALIZAR
// ==========================================

// export async function atualizarLeitura(
//   id: number,
//   leitura: NovaLeituraSensor
// ): Promise<LeituraSensor> {

//   const response = await fetch(`${API_URL}/${id}`, {
//     method: "PUT",

//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify(leitura),
//   });

//   if (!response.ok) {
//     throw new Error(`Erro ao atualizar a leitura ${id}.`);
//   }

//   return response.json();
// }


// // ==========================================
// // DELETE - EXCLUIR
// // ==========================================

// export async function excluirLeitura(
//   id: number
// ): Promise<void> {

//   const response = await fetch(`${API_URL}/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     throw new Error(`Erro ao excluir a leitura ${id}.`);
//   }
// }
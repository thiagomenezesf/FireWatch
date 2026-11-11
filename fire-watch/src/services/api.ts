// ==========================================
// INTERFACES (Mantidas exatamente iguais)
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

export type NovaLeituraSensor = Omit<LeituraSensor, "id" | "dataHora">;

// ==========================================
// DADOS FIXOS DO ARDUINO (Coordenadas)
// ==========================================

const listaLatitudes = [
  -21.851073, -21.850535, -21.852248, -21.856550, -21.857844, // Mirante
  -21.937159, -21.936732, -21.938107, -21.939366, -21.939754, // Pedra Balão
  -21.896328, -21.895233, -21.895449, -21.897074, -21.897801, // Bambu Amarelo
  -21.908078, -21.908506, -21.909949, -21.910994, -21.911522, // Capelinha
  -21.862210, -21.860617, -21.862957, -21.865068, -21.865994, // Vinicola
  -21.892898, -21.891206, -21.892729, -21.896054, -21.895517  // Cruz Cruzeiro
];

const listaLongitudes = [
  -46.760875, -46.753558, -46.746670, -46.757120, -46.748086,
  -46.768087, -46.765024, -46.762602, -46.766902, -46.764166,
  -46.829812, -46.827463, -46.824569, -46.826613, -46.824193,
  -46.807316, -46.802885, -46.800785, -46.806595, -46.803325,
  -46.802958, -46.797486, -46.792486, -46.798838, -46.793098,
  -46.748485, -46.740782, -46.733594, -46.745396, -46.738111
];

function obterRegiaoEBioma(index: number) {
  if (index >= 0 && index < 5) return { regiao: "Mirante Serra da Paulista", bioma: "Mata Atlantica" };
  if (index >= 5 && index < 10) return { regiao: "Região Pedra Balão", bioma: "Cerrado" };
  if (index >= 10 && index < 15) return { regiao: "Pesqueiro Bambu Amarelo", bioma: "Mata Atlantica" };
  if (index >= 15 && index < 20) return { regiao: "Capelinha Nossa Senhora", bioma: "Mata Atlantica" };
  if (index >= 20 && index < 25) return { regiao: "Vinicola Lancellotti", bioma: "Mata Atlantica" };
  return { regiao: "Cruz Cruzeiro do Sul", bioma: "Cerrado" };
}

// ==========================================
// ESTADO SIMULADO (Memória Temporária)
// ==========================================

let cacheLeituras: LeituraSensor[] = [];
let cachePredicoes: PredicaoRisco[] = [];

// Função que cria os dados aleatórios idênticos aos do Arduino
function gerarDadosSimulados() {
  const novasLeituras: LeituraSensor[] = [];
  const novasPredicoes: PredicaoRisco[] = [];
  const agora = new Date().toISOString();

  for (let i = 0; i < 30; i++) {
    // Temperaturas entre 15.0 e 40.0, Umidade entre 30.0 e 90.0 (igual ao Arduino)
    const temp = Number((Math.random() * (40.0 - 15.0) + 15.0).toFixed(1));
    const umid = Number((Math.random() * (90.0 - 30.0) + 30.0).toFixed(1));
    const { regiao, bioma } = obterRegiaoEBioma(i);
    const sensorId = `Arduino_${String(i + 1).padStart(2, '0')}`;

    const leitura: LeituraSensor = {
      id: i + 1,
      sensorId: sensorId,
      temperatura: temp,
      umidade: umid,
      latitude: listaLatitudes[i],
      longitude: listaLongitudes[i],
      regiao: regiao,
      bioma: bioma,
      dataHora: agora
    };

    // Simula a IA: Alta temperatura e baixa humidade = Risco maior
    const fatorTemp = (temp - 15) / 25; 
    const fatorUmid = 1 - ((umid - 30) / 60); 
    let riscoCalculado = (fatorTemp * 0.6) + (fatorUmid * 0.4);
    
    // Adiciona um pouco de ruído aleatório para o gráfico ficar dinâmico
    riscoCalculado += (Math.random() * 0.15 - 0.075); 
    riscoCalculado = Math.max(0, Math.min(1, riscoCalculado));

    const predicao: PredicaoRisco = {
      id: i + 1,
      sensorId: sensorId,
      risco: Number(riscoCalculado.toFixed(3)),
      dataHora: agora,
      leitura: leitura
    };

    novasLeituras.push(leitura);
    novasPredicoes.push(predicao);
  }

  cacheLeituras = novasLeituras;
  cachePredicoes = novasPredicoes;
}


// ==========================================
// FUNÇÕES MOCKADAS (Substituem os fetchs da API)
// ==========================================

// GET - LISTAR TODAS AS LEITURAS
export async function listarLeituras(): Promise<LeituraSensor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      gerarDadosSimulados(); // Atualiza os dados a cada chamada
      resolve(cacheLeituras);
    }, 200); // Delay de 600ms para simular o carregamento da rede
  });
}

// GET - LISTAR TODAS AS PREDIÇÕES
export async function listarPredicoes(): Promise<PredicaoRisco[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cachePredicoes);
    }, 200);
  });
}

// GET - BUSCAR LEITURA POR ID
export async function buscarLeituraPorId(id: number): Promise<LeituraSensor> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leitura = cacheLeituras.find(l => l.id === id);
      if (leitura) {
        resolve(leitura);
      } else {
        reject(new Error(`Erro ao buscar a leitura ${id}.`));
      }
    }, 200);
  });
}

// POST - CRIAR LEITURA (Mantido apenas para evitar erros de compilação)
export async function criarLeitura(leitura: NovaLeituraSensor): Promise<LeituraSensor> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nova: LeituraSensor = {
        ...leitura,
        id: Math.floor(Math.random() * 1000) + 100,
        dataHora: new Date().toISOString()
      };
      cacheLeituras.push(nova);
      resolve(nova);
    }, 200);
  });
}
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './styles/MonitoringPageTest.css';
import mapaSerra from './assets/mapa-serra.png';

import {
  listarLeituras,
  listarPredicoes,
  type LeituraSensor,
  type PredicaoRisco
} from './services/api';


// ==========================================
// INTERFACES
// ==========================================

interface RegionData {
  id: number;
  name: string;
  slug: string;

  temp: number | null;
  humidity: number | null;
  risk: number | null;

  activeSensors: number;

  x: string;
  y: string;
}


// ==========================================
// CONFIGURAÇÃO DAS REGIÕES
// ==========================================

const REGIOES_BASE: RegionData[] = [
  {
    id: 1,
    name: 'Mirante Serra da Paulista',
    slug: 'mirante-serra-da-paulista',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '61.5%',
    y: '13%'
  },
  {
    id: 2,
    name: 'Região Pedra Balão',
    slug: 'regiao-pedra-balao',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '56%',
    y: '81%'
  },
  {
    id: 3,
    name: 'Pesqueiro Bambu Amarelo',
    slug: 'pesqueiro-bambu-amarelo',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '30.5%',
    y: '47%'
  },
  {
    id: 4,
    name: 'Capelinha Nossa Senhora',
    slug: 'capelinha-nossa-senhora',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '40%',
    y: '58%'
  },
  {
    id: 5,
    name: 'Vinicola Lanchellotti',
    slug: 'vinicola-lanchellotti',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '43%',
    y: '22%'
  },
  {
    id: 6,
    name: 'Cruz Cruzeiro do Sul',
    slug: 'cruz-cruzeiro-do-sul',
    temp: null,
    humidity: null,
    risk: null,
    activeSensors: 0,
    x: '65%',
    y: '48%'
  }
];


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function normalizarRisco(risk: number): number {
  return Math.max(0, Math.min(1, risk));
}


function obterCorRisco(risk: number): string {
  const riscoNormalizado = normalizarRisco(risk);

  // 120 = verde
  // 60  = amarelo
  // 30  = laranja
  // 0   = vermelho
  const hue = 120 * (1 - riscoNormalizado);

  return `hsl(${hue}, 90%, 50%)`;
}


function obterTamanhoHalo(risk: number): number {
  const riscoNormalizado = normalizarRisco(risk);

  // 80px em 0%
  // 190px em 100%
  return 80 + riscoNormalizado * 110;
}


function obterOpacidadeHalo(risk: number): number {
  const riscoNormalizado = normalizarRisco(risk);

  return 0.25 + riscoNormalizado * 0.45;
}


function obterUltimasLeiturasPorSensor(
  leituras: LeituraSensor[]
): LeituraSensor[] {

  const ultimas: Record<string, LeituraSensor> = {};

  leituras.forEach((leitura) => {

    const atual = ultimas[leitura.sensorId];

    if (!atual) {
      ultimas[leitura.sensorId] = leitura;
      return;
    }

    const dataAtual = atual.dataHora
      ? new Date(atual.dataHora).getTime()
      : 0;

    const dataNova = leitura.dataHora
      ? new Date(leitura.dataHora).getTime()
      : 0;

    if (dataNova > dataAtual) {
      ultimas[leitura.sensorId] = leitura;
    }
  });

  return Object.values(ultimas);
}


function obterUltimasPredicoesPorSensor(
  predicoes: PredicaoRisco[]
): PredicaoRisco[] {

  const ultimas: Record<string, PredicaoRisco> = {};

  predicoes.forEach((predicao) => {

    const atual = ultimas[predicao.sensorId];

    if (!atual) {
      ultimas[predicao.sensorId] = predicao;
      return;
    }

    const dataAtual = atual.dataHora
      ? new Date(atual.dataHora).getTime()
      : 0;

    const dataNova = predicao.dataHora
      ? new Date(predicao.dataHora).getTime()
      : 0;

    if (dataNova > dataAtual) {
      ultimas[predicao.sensorId] = predicao;
    }
  });

  return Object.values(ultimas);
}


function calcularMedia(valores: number[]): number | null {

  if (valores.length === 0) {
    return null;
  }

  const soma = valores.reduce(
    (total, valor) => total + valor,
    0
  );

  return soma / valores.length;
}


// ==========================================
// COMPONENTE
// ==========================================

export default function MonitoringPage() {

  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  const [leituras, setLeituras] = useState<
    LeituraSensor[]
  >([]);

  const [predicoes, setPredicoes] = useState<
    PredicaoRisco[]
  >([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);


  // ========================================
  // RELÓGIO
  // ========================================

  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);


  // ========================================
  // CARREGA DADOS DA API
  // ========================================

  useEffect(() => {

    let ativo = true;

    const carregarDados = async () => {

      try {

        const [
          leiturasRecebidas,
          predicoesRecebidas
        ] = await Promise.all([
          listarLeituras(),
          listarPredicoes()
        ]);

        if (!ativo) {
          return;
        }

        setLeituras(leiturasRecebidas);
        setPredicoes(predicoesRecebidas);

        setErro(null);

      } catch (error) {

        console.error(
          'Erro ao carregar monitoramento:',
          error
        );

        if (ativo) {
          setErro(
            'Não foi possível atualizar os dados do monitoramento.'
          );
        }

      } finally {

        if (ativo) {
          setCarregando(false);
        }
      }
    };


    // Primeira consulta imediatamente.
    carregarDados();

    // Atualiza automaticamente.
    const intervalo = setInterval(
      carregarDados,
      10000
    );

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };

  }, []);


  // ========================================
  // ÚLTIMA LEITURA DE CADA ARDUINO
  // ========================================

  const ultimasLeituras = useMemo(() => {

    return obterUltimasLeiturasPorSensor(
      leituras
    );

  }, [leituras]);


  // ========================================
  // ÚLTIMA PREDIÇÃO DE CADA ARDUINO
  // ========================================

  const ultimasPredicoes = useMemo(() => {

    return obterUltimasPredicoesPorSensor(
      predicoes
    );

  }, [predicoes]);


  // ========================================
  // AGREGAÇÃO POR REGIÃO
  // ========================================

  const regioes = useMemo(() => {

    return REGIOES_BASE.map((regiao) => {

      // ------------------------------------
      // LEITURAS DA REGIÃO
      // ------------------------------------

      const leiturasRegiao = ultimasLeituras.filter(
        (leitura) =>
          leitura.regiao === regiao.name
      );


      const temperaturas = leiturasRegiao.map(
        (leitura) => leitura.temperatura
      );

      const umidades = leiturasRegiao.map(
        (leitura) => leitura.umidade
      );


      const temperaturaMedia =
        calcularMedia(temperaturas);

      const umidadeMedia =
        calcularMedia(umidades);


      // ------------------------------------
      // PREDIÇÕES DA REGIÃO
      // ------------------------------------

      const predicoesRegiao =
        ultimasPredicoes.filter(
          (predicao) =>
            predicao.leitura?.regiao === regiao.name
        );


      const riscos = predicoesRegiao.map(
        (predicao) => predicao.risco
      );


      const riscoMedio =
        calcularMedia(riscos);


      return {
        ...regiao,

        temp: temperaturaMedia,
        humidity: umidadeMedia,
        risk: riscoMedio,

        activeSensors: leiturasRegiao.length
      };

    });

  }, [
    ultimasLeituras,
    ultimasPredicoes
  ]);


  // ========================================
  // KPIs GERAIS
  // ========================================

  const temperaturaGeral = useMemo(() => {

    return calcularMedia(
      ultimasLeituras.map(
        (leitura) => leitura.temperatura
      )
    );

  }, [ultimasLeituras]);


  const umidadeGeral = useMemo(() => {

    return calcularMedia(
      ultimasLeituras.map(
        (leitura) => leitura.umidade
      )
    );

  }, [ultimasLeituras]);


  const riscoGeral = useMemo(() => {

    return calcularMedia(
      ultimasPredicoes.map(
        (predicao) => predicao.risco
      )
    );

  }, [ultimasPredicoes]);


  const sensoresAtivos = ultimasLeituras.length;


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="dash-container">

      {/* ==================================
          MENU LATERAL
      ================================== */}

      <aside className="dash-sidebar">

        <div className="dash-logo">

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M12 2c0 0-5 6.5-5 11a5 5 0 0 0 10 0c0-4.5-5-11-5-11Z"
            />
          </svg>

          <h2>FireWatch</h2>

        </div>


        <nav className="dash-nav">

          <Link
            to="/monitoramento"
            className="dash-nav-item active"
          >
            📡 Monitoramento
          </Link>

          <Link
            to="/monitoramento/redes-sensores"
            className="dash-nav-item"
          >
            🌡️ Rede de Sensores
          </Link>

        </nav>


        <div className="dash-sidebar-footer">

          <Link
            to="/"
            className="dash-exit-link"
          >
            ← Sair para Landing Page
          </Link>

        </div>

      </aside>


      {/* ==================================
          ÁREA PRINCIPAL
      ================================== */}

      <main className="dash-main">

        {/* ================================
            CABEÇALHO
        ================================ */}

        <header className="dash-header">

          <div className="status-badge">

            <div className="status-dot" />

            Online • São João da Boa Vista, SP •{' '}
            {time.toLocaleTimeString('pt-BR')}

          </div>


          <div className="system-status">

            <span>

              <div className="system-dot system-dot-green" />

              API Meteo: ON

            </span>

            <span>

              <div className="system-dot system-dot-blue" />

              Rede IoT: ON

            </span>

            <span>

              <div className="system-dot system-dot-orange" />

              IA: ON

            </span>

          </div>

        </header>


        {/* ================================
            CONTEÚDO
        ================================ */}

        <div className="dash-content">

          {erro && (
            <div className="monitoring-error">
              {erro}
            </div>
          )}


          {/* ==============================
              KPIs
          ============================== */}

          <div className="kpi-grid">

            <div className="kpi-card">

              <h3>Temperatura Média</h3>

              <div className="kpi-value">

                {temperaturaGeral !== null
                  ? `${temperaturaGeral.toFixed(1)}°C`
                  : '--'}

              </div>

              <div className="kpi-trend trend-neutral">
                Média das últimas leituras
              </div>

            </div>


            <div className="kpi-card">

              <h3>Umidade Relativa Média</h3>

              <div className="kpi-value">

                {umidadeGeral !== null
                  ? `${umidadeGeral.toFixed(1)}%`
                  : '--'}

              </div>

              <div className="kpi-trend trend-neutral">
                Rede de sensores
              </div>

            </div>


            <div className="kpi-card">

              <h3>Índice de Risco Médio</h3>

              <div
                className="kpi-value"
                style={{
                  color:
                    riscoGeral !== null
                      ? obterCorRisco(riscoGeral)
                      : '#a1a1aa'
                }}
              >

                {riscoGeral !== null
                  ? `${(
                      normalizarRisco(riscoGeral) * 100
                    ).toFixed(1)}%`
                  : '--'}

              </div>

              <div className="kpi-trend trend-neutral">
                Modelo preditivo ONNX
              </div>

            </div>


            <div className="kpi-card">

              <h3>Sensores com Dados</h3>

              <div className="kpi-value">

                {sensoresAtivos}/30

              </div>

              <div className="kpi-trend trend-neutral">
                Última leitura disponível
              </div>

            </div>

          </div>


          {/* ==============================
              MAPA
          ============================== */}

          <div className="dash-body-grid">

            <div className="dash-panel">

              <div className="dash-panel-header">

                <div>

                  <h3>
                    Mapeamento GIS em Tempo Real
                  </h3>

                  <span className="panel-subtitle">
                    Área de Preservação: Serra da
                    Paulista, São João da Boa Vista - SP
                  </span>

                </div>


                <div className="live-indicator">

                  <span />

                  Dados em tempo real

                </div>

              </div>


              <div
                className="map-canvas"
                style={{
                  backgroundImage:
                    `linear-gradient(
                      rgba(9, 9, 11, 0.55),
                      rgba(9, 9, 11, 0.55)
                    ),
                    url(${mapaSerra})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '16 / 9'
                }}
              >

                {regioes.map((regiao) => {

                  const possuiRisco =
                    regiao.risk !== null;

                  const risco =
                    normalizarRisco(
                      regiao.risk ?? 0
                    );

                  const cor =
                    obterCorRisco(risco);

                  const tamanhoHalo =
                    obterTamanhoHalo(risco);

                  const opacidade =
                    obterOpacidadeHalo(risco);


                  return (

                    <div
                      key={regiao.id}
                      className="region-marker"
                      style={{
                        left: regiao.x,
                        top: regiao.y
                      }}
                    >

                      {/* ==================
                          HEATMAP
                      ================== */}

                      {possuiRisco && (

                        <div
                          className="sensor-heat"
                          style={{
                            width:
                              `${tamanhoHalo}px`,

                            height:
                              `${tamanhoHalo}px`,

                            opacity:
                              opacidade,

                            background:
                              `radial-gradient(
                                circle,
                                ${cor} 0%,
                                ${cor} 18%,
                                transparent 72%
                              )`
                          }}
                        />

                      )}


                      {/* ==================
                          PONTO
                      ================== */}

                      <button
                        type="button"
                        className="sensor-dot"
                        aria-label={
                          `Abrir monitoramento de ${regiao.name}`
                        }
                        onClick={() =>
                          navigate(
                            `/monitoramento/regiao/${regiao.slug}`
                          )
                        }
                        style={{
                          backgroundColor:
                            possuiRisco
                              ? cor
                              : '#71717a',

                          boxShadow:
                            possuiRisco
                              ? `0 0 14px ${cor}`
                              : '0 0 8px #71717a'
                        }}
                      />


                      {/* ==================
                          INFORMAÇÕES
                      ================== */}

                      <div className="sensor-label">

                        <strong>
                          {regiao.name}
                        </strong>


                        <div className="sensor-label-values">

                          <span>
                            {regiao.temp !== null
                              ? `${regiao.temp.toFixed(1)}°C`
                              : '--°C'}
                          </span>

                          <span>
                            {regiao.humidity !== null
                              ? `${regiao.humidity.toFixed(1)}%`
                              : '--%'}
                          </span>

                          <span
                            style={{
                              color:
                                possuiRisco
                                  ? cor
                                  : '#a1a1aa'
                            }}
                          >
                            Risco:{' '}

                            {possuiRisco
                              ? `${(
                                  risco * 100
                                ).toFixed(1)}%`
                              : '--'}
                          </span>

                        </div>


                        <div className="sensor-count">

                          {regiao.activeSensors}/5 sensores
                          com dados

                        </div>

                      </div>

                    </div>

                  );

                })}


                {/* ========================
                    LEGENDA
                ======================== */}

                <div className="map-legend">

                  <span className="map-legend-title">
                    Gradiente de Risco
                  </span>

                  <div className="risk-gradient" />

                  <div className="risk-scale">

                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>

                  </div>

                  <div className="risk-labels">

                    <span>Baixo</span>

                    <span>Moderado</span>

                    <span>Crítico</span>

                  </div>

                </div>

              </div>

            </div>


            {/* ==============================
                RESUMO DAS REGIÕES
            ============================== */}

            <div className="dash-panel">

              <div className="dash-panel-header">

                <div>

                  <h3>
                    Situação das Regiões
                  </h3>

                  <span className="panel-subtitle">
                    Risco médio atual
                  </span>

                </div>

              </div>


              <div className="region-feed">

                {regioes.map((regiao) => {

                  const possuiRisco =
                    regiao.risk !== null;

                  const risco =
                    normalizarRisco(
                      regiao.risk ?? 0
                    );

                  const cor =
                    obterCorRisco(risco);


                  return (

                    <button
                      key={regiao.id}
                      type="button"
                      className="region-item"
                      onClick={() =>
                        navigate(
                          `/monitoramento/regiao/${regiao.slug}`
                        )
                      }
                    >

                      <div className="region-item-header">

                        <span
                          className="region-risk-dot"
                          style={{
                            backgroundColor:
                              possuiRisco
                                ? cor
                                : '#71717a',

                            boxShadow:
                              possuiRisco
                                ? `0 0 8px ${cor}`
                                : 'none'
                          }}
                        />

                        <strong>
                          {regiao.name}
                        </strong>

                      </div>


                      <div className="region-risk-value">

                        {possuiRisco
                          ? `${(
                              risco * 100
                            ).toFixed(1)}%`
                          : '--'}

                      </div>


                      <div className="region-item-metrics">

                        <span>
                          🌡️{' '}
                          {regiao.temp !== null
                            ? `${regiao.temp.toFixed(1)}°C`
                            : '--'}
                        </span>

                        <span>
                          💧{' '}
                          {regiao.humidity !== null
                            ? `${regiao.humidity.toFixed(1)}%`
                            : '--'}
                        </span>

                      </div>


                      <div className="region-item-sensors">

                        {regiao.activeSensors}/5 sensores
                        com dados

                      </div>

                    </button>

                  );

                })}

              </div>

            </div>

          </div>


          {carregando && (

            <div className="monitoring-loading">
              Carregando dados do FireWatch...
            </div>

          )}

        </div>

      </main>

    </div>
  );
}
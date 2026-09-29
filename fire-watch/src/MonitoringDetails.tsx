import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles/MonitoringPage.css';
import './styles/MonitoringDetails.css';

import mapaSerra from './assets/mapa-serra.png';
import mapaMirante from './assets/mapa-mirante.jpeg';
import mapaPedraBalao from './assets/mapa-pedra-balao.jpeg';
import mapaBambuAmarelo from './assets/mapa-pesqueiro.jpeg';
import mapaCapelinha from './assets/mapa-capela.jpeg';
import mapaVinicola from './assets/mapa-vinicola.jpeg';
import mapaCruzeiro from './assets/mapa-cruzeiro-sul.jpeg';

import {
  listarLeituras,
  listarPredicoes,
  type LeituraSensor,
  type PredicaoRisco
} from './services/api';


/* =========================================================
   INTERFACES
========================================================= */

interface PosicaoSensor {
  x: string;
  y: string;
}

interface SensorDetalhado {
  leitura: LeituraSensor;
  risco: number | null;
}


/* =========================================================
   REGIÕES
========================================================= */

const regioes: Record<string, string> = {
  'mirante-serra-da-paulista': 'Mirante Serra da Paulista',
  'regiao-pedra-balao': 'Região Pedra Balão',
  'pesqueiro-bambu-amarelo': 'Pesqueiro Bambu Amarelo',
  'capelinha-nossa-senhora': 'Capelinha Nossa Senhora',
  'vinicola-lancellotti': 'Vinicola Lancellotti',
  'cruz-cruzeiro-do-sul': 'Cruz Cruzeiro do Sul'
};


const mapasRegioes: Record<string, string> = {
  'mirante-serra-da-paulista': mapaMirante,
  'regiao-pedra-balao': mapaPedraBalao,
  'pesqueiro-bambu-amarelo': mapaBambuAmarelo,
  'capelinha-nossa-senhora': mapaCapelinha,
  'vinicola-lancellotti': mapaVinicola,
  'cruz-cruzeiro-do-sul': mapaCruzeiro
};


/* =========================================================
   POSIÇÕES VISUAIS

   IMPORTANTE:
   os IDs abaixo seguem exatamente o padrão que está
   chegando atualmente do banco.
========================================================= */

const posicoesSensores: Record<string, PosicaoSensor> = {

  /* MIRANTE */
  Arduino_01: { x: '22%', y: '25%' },
  Arduino_02: { x: '48%', y: '20%' },
  Arduino_03: { x: '73%', y: '32%' },
  Arduino_04: { x: '35%', y: '62%' },
  Arduino_05: { x: '67%', y: '70%' },


  /* PEDRA BALÃO */
  Arduino_06: { x: '27%', y: '30%' },
  Arduino_07: { x: '55%', y: '23%' },
  Arduino_08: { x: '76%', y: '48%' },
  Arduino_09: { x: '38%', y: '68%' },
  Arduino_010: { x: '62%', y: '76%' },


  /* BAMBU AMARELO */
  Arduino_011: { x: '20%', y: '42%' },
  Arduino_012: { x: '43%', y: '24%' },
  Arduino_013: { x: '71%', y: '28%' },
  Arduino_014: { x: '52%', y: '58%' },
  Arduino_015: { x: '76%', y: '72%' },


  /* CAPELINHA */
  Arduino_016: { x: '25%', y: '22%' },
  Arduino_017: { x: '62%', y: '25%' },
  Arduino_018: { x: '78%', y: '52%' },
  Arduino_019: { x: '30%', y: '67%' },
  Arduino_020: { x: '57%', y: '74%' },


  /* VINÍCOLA */
  Arduino_021: { x: '18%', y: '35%' },
  Arduino_022: { x: '45%', y: '19%' },
  Arduino_023: { x: '72%', y: '38%' },
  Arduino_024: { x: '39%', y: '61%' },
  Arduino_025: { x: '69%', y: '73%' },


  /* CRUZEIRO DO SUL */
  Arduino_026: { x: '24%', y: '28%' },
  Arduino_027: { x: '52%', y: '22%' },
  Arduino_028: { x: '75%', y: '44%' },
  Arduino_029: { x: '32%', y: '71%' },
  Arduino_030: { x: '61%', y: '65%' }

};


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function normalizarRisco(risco: number): number {
  return Math.max(0, Math.min(1, risco));
}


function obterCorRisco(risco: number): string {

  const riscoNormalizado =
    normalizarRisco(risco);

  /*
    0%   = 120 = verde
    50%  = 60  = amarelo
    75%  = 30  = laranja
    100% = 0   = vermelho
  */

  const hue =
    120 * (1 - riscoNormalizado);

  return `hsl(${hue}, 90%, 50%)`;
}


function obterTamanhoHalo(risco: number): number {

  const riscoNormalizado =
    normalizarRisco(risco);

  return 75 + riscoNormalizado * 100;
}


function obterOpacidadeHalo(risco: number): number {

  const riscoNormalizado =
    normalizarRisco(risco);

  return 0.28 + riscoNormalizado * 0.45;
}


function calcularMedia(
  valores: number[]
): number | null {

  if (valores.length === 0) {
    return null;
  }

  const soma = valores.reduce(
    (total, valor) => total + valor,
    0
  );

  return soma / valores.length;
}


function formatarData(
  data?: string
): string {

  if (!data) {
    return '--';
  }

  const dataConvertida =
    new Date(data);

  if (
    Number.isNaN(
      dataConvertida.getTime()
    )
  ) {
    return '--';
  }

  return dataConvertida.toLocaleString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  );
}


/* =========================================================
   COMPONENTE
========================================================= */

export default function MonitoringDetails() {

  const { regiao } = useParams();

  const nomeRegiao =
    regiao
      ? regioes[regiao]
      : undefined;

  const mapaRegiao =
    regiao
      ? mapasRegioes[regiao]
      : mapaSerra;


  /* =======================================================
     STATES
  ======================================================= */

  const [leiturasRegiao, setLeiturasRegiao] =
    useState<LeituraSensor[]>([]);

  const [predicoes, setPredicoes] =
    useState<PredicaoRisco[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [ultimaAtualizacao, setUltimaAtualizacao] =
    useState<Date | null>(null);


  /* =======================================================
     CARREGAR DADOS
  ======================================================= */

  useEffect(() => {

    let ativo = true;


    const carregarDados = async () => {

      try {

        if (!nomeRegiao) {
          return;
        }

        const [
          leituras,
          predicoesRecebidas
        ] = await Promise.all([
          listarLeituras(),
          listarPredicoes()
        ]);


        if (!ativo) {
          return;
        }


        /* ===============================================
           FILTRA LEITURAS DA REGIÃO
        =============================================== */

        const leiturasDaRegiao =
          leituras.filter(
            leitura =>
              leitura.regiao === nomeRegiao
          );


        /* ===============================================
           ÚLTIMA LEITURA DE CADA ARDUINO
        =============================================== */

        const ultimasLeituras =
          Object.values(

            leiturasDaRegiao.reduce<
              Record<string, LeituraSensor>
            >(
              (sensores, leitura) => {

                const atual =
                  sensores[leitura.sensorId];


                if (!atual) {

                  sensores[leitura.sensorId] =
                    leitura;

                  return sensores;

                }


                const dataAtual =
                  atual.dataHora
                    ? new Date(
                        atual.dataHora
                      ).getTime()
                    : 0;


                const dataNova =
                  leitura.dataHora
                    ? new Date(
                        leitura.dataHora
                      ).getTime()
                    : 0;


                if (
                  dataNova > dataAtual
                ) {

                  sensores[leitura.sensorId] =
                    leitura;

                }


                return sensores;

              },
              {}
            )

          );


        setLeiturasRegiao(
          ultimasLeituras
        );

        setPredicoes(
          predicoesRecebidas
        );

        setUltimaAtualizacao(
          new Date()
        );

        setErro(null);


      } catch (error) {

        console.error(
          'Erro ao carregar monitoramento detalhado:',
          error
        );


        if (ativo) {

          setErro(
            'Não foi possível atualizar os dados dos sensores.'
          );

        }


      } finally {

        if (ativo) {
          setCarregando(false);
        }

      }

    };


    setCarregando(true);
    carregarDados();


    /*
      Atualização automática a cada 10 segundos,
      igual ao mapa geral.
    */

    const intervalo =
      setInterval(
        carregarDados,
        10000
      );


    return () => {

      ativo = false;

      clearInterval(
        intervalo
      );

    };


  }, [nomeRegiao]);


  /* =======================================================
     ÚLTIMA PREDIÇÃO DE CADA ARDUINO
  ======================================================= */

  const ultimasPredicoesPorSensor =
    useMemo(() => {

      const ultimas:
        Record<string, PredicaoRisco> = {};


      predicoes.forEach(
        (predicao) => {

          const atual =
            ultimas[predicao.sensorId];


          if (!atual) {

            ultimas[predicao.sensorId] =
              predicao;

            return;

          }


          const dataAtual =
            atual.dataHora
              ? new Date(
                  atual.dataHora
                ).getTime()
              : 0;


          const dataNova =
            predicao.dataHora
              ? new Date(
                  predicao.dataHora
                ).getTime()
              : 0;


          if (
            dataNova > dataAtual
          ) {

            ultimas[predicao.sensorId] =
              predicao;

          }

        }
      );


      return ultimas;

    }, [predicoes]);


  /* =======================================================
     JUNTA LEITURA + RISCO
  ======================================================= */

  const sensoresDetalhados:
    SensorDetalhado[] =
    useMemo(() => {

      return leiturasRegiao.map(
        (leitura) => {

          const predicao =
            ultimasPredicoesPorSensor[
              leitura.sensorId
            ];


          return {

            leitura,

            risco:
              predicao
                ? predicao.risco
                : null

          };

        }
      );

    }, [
      leiturasRegiao,
      ultimasPredicoesPorSensor
    ]);


  /* =======================================================
     KPIs DA REGIÃO
  ======================================================= */

  const temperaturaMedia =
    useMemo(() => {

      return calcularMedia(
        sensoresDetalhados.map(
          sensor =>
            sensor.leitura.temperatura
        )
      );

    }, [sensoresDetalhados]);


  const umidadeMedia =
    useMemo(() => {

      return calcularMedia(
        sensoresDetalhados.map(
          sensor =>
            sensor.leitura.umidade
        )
      );

    }, [sensoresDetalhados]);


  const riscosDisponiveis =
    useMemo(() => {

      return sensoresDetalhados
        .filter(
          sensor =>
            sensor.risco !== null
        )
        .map(
          sensor =>
            sensor.risco as number
        );

    }, [sensoresDetalhados]);


  const riscoMedio =
    useMemo(() => {

      return calcularMedia(
        riscosDisponiveis
      );

    }, [riscosDisponiveis]);


  /* =======================================================
     POSIÇÃO
  ======================================================= */

  const obterPosicaoSensor = (
    sensorId: string,
    index: number
  ): PosicaoSensor => {

    if (
      posicoesSensores[sensorId]
    ) {

      return (
        posicoesSensores[sensorId]
      );

    }


    const posicoesPadrao:
      PosicaoSensor[] = [

        { x: '25%', y: '30%' },
        { x: '50%', y: '25%' },
        { x: '70%', y: '40%' },
        { x: '35%', y: '65%' },
        { x: '65%', y: '70%' }

      ];


    return (
      posicoesPadrao[
        index %
        posicoesPadrao.length
      ]
    );

  };


  /* =======================================================
     REGIÃO INVÁLIDA
  ======================================================= */

  if (!nomeRegiao) {

    return (

      <div className="dash-container">

        <main className="dash-main">

          <div className="dash-content">

            <div className="dash-panel">

              <h2>
                Região não encontrada
              </h2>

              <Link to="/monitoramento">
                ← Voltar ao monitoramento
              </Link>

            </div>

          </div>

        </main>

      </div>

    );

  }


  /* =======================================================
     PÁGINA
  ======================================================= */

  return (

    <div className="dash-container">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

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

          <h2>
            FireWatch
          </h2>

        </div>


        <nav className="dash-nav">

          <Link
            to="/monitoramento"
            className="dash-nav-item"
          >
            📡 Monitoramento
          </Link>

          <Link
            to="/monitoramento/redes-sensores"
            className="dash-nav-item active"
          >
            🌡️ Rede de Sensores
          </Link>

        </nav>


        <div className="details-sidebar-footer">

          <Link
            to="/monitoramento"
            className="details-back-link"
          >
            ← Voltar ao mapa geral
          </Link>

        </div>

      </aside>


      {/* ===================================================
          PRINCIPAL
      =================================================== */}

      <main className="dash-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dash-header">

          <div>

            <strong>
              {nomeRegiao}
            </strong>

            <div className="details-header-subtitle">
              Monitoramento detalhado da região
            </div>

          </div>


          <div className="details-header-status">

            <span className="details-online-dot" />

            {sensoresDetalhados.length}/5 sensores
            com dados

          </div>

        </header>


        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <div className="dash-content">


          {erro && (

            <div className="details-error">
              {erro}
            </div>

          )}


          {/* =================================================
              TÍTULO
          ================================================= */}

          <div className="dash-panel details-title-panel">

            <div className="dash-panel-header details-title-header">

              <div>

                <h2>
                  {nomeRegiao}
                </h2>

                <span className="details-subtitle">
                  Visualização individual dos sensores e
                  do risco predito pela IA
                </span>

              </div>


              <div className="details-title-actions">

                {ultimaAtualizacao && (

                  <span className="details-update-time">
                    Atualizado às{' '}
                    {ultimaAtualizacao.toLocaleTimeString(
                      'pt-BR'
                    )}
                  </span>

                )}


                <Link
                  to="/monitoramento"
                  className="details-return-button"
                >
                  ← Mapa geral
                </Link>

              </div>

            </div>

          </div>


          {/* =================================================
              KPIs
          ================================================= */}

          <div className="details-kpi-grid">


            <div className="details-kpi-card">

              <span className="details-kpi-title">
                Temperatura Média
              </span>

              <strong className="details-kpi-value">

                {temperaturaMedia !== null
                  ? `${temperaturaMedia.toFixed(1)}°C`
                  : '--'}

              </strong>

              <span className="details-kpi-description">
                Média dos sensores da região
              </span>

            </div>


            <div className="details-kpi-card">

              <span className="details-kpi-title">
                Umidade Média
              </span>

              <strong className="details-kpi-value">

                {umidadeMedia !== null
                  ? `${umidadeMedia.toFixed(1)}%`
                  : '--'}

              </strong>

              <span className="details-kpi-description">
                Média das últimas leituras
              </span>

            </div>


            <div className="details-kpi-card">

              <span className="details-kpi-title">
                Risco Médio
              </span>

              <strong
                className="details-kpi-value"
                style={{
                  color:
                    riscoMedio !== null
                      ? obterCorRisco(
                          riscoMedio
                        )
                      : '#a1a1aa'
                }}
              >

                {riscoMedio !== null
                  ? `${(
                      normalizarRisco(
                        riscoMedio
                      ) * 100
                    ).toFixed(1)}%`
                  : '--'}

              </strong>

              <span className="details-kpi-description">
                Média das predições individuais
              </span>

            </div>


            <div className="details-kpi-card">

              <span className="details-kpi-title">
                Sensores com Dados
              </span>

              <strong className="details-kpi-value">

                {sensoresDetalhados.length}/5

              </strong>

              <span className="details-kpi-description">
                Últimas leituras disponíveis
              </span>

            </div>


          </div>


          {/* =================================================
              CARREGAMENTO
          ================================================= */}

          {carregando && (

            <div className="dash-panel">

              <div className="details-loading">
                Carregando dados dos sensores...
              </div>

            </div>

          )}


          {/* =================================================
              MAPA + SCOUTS
          ================================================= */}

          {!carregando && !erro && (

            <div className="details-main-grid">


              {/* =============================================
                  MAPA
              ============================================= */}

              <div className="dash-panel details-map-panel">

                <div className="dash-panel-header">

                  <div>

                    <h3>
                      Mapa de Risco por Sensor
                    </h3>

                    <span className="details-subtitle">
                      Cada halo representa a predição
                      individual do Arduino
                    </span>

                  </div>


                  <div className="details-live">

                    <span />

                    Tempo real

                  </div>

                </div>


                <div
                  className="details-map-canvas"
                  style={{
                    backgroundImage:
                      `linear-gradient(
                        rgba(9, 9, 11, 0.50),
                        rgba(9, 9, 11, 0.50)
                      ),
                      url(${mapaRegiao})`
                  }}
                >


                  {/* =========================================
                      SENSORES
                  ========================================= */}

                  {sensoresDetalhados.map(
                    (sensor, index) => {

                      const leitura =
                        sensor.leitura;

                      const posicao =
                        obterPosicaoSensor(
                          leitura.sensorId,
                          index
                        );


                      const possuiRisco =
                        sensor.risco !== null;


                      const risco =
                        normalizarRisco(
                          sensor.risco ?? 0
                        );


                      const cor =
                        obterCorRisco(
                          risco
                        );


                      const tamanhoHalo =
                        obterTamanhoHalo(
                          risco
                        );


                      const opacidade =
                        obterOpacidadeHalo(
                          risco
                        );


                      return (

                        <div
                          key={leitura.sensorId}
                          className="details-sensor-marker"
                          style={{
                            left: posicao.x,
                            top: posicao.y
                          }}
                        >


                          {/* HALO */}

                          {possuiRisco && (

                            <div
                              className="details-sensor-heat"
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


                          {/* PONTO */}

                          <div
                            className="details-sensor-dot"
                            style={{
                              backgroundColor:
                                possuiRisco
                                  ? cor
                                  : '#71717a',

                              boxShadow:
                                possuiRisco
                                  ? `0 0 16px ${cor}`
                                  : '0 0 8px #71717a'
                            }}
                          />


                          {/* CARD */}

                          <div className="details-sensor-popup">

                            <div className="details-popup-header">

                              <strong>
                                {leitura.sensorId}
                              </strong>

                              <span
                                style={{
                                  color:
                                    possuiRisco
                                      ? cor
                                      : '#a1a1aa'
                                }}
                              >

                                {possuiRisco
                                  ? `${(
                                      risco * 100
                                    ).toFixed(1)}%`
                                  : '--'}

                              </span>

                            </div>


                            <div className="details-popup-metrics">

                              <span>
                                🌡️ {leitura.temperatura.toFixed(1)}°C
                              </span>

                              <span>
                                💧 {leitura.umidade.toFixed(1)}%
                              </span>

                            </div>


                            <div className="details-popup-time">

                              {formatarData(
                                leitura.dataHora
                              )}

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}


                  {/* SEM SENSOR */}

                  {sensoresDetalhados.length === 0 && (

                    <div className="details-no-sensors">
                      Nenhum sensor encontrado nesta região.
                    </div>

                  )}


                  {/* LEGENDA */}

                  <div className="details-map-legend">

                    <strong>
                      Risco de incêndio
                    </strong>

                    <div className="details-risk-gradient" />

                    <div className="details-risk-scale">

                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>

                    </div>


                    <div className="details-risk-text">

                      <span>Baixo</span>
                      <span>Moderado</span>
                      <span>Crítico</span>

                    </div>

                  </div>


                </div>

              </div>


              {/* =============================================
                  SCOUTS / RESUMO
              ============================================= */}

              <div className="dash-panel details-scout-panel">

                <div className="dash-panel-header">

                  <div>

                    <h3>
                      Sensores
                    </h3>

                    <span className="details-subtitle">
                      Último estado registrado
                    </span>

                  </div>

                </div>


                <div className="details-sensor-list">

                  {sensoresDetalhados.map(
                    (sensor) => {

                      const leitura =
                        sensor.leitura;

                      const possuiRisco =
                        sensor.risco !== null;

                      const risco =
                        normalizarRisco(
                          sensor.risco ?? 0
                        );

                      const cor =
                        obterCorRisco(
                          risco
                        );


                      return (

                        <div
                          key={leitura.sensorId}
                          className="details-scout-card"
                        >

                          <div className="details-scout-header">

                            <div>

                              <span
                                className="details-scout-dot"
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
                                {leitura.sensorId}
                              </strong>

                            </div>


                            <strong
                              className="details-scout-risk"
                              style={{
                                color:
                                  possuiRisco
                                    ? cor
                                    : '#a1a1aa'
                              }}
                            >

                              {possuiRisco
                                ? `${(
                                    risco * 100
                                  ).toFixed(1)}%`
                                : '--'}

                            </strong>

                          </div>


                          <div className="details-scout-metrics">

                            <div>

                              <span>
                                Temperatura
                              </span>

                              <strong>
                                {leitura.temperatura.toFixed(1)}°C
                              </strong>

                            </div>


                            <div>

                              <span>
                                Umidade
                              </span>

                              <strong>
                                {leitura.umidade.toFixed(1)}%
                              </strong>

                            </div>

                          </div>


                          <div className="details-scout-location">

                            <span>
                              Lat. {leitura.latitude.toFixed(6)}
                            </span>

                            <span>
                              Long. {leitura.longitude.toFixed(6)}
                            </span>

                          </div>


                          <div className="details-scout-date">

                            Última leitura:{' '}
                            {formatarData(
                              leitura.dataHora
                            )}

                          </div>

                        </div>

                      );

                    }
                  )}


                  {sensoresDetalhados.length === 0 && (

                    <div className="details-empty-list">
                      Nenhum sensor disponível.
                    </div>

                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>

  );

}
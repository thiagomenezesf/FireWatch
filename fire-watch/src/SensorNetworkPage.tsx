import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom';

import './styles/MonitoringPage.css';

import {
  listarLeituras,
  listarPredicoes,
  type LeituraSensor,
  type PredicaoRisco
} from './services/api';


/* =========================================================
   INTERFACES
========================================================= */

interface RegiaoConfig {
  id: number;
  nome: string;
  slug: string;
}

interface RegiaoResumo extends RegiaoConfig {
  sensoresAtivos: number;
  temperaturaMedia: number | null;
  umidadeMedia: number | null;
  riscoMedio: number | null;
}


/* =========================================================
   REGIÕES MONITORADAS
========================================================= */

const regioes: RegiaoConfig[] = [

  {
    id: 1,
    nome: 'Mirante Serra da Paulista',
    slug: 'mirante-serra-da-paulista'
  },

  {
    id: 2,
    nome: 'Região Pedra Balão',
    slug: 'regiao-pedra-balao'
  },

  {
    id: 3,
    nome: 'Pesqueiro Bambu Amarelo',
    slug: 'pesqueiro-bambu-amarelo'
  },

  {
    id: 4,
    nome: 'Capelinha Nossa Senhora',
    slug: 'capelinha-nossa-senhora'
  },

  {
    id: 5,
    nome: 'Vinicola Lanchellotti',
    slug: 'vinicola-lanchellotti'
  },

  {
    id: 6,
    nome: 'Cruz Cruzeiro do Sul',
    slug: 'cruz-cruzeiro-do-sul'
  }

];


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function calcularMedia(
  valores: number[]
): number | null {

  if (valores.length === 0) {
    return null;
  }

  const soma = valores.reduce(
    (total, valor) =>
      total + valor,
    0
  );

  return soma / valores.length;
}


function normalizarRisco(
  risco: number
): number {

  return Math.max(
    0,
    Math.min(1, risco)
  );

}


/*
  Mesmo gradiente contínuo usado no heatmap.

  0%   -> verde
  50%  -> amarelo
  75%  -> laranja
  100% -> vermelho
*/

function obterCorRisco(
  risco: number
): string {

  const riscoNormalizado =
    normalizarRisco(risco);

  const hue =
    120 * (1 - riscoNormalizado);

  return `hsl(${hue}, 90%, 50%)`;

}


/* =========================================================
   COMPONENTE
========================================================= */

export default function SensorNetworkPage() {

  const navigate =
    useNavigate();


  /* =======================================================
     STATES
  ======================================================= */

  const [time, setTime] =
    useState(new Date());

  const [leituras, setLeituras] =
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
     RELÓGIO
  ======================================================= */

  useEffect(() => {

    const timer =
      setInterval(
        () => setTime(new Date()),
        1000
      );


    return () =>
      clearInterval(timer);

  }, []);


  /* =======================================================
     BUSCAR API
  ======================================================= */

  useEffect(() => {

    let ativo = true;


    const carregarDados =
      async () => {

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


          setLeituras(
            leiturasRecebidas
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
            'Erro ao carregar rede de sensores:',
            error
          );


          if (ativo) {

            setErro(
              'Não foi possível carregar os dados da rede.'
            );

          }


        } finally {

          if (ativo) {
            setCarregando(false);
          }

        }

      };


    carregarDados();


    /*
      Atualiza automaticamente a cada
      10 segundos.
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

  }, []);


  /* =======================================================
     ÚLTIMA LEITURA DE CADA ARDUINO
  ======================================================= */

  const ultimasLeituras =
    useMemo(() => {

      const resultado:
        Record<string, LeituraSensor> = {};


      leituras.forEach(
        leitura => {

          const atual =
            resultado[
              leitura.sensorId
            ];


          if (!atual) {

            resultado[
              leitura.sensorId
            ] = leitura;

            return;

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

            resultado[
              leitura.sensorId
            ] = leitura;

          }

        }
      );


      return resultado;

    }, [leituras]);


  /* =======================================================
     ÚLTIMA PREDIÇÃO DE CADA ARDUINO
  ======================================================= */

  const ultimasPredicoes =
    useMemo(() => {

      const resultado:
        Record<string, PredicaoRisco> = {};


      predicoes.forEach(
        predicao => {

          const atual =
            resultado[
              predicao.sensorId
            ];


          if (!atual) {

            resultado[
              predicao.sensorId
            ] = predicao;

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

            resultado[
              predicao.sensorId
            ] = predicao;

          }

        }
      );


      return resultado;

    }, [predicoes]);


  /* =======================================================
     RESUMO DAS 6 REGIÕES
  ======================================================= */

  const resumoRegioes:
    RegiaoResumo[] =
    useMemo(() => {

      return regioes.map(
        regiao => {

          /*
            Últimas leituras dos Arduinos
            pertencentes a esta região.
          */

          const sensoresRegiao =
            Object.values(
              ultimasLeituras
            ).filter(
              leitura =>
                leitura.regiao ===
                regiao.nome
            );


          /* =============================
             TEMPERATURA
          ============================= */

          const temperaturas =
            sensoresRegiao.map(
              sensor =>
                sensor.temperatura
            );


          const temperaturaMedia =
            calcularMedia(
              temperaturas
            );


          /* =============================
             UMIDADE
          ============================= */

          const umidades =
            sensoresRegiao.map(
              sensor =>
                sensor.umidade
            );


          const umidadeMedia =
            calcularMedia(
              umidades
            );


          /* =============================
             RISCO

             Busca a última predição
             de cada Arduino da região.
          ============================= */

          const riscos =
            sensoresRegiao
              .map(
                sensor => {

                  const predicao =
                    ultimasPredicoes[
                      sensor.sensorId
                    ];

                  return predicao
                    ? predicao.risco
                    : null;

                }
              )
              .filter(
                (
                  risco
                ): risco is number =>
                  risco !== null
              );


          const riscoMedio =
            calcularMedia(
              riscos
            );


          return {

            ...regiao,

            sensoresAtivos:
              sensoresRegiao.length,

            temperaturaMedia,

            umidadeMedia,

            riscoMedio

          };

        }
      );

    }, [
      ultimasLeituras,
      ultimasPredicoes
    ]);


  /* =======================================================
     KPIs GERAIS
  ======================================================= */

  const totalSensores =
    Object.keys(
      ultimasLeituras
    ).length;


  const temperaturaGeral =
    calcularMedia(

      Object.values(
        ultimasLeituras
      ).map(
        leitura =>
          leitura.temperatura
      )

    );


  const umidadeGeral =
    calcularMedia(

      Object.values(
        ultimasLeituras
      ).map(
        leitura =>
          leitura.umidade
      )

    );


  const regioesComRisco =
    resumoRegioes.filter(
      regiao =>
        regiao.riscoMedio !== null
    ).length;


  /* =======================================================
     JSX
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


          <NavLink
            to="/monitoramento/redes-sensores"
            className={
              ({ isActive }) =>
                `dash-nav-item ${
                  isActive
                    ? 'active'
                    : ''
                }`
            }
          >
            🌡️ Rede de Sensores
          </NavLink>

        </nav>


        <div
          style={{
            padding: '24px'
          }}
        >

          <Link
            to="/monitoramento"
            style={{
              color: '#a1a1aa',
              fontSize: '12px',
              textDecoration: 'none'
            }}
          >
            ← Voltar ao monitoramento
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

          <div className="status-badge">

            <div className="status-dot" />

            Online • São João da Boa Vista, SP •{' '}
            {time.toLocaleTimeString(
              'pt-BR'
            )}

          </div>


          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '12px',
              color: '#a1a1aa',
              fontWeight: '500'
            }}
          >

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >

              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}
              />

              API Meteo: ON

            </span>


            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >

              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}
              />

              Rede IoT: ON

            </span>

          </div>

        </header>


        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <div
          className="
            dash-content
            sensor-network-layout
          "
        >


          {/* =================================================
              ERRO
          ================================================= */}

          {erro && (

            <div
              style={{
                padding: '12px 16px',
                border:
                  '1px solid rgba(239,68,68,0.3)',
                background:
                  'rgba(239,68,68,0.08)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '13px'
              }}
            >

              {erro}

            </div>

          )}


          {/* =================================================
              KPIs
          ================================================= */}

          <div
            className="
              kpi-grid
              sensor-network-summary
            "
          >


            <div className="kpi-card">

              <h3>
                Dispositivos ativos
              </h3>

              <div className="kpi-value">
                {totalSensores}/30
              </div>

              <div className="kpi-trend trend-neutral">
                Última leitura de cada Arduino
              </div>

            </div>


            <div className="kpi-card">

              <h3>
                Temp. média
              </h3>

              <div className="kpi-value">

                {temperaturaGeral !== null
                  ? `${temperaturaGeral.toFixed(1)}°C`
                  : '--'}

              </div>

              <div className="kpi-trend trend-neutral">
                Média da rede
              </div>

            </div>


            <div className="kpi-card">

              <h3>
                Umidade média
              </h3>

              <div className="kpi-value">

                {umidadeGeral !== null
                  ? `${umidadeGeral.toFixed(1)}%`
                  : '--'}

              </div>

              <div className="kpi-trend trend-neutral">
                Média da rede
              </div>

            </div>


            <div className="kpi-card">

              <h3>
                Regiões monitoradas
              </h3>

              <div className="kpi-value">
                {regioesComRisco}/6
              </div>

              <div className="kpi-trend trend-neutral">
                Com predição disponível
              </div>

            </div>


          </div>


          {/* =================================================
              PAINEL DAS REGIÕES
          ================================================= */}

          <div className="dash-panel sensor-panel">


            <div
              className="
                dash-panel-header
                sensor-panel-header
              "
            >

              <div>

                <h3>
                  Rede de Sensores
                </h3>

                <span>
                  6 regiões monitoradas • 5 sensores por região
                </span>

              </div>


              {ultimaAtualizacao && (

                <span
                  style={{
                    fontSize: '10px',
                    color: '#71717a'
                  }}
                >

                  Atualizado às{' '}
                  {ultimaAtualizacao
                    .toLocaleTimeString(
                      'pt-BR'
                    )}

                </span>

              )}

            </div>


            {/* =================================================
                6 CARDS
            ================================================= */}

            <div className="sensor-card-grid">


              {resumoRegioes.map(
                regiao => {

                  const possuiRisco =
                    regiao.riscoMedio !== null;


                  const risco =
                    normalizarRisco(
                      regiao.riscoMedio ?? 0
                    );


                  const corRisco =
                    possuiRisco
                      ? obterCorRisco(risco)
                      : '#71717a';


                  return (

                    <article
                      key={regiao.id}
                      className="sensor-card"
                      onClick={() =>
                        navigate(
                          `/monitoramento/regiao/${regiao.slug}`
                        )
                      }
                      style={{
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition:
                          'transform 0.2s ease, border-color 0.2s ease'
                      }}
                    >


                      {/* LINHA SUPERIOR COLORIDA */}

                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor:
                            corRisco
                        }}
                      />


                      {/* CABEÇALHO */}

                      <div className="sensor-card-header">

                        <div>

                          <span className="sensor-card-id">

                            REGIÃO {regiao.id
                              .toString()
                              .padStart(2, '0')}

                          </span>


                          <h3>
                            {regiao.nome}
                          </h3>

                        </div>


                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '3px'
                          }}
                        >

                          <span
                            style={{
                              color:
                                corRisco,
                              fontSize: '20px',
                              fontWeight: '700'
                            }}
                          >

                            {possuiRisco
                              ? `${(
                                  risco * 100
                                ).toFixed(1)}%`
                              : '--'}

                          </span>


                          <span
                            style={{
                              color: '#71717a',
                              fontSize: '9px'
                            }}
                          >
                            risco médio
                          </span>

                        </div>

                      </div>


                      {/* MÉTRICAS */}

                      <div className="sensor-metrics">

                        <div>

                          <span>
                            Temperatura
                          </span>

                          <strong>

                            {regiao.temperaturaMedia !== null
                              ? `${regiao.temperaturaMedia.toFixed(1)}°C`
                              : '--'}

                          </strong>

                        </div>


                        <div>

                          <span>
                            Umidade
                          </span>

                          <strong>

                            {regiao.umidadeMedia !== null
                              ? `${regiao.umidadeMedia.toFixed(1)}%`
                              : '--'}

                          </strong>

                        </div>


                        <div>

                          <span>
                            Sensores
                          </span>

                          <strong>
                            {regiao.sensoresAtivos}/5
                          </strong>

                        </div>

                      </div>


                      {/* BARRA DE RISCO */}

                      <div
                        style={{
                          marginTop: '16px'
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            marginBottom: '5px',
                            fontSize: '9px',
                            color: '#71717a'
                          }}
                        >

                          <span>
                            Índice de risco
                          </span>

                          <span>
                            {possuiRisco
                              ? `${(
                                  risco * 100
                                ).toFixed(1)}%`
                              : 'Sem predição'}
                          </span>

                        </div>


                        <div
                          style={{
                            width: '100%',
                            height: '5px',
                            borderRadius: '999px',
                            backgroundColor:
                              '#27272a',
                            overflow: 'hidden'
                          }}
                        >

                          <div
                            style={{
                              width:
                                possuiRisco
                                  ? `${risco * 100}%`
                                  : '0%',

                              height: '100%',

                              borderRadius:
                                '999px',

                              backgroundColor:
                                corRisco,

                              transition:
                                'width 0.6s ease, background-color 0.6s ease'
                            }}
                          />

                        </div>

                      </div>


                      {/* LINK VISUAL */}

                      <div
                        style={{
                          marginTop: '14px',
                          paddingTop: '12px',
                          borderTop:
                            '1px solid #27272a',
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center'
                        }}
                      >

                        <span
                          style={{
                            color: '#71717a',
                            fontSize: '9px'
                          }}
                        >
                          Visualizar sensores individuais
                        </span>


                        <span
                          style={{
                            color: '#f97316',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        >
                          Abrir heatmap →
                        </span>

                      </div>


                    </article>

                  );

                }
              )}


            </div>


            {/* CARREGANDO */}

            {carregando && (

              <div
                style={{
                  padding: '20px',
                  color: '#a1a1aa',
                  textAlign: 'center',
                  fontSize: '12px'
                }}
              >

                Atualizando dados da rede...

              </div>

            )}


          </div>

        </div>

      </main>

    </div>

  );

}
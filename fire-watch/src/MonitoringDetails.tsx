import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import './styles/MonitoringPage.css';
import mapaSerra from './assets/mapa-serra.png';
import mapaMirante from './assets/mapa-mirante.jpeg';
import mapaPedraBalao from './assets/mapa-pedra-balao.jpeg';
import mapaBambuAmarelo from './assets/mapa-pesqueiro.jpeg';
import mapaCapelinha from './assets/mapa-capela.jpeg';
import mapaVinicola from './assets/mapa-vinicola.jpeg';
import mapaCruzeiro from './assets/mapa-cruzeiro-sul.jpeg';

import {
  listarLeituras,
  type LeituraSensor
} from './services/api';


/* =========================================================
   INTERFACES
========================================================= */

interface PosicaoSensor {
  x: string;
  y: string;
}


/* =========================================================
   REGIÕES
========================================================= */

const regioes: Record<string, string> = {
  'mirante-serra-da-paulista': 'Mirante Serra da Paulista',
  'regiao-pedra-balao': 'Região Pedra Balão',
  'pesqueiro-bambu-amarelo': 'Pesqueiro Bambu Amarelo',
  'capelinha-nossa-senhora': 'Capelinha Nossa Senhora',
  'vinicola-lanchellotti': 'Vinicola Lanchellotti',
  'cruz-cruzeiro-do-sul': 'Cruz Cruzeiro do Sul'
};

const mapasRegioes: Record<string, string> = {
  'mirante-serra-da-paulista': mapaMirante,
  'regiao-pedra-balao': mapaPedraBalao,
  'pesqueiro-bambu-amarelo': mapaBambuAmarelo,
  'capelinha-nossa-senhora': mapaCapelinha,
  'vinicola-lanchellotti': mapaVinicola,
  'cruz-cruzeiro-do-sul': mapaCruzeiro
};


/* =========================================================
   POSIÇÕES VISUAIS DOS SENSORES

   Essas posições NÃO representam latitude/longitude.
   Elas servem apenas para posicionar manualmente cada
   sensor dentro da imagem do mapa.

   Basta alterar x e y para mover os pontos.
========================================================= */

const posicoesSensores: Record<string, PosicaoSensor> = {

  /* =====================================================
     MIRANTE SERRA DA PAULISTA
     Arduino_01 até Arduino_05
  ===================================================== */

  Arduino_01: { x: '22%', y: '25%' },
  Arduino_02: { x: '48%', y: '20%' },
  Arduino_03: { x: '73%', y: '32%' },
  Arduino_04: { x: '35%', y: '62%' },
  Arduino_05: { x: '67%', y: '70%' },


  /* =====================================================
     REGIÃO PEDRA BALÃO
     Arduino_06 até Arduino_10
  ===================================================== */

  Arduino_06: { x: '27%', y: '30%' },
  Arduino_07: { x: '55%', y: '23%' },
  Arduino_08: { x: '76%', y: '48%' },
  Arduino_09: { x: '38%', y: '68%' },
  Arduino_10: { x: '62%', y: '76%' },


  /* =====================================================
     PESQUEIRO BAMBU AMARELO
     Arduino_11 até Arduino_15
  ===================================================== */

  Arduino_11: { x: '20%', y: '42%' },
  Arduino_12: { x: '43%', y: '24%' },
  Arduino_13: { x: '71%', y: '28%' },
  Arduino_14: { x: '52%', y: '58%' },
  Arduino_15: { x: '76%', y: '72%' },


  /* =====================================================
     CAPELINHA NOSSA SENHORA
     Arduino_16 até Arduino_20
  ===================================================== */

  Arduino_16: { x: '25%', y: '22%' },
  Arduino_17: { x: '62%', y: '25%' },
  Arduino_18: { x: '78%', y: '52%' },
  Arduino_19: { x: '30%', y: '67%' },
  Arduino_20: { x: '57%', y: '74%' },


  /* =====================================================
     VINICOLA LANCHELLOTTI
     Arduino_21 até Arduino_25
  ===================================================== */

  Arduino_21: { x: '18%', y: '35%' },
  Arduino_22: { x: '45%', y: '19%' },
  Arduino_23: { x: '72%', y: '38%' },
  Arduino_24: { x: '39%', y: '61%' },
  Arduino_25: { x: '69%', y: '73%' },


  /* =====================================================
     CRUZ CRUZEIRO DO SUL
     Arduino_26 até Arduino_30
  ===================================================== */

  Arduino_26: { x: '24%', y: '28%' },
  Arduino_27: { x: '52%', y: '22%' },
  Arduino_28: { x: '75%', y: '44%' },
  Arduino_29: { x: '32%', y: '71%' },
  Arduino_30: { x: '61%', y: '65%' }

};


/* =========================================================
   COMPONENTE
========================================================= */

export default function MonitoringDetails() {

  const { regiao } = useParams();

  const nomeRegiao = regiao ? regioes[regiao] : undefined;

  const mapaRegiao = regiao ? mapasRegioes[regiao] : mapaSerra;

  /* =======================================================
     STATES
  ======================================================= */

  const [leiturasRegiao, setLeiturasRegiao] =
    useState<LeituraSensor[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);


  /* =======================================================
     BUSCAR SENSORES DA REGIÃO
  ======================================================= */

  useEffect(() => {

    const carregarSensores = async () => {

      try {

        setCarregando(true);
        setErro(null);

        if (!nomeRegiao) {
          setErro('Região não encontrada.');
          return;
        }


        /* Busca todas as leituras */

        const leituras = await listarLeituras();


        /* Filtra apenas as leituras da região selecionada */

        const leiturasDaRegiao = leituras.filter(
          leitura =>
            leitura.regiao === nomeRegiao
        );


        /* =================================================
           PEGA SOMENTE A ÚLTIMA LEITURA DE CADA SENSOR
        ================================================= */

        const ultimasLeiturasPorSensor = Object.values(

          leiturasDaRegiao.reduce<
            Record<string, LeituraSensor>
          >(
            (sensores, leitura) => {

              const leituraAtual =
                sensores[leitura.sensorId];


              if (
                !leituraAtual ||
                new Date(
                  leitura.dataHora ?? 0
                ).getTime()
                >
                new Date(
                  leituraAtual.dataHora ?? 0
                ).getTime()
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
          ultimasLeiturasPorSensor
        );


        console.log(
          `Sensores de ${nomeRegiao}:`,
          ultimasLeiturasPorSensor
        );


      } catch (error) {

        console.error(
          'Erro ao carregar sensores da região:',
          error
        );

        setErro(
          'Não foi possível carregar os sensores.'
        );

      } finally {

        setCarregando(false);

      }

    };


    carregarSensores();


  }, [nomeRegiao]);


  /* =======================================================
     FUNÇÃO PARA POSIÇÃO DO SENSOR
  ======================================================= */

  const obterPosicaoSensor = (
    sensorId: string,
    index: number
  ): PosicaoSensor => {

    /*
      Se existir uma posição configurada manualmente
      para esse sensor, utiliza ela.
    */

    if (posicoesSensores[sensorId]) {

      return posicoesSensores[sensorId];

    }


    /*
      Caso apareça um sensor novo que ainda não tenha
      posição configurada, ele recebe uma posição
      provisória para não desaparecer do mapa.
    */

    const posicoesPadrao: PosicaoSensor[] = [

      { x: '25%', y: '30%' },
      { x: '50%', y: '25%' },
      { x: '70%', y: '40%' },
      { x: '35%', y: '65%' },
      { x: '65%', y: '70%' }

    ];


    return (
      posicoesPadrao[
        index % posicoesPadrao.length
      ]
    );

  };


  /* =======================================================
     REGIÃO INVÁLIDA
  ======================================================= */

  if (!nomeRegiao) {

    return (

      <div className="dash-container">

        <main
          className="dash-main"
          style={{
            marginLeft: 0
          }}
        >

          <div className="dash-content">

            <div className="dash-panel">

              <h2>
                Região não encontrada
              </h2>

              <Link to="/monitoramentoTeste">
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
          MENU LATERAL
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


        <div
          style={{
            padding: '24px'
          }}
        >

          <Link
            to="/monitoramentoTeste"
            style={{
              color: '#a1a1aa',
              fontSize: '12px',
              textDecoration: 'none'
            }}
          >
            ← Voltar ao mapa geral
          </Link>

        </div>

      </aside>


      {/* ===================================================
          CONTEÚDO PRINCIPAL
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

            <div
              style={{
                fontSize: '11px',
                color: '#a1a1aa',
                marginTop: '3px'
              }}
            >
              Monitoramento detalhado da região
            </div>

          </div>


          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#a1a1aa'
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

            Sensores conectados:
            {' '}
            {leiturasRegiao.length}

          </div>

        </header>


        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <div className="dash-content">


          {/* =================================================
              CABEÇALHO DA REGIÃO
          ================================================= */}

          <div
            className="dash-panel"
            style={{
              marginBottom: '20px'
            }}
          >

            <div className="dash-panel-header">

              <div>

                <h2
                  style={{
                    margin: 0
                  }}
                >
                  {nomeRegiao}
                </h2>

                <span
                  style={{
                    fontSize: '12px',
                    color: '#a1a1aa'
                  }}
                >
                  Visualização detalhada dos sensores ambientais
                </span>

              </div>


              <Link
                to="/monitoramento"
                style={{
                  textDecoration: 'none',
                  color: '#f97316',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                ← Voltar ao mapa geral
              </Link>

            </div>

          </div>


          {/* =================================================
              CARREGAMENTO
          ================================================= */}

          {carregando && (

            <div className="dash-panel">

              <p
                style={{
                  color: '#a1a1aa'
                }}
              >
                Carregando sensores...
              </p>

            </div>

          )}


          {/* =================================================
              ERRO
          ================================================= */}

          {erro && (

            <div className="dash-panel">

              <p
                style={{
                  color: '#ef4444'
                }}
              >
                {erro}
              </p>

            </div>

          )}


          {/* =================================================
              MAPA
          ================================================= */}

          {!carregando && !erro && (

            <div className="dash-panel">


              <div className="dash-panel-header">

                <div>

                  <h3
                    style={{
                      marginBottom: '4px'
                    }}
                  >
                    Sensores da região
                  </h3>

                  <span
                    style={{
                      fontSize: '12px',
                      color: '#a1a1aa'
                    }}
                  >
                    {leiturasRegiao.length}
                    {' '}
                    sensor(es) identificado(s)
                  </span>

                </div>

              </div>


              {/* =============================================
                  MAPA AMPLIADO
              ============================================= */}

              <div
                className="map-canvas"
                style={{

                  backgroundImage:
                    `linear-gradient(
                      rgba(9, 9, 11, 0.55),
                      rgba(9, 9, 11, 0.55)
                    ),
                    url(${mapaRegiao})`,

                  backgroundSize: 'cover',
                  backgroundPosition: 'center',

                  aspectRatio: '16 / 9',

                  position: 'relative',
                  overflow: 'hidden'

                }}
              >


                {/* ===========================================
                    SENSORES
                =========================================== */}

                {leiturasRegiao.map(
                  (sensor, index) => {

                    const posicao =
                      obterPosicaoSensor(
                        sensor.sensorId,
                        index
                      );


                    return (

                      <div
                        key={sensor.sensorId}
                        style={{
                          position: 'absolute',

                          left: posicao.x,
                          top: posicao.y,

                          transform:
                            'translate(-50%, -50%)',

                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',

                          zIndex: 10
                        }}
                      >


                        {/* ===================================
                            HALO / HEATMAP
                        =================================== */}

                        <div
                          style={{

                            position: 'absolute',

                            width: '110px',
                            height: '110px',

                            left: '50%',
                            top: '6px',

                            transform:
                              'translate(-50%, -50%)',

                            borderRadius: '50%',

                            background:
                              `radial-gradient(
                                circle,
                                rgba(249,115,22,0.45) 0%,
                                rgba(249,115,22,0.20) 40%,
                                transparent 72%
                              )`,

                            pointerEvents: 'none',

                            zIndex: 0

                          }}
                        />


                        {/* ===================================
                            BOLINHA DO SENSOR
                        =================================== */}

                        <div
                          style={{

                            width: '13px',
                            height: '13px',

                            borderRadius: '50%',

                            backgroundColor:
                              '#f97316',

                            boxShadow:
                              '0 0 15px #f97316',

                            zIndex: 2

                          }}
                        />


                        {/* ===================================
                            CARD DO SENSOR
                        =================================== */}

                        <div
                          style={{

                            marginTop: '7px',

                            backgroundColor:
                              'rgba(9,9,11,0.92)',

                            border:
                              '1px solid #3f3f46',

                            padding:
                              '8px 10px',

                            borderRadius:
                              '6px',

                            fontSize:
                              '10px',

                            color:
                              '#f4f4f5',

                            whiteSpace:
                              'nowrap',

                            zIndex: 3,

                            boxShadow:
                              '0 4px 15px rgba(0,0,0,0.35)'

                          }}
                        >


                          <div
                            style={{
                              fontWeight: '700',
                              marginBottom: '4px',
                              color: '#ffffff'
                            }}
                          >

                            {sensor.sensorId}

                          </div>


                          <div>

                            🌡️
                            {' '}
                            {sensor.temperatura}°C

                            {' | '}

                            💧
                            {' '}
                            {sensor.umidade}%

                          </div>


                          <div
                            style={{
                              marginTop: '4px',
                              color: '#a1a1aa'
                            }}
                          >

                            Lat:
                            {' '}
                            {sensor.latitude}

                          </div>


                          <div
                            style={{
                              color: '#a1a1aa'
                            }}
                          >

                            Long:
                            {' '}
                            {sensor.longitude}

                          </div>


                        </div>


                      </div>

                    );

                  }
                )}


                {/* ===========================================
                    SEM SENSORES
                =========================================== */}

                {leiturasRegiao.length === 0 && (

                  <div
                    style={{

                      position: 'absolute',

                      left: '50%',
                      top: '50%',

                      transform:
                        'translate(-50%, -50%)',

                      backgroundColor:
                        'rgba(9,9,11,0.9)',

                      border:
                        '1px solid #27272a',

                      borderRadius:
                        '8px',

                      padding:
                        '16px 24px',

                      color:
                        '#a1a1aa',

                      fontSize:
                        '13px'

                    }}
                  >

                    Nenhum sensor encontrado nesta região.

                  </div>

                )}


                {/* ===========================================
                    LEGENDA
                =========================================== */}

                <div
                  style={{

                    position: 'absolute',

                    bottom: '12px',
                    right: '12px',

                    backgroundColor:
                      'rgba(9,9,11,0.88)',

                    border:
                      '1px solid #27272a',

                    padding:
                      '8px 12px',

                    borderRadius:
                      '6px',

                    fontSize:
                      '10px',

                    color:
                      '#a1a1aa',

                    backdropFilter:
                      'blur(4px)',

                    zIndex: 20

                  }}
                >

                  <strong
                    style={{
                      color: '#f4f4f5'
                    }}
                  >
                    Sensores ambientais
                  </strong>

                  <div
                    style={{
                      marginTop: '4px'
                    }}
                  >
                    Última leitura recebida de cada sensor
                  </div>

                </div>


              </div>

            </div>

          )}

        </div>

      </main>

    </div>

  );

}
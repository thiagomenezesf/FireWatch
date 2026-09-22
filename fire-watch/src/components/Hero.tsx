import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="container hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Monitoramento ambiental inteligente
          </div>

          <h1>
            Tecnologia para agir
            <br />
            <span>antes que o fogo comece.</span>
          </h1>

          <p>
            O FireWatch utiliza dados climáticos, sensores IoT e inteligência
            artificial para identificar áreas com maior risco de incêndio na
            Serra da Paulista, em São João da Boa Vista. Além disso, os sensores agem como um sistema de alerta, enviando notificações em tempo real para os órgãos responsáveis, permitindo uma resposta rápida e eficaz sobre incêndios e queimadas que estão ocorrendo ou se iniciando.
          </p>

          <div className="hero-buttons">
            <a href="#solucao" className="primary-button">
              Conheça o projeto
              <span>↓</span>
            </a>

            <Link to="/monitoramento" className="secondary-button">
              Ver monitoramento
              <span>→</span>
            </Link>
          </div>

          <div className="hero-info">
            <div>
              <strong>Dados</strong>
              <span>em tempo real</span>
            </div>

            <div>
              <strong>IA</strong>
              <span>análise preditiva</span>
            </div>

            <div>
              <strong>IoT</strong>
              <span>sensores ambientais</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="radar-card">
            <div className="radar-header">
              <div>
                <span className="small-label">FIREWATCH / MONITORAMENTO</span>
                <h3>Serra da Paulista</h3>
              </div>

              <span className="status-online">
                <span></span>
                Online
              </span>
            </div>

            <div className="radar-map">
              <div className="map-grid"></div>

              <div className="heat heat-one"></div>
              <div className="heat heat-two"></div>
              <div className="heat heat-three"></div>

              <div className="sensor sensor-one">
                <span></span>
              </div>

              <div className="sensor sensor-two">
                <span></span>
              </div>

              <div className="sensor sensor-three">
                <span></span>
              </div>

              <div className="risk-label">
                <span>RISCO ELEVADO</span>
                <strong>Zona 03</strong>
              </div>
            </div>

            <div className="radar-stats">
              <div>
                <span>Temperatura</span>
                <strong>32°C</strong>
              </div>

              <div>
                <span>Umidade</span>
                <strong>28%</strong>
              </div>

              <div>
                <span>Vento</span>
                <strong>14 km/h</strong>
              </div>

              <div>
                <span>Risco</span>
                <strong className="danger-text">Alto</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

;
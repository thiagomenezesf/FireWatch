import { Link } from "react-router-dom";
import arduinoPrototype from "../assets/arduino-prototype.png";
import FireWatchLogo from "../assets/FireWatchLogo.png";

export default function DemoPreview() {
  return (
    <section className="section demo-section" id="demonstracao">
      <div className="container">
        <div className="demo-container">
          <div className="demo-text">
            <span className="section-tag">DEMONSTRAÇÃO</span>

            <h2>
              Veja o risco.
              <br />
              <span>Antes do incêndio.</span>
            </h2>

            <p>
              Explore a demonstração do FireWatch e visualize como dados
              climáticos e sensores podem ser transformados em informações
              para o monitoramento do risco de incêndios na Serra da Paulista.
            </p>

            <Link to="/monitoramento" className="primary-button">
              Acessar monitoramento
              <span>→</span>
            </Link>
          </div>

          <div className="demo-dashboard">
            <div className="dashboard-top">
              <div>
                <span className="dashboard-dot"></span>
                Monitoramento em tempo real
              </div>

              <span>FireWatch</span>
            </div>

            <div className="dashboard-map">
              <div className="map-grid"></div>

              <div className="demo-heat demo-heat-one"></div>
              <div className="demo-heat demo-heat-two"></div>
              <div className="demo-heat demo-heat-three"></div>

              <div className="map-point point-one"></div>
              <div className="map-point point-two"></div>
              <div className="map-point point-three"></div>
              <div className="map-point point-four"></div>

              <div className="map-legend">
                <span>Risco</span>

                <div className="legend-bar"></div>

                <div>
                  <small>Baixo</small>
                  <small>Crítico</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="prototype-section" id="prototipo">
          <div className="prototype-heading">
            <span className="section-tag">PROTÓTIPO DE COLETA</span>

            <h3>
              Do ambiente ao <span>FireWatch.</span>
            </h3>

            <p>
              O protótipo demonstra como informações coletadas em campo podem
              chegar à plataforma e contribuir para a análise das condições
              ambientais.
            </p>
          </div>

          <div className="prototype-content">
            <div className="prototype-image">
              <div className="prototype-image-top">
                <span>
                  <span className="status-dot"></span>
                  PROTÓTIPO
                </span>

                <span>Arduino + DHT22</span>
              </div>

              <img
                src={arduinoPrototype}
                alt="Protótipo virtual do Arduino conectado ao sensor DHT22"
              />
            </div>

            <div className="prototype-info">
              <span className="prototype-number">01 / COLETA DE DADOS</span>

              <h3>Arduino + sensor DHT22</h3>

              <p>
                Durante o desenvolvimento do protótipo, um Arduino conectado
                ao sensor DHT22 representa um ponto de coleta instalado na
                região monitorada. O sensor realiza medições periódicas de
                temperatura e umidade do ambiente.
              </p>

              <div className="sensor-readings">
                <div>
                  <span>Temperatura</span>
                  <strong>°C</strong>
                </div>

                <div>
                  <span>Umidade</span>
                  <strong>%</strong>
                </div>

                <div>
                  <span>Sensor</span>
                  <strong>DHT22</strong>
                </div>
              </div>

              <p className="prototype-note">
                No protótipo, os dados podem ser simulados antes da utilização
                do dispositivo físico, permitindo validar a comunicação com o
                restante da plataforma.
              </p>
            </div>
          </div>

          <div className="data-flow">
            <div className="flow-item">
              <span className="flow-number">01</span>
              <div>
                <strong>DHT22</strong>
                <small>Coleta</small>
              </div>
            </div>

            <span className="flow-arrow">→</span>

            <div className="flow-item">
              <span className="flow-number">02</span>
              <div>
                <strong>Arduino</strong>
                <small>Processa</small>
              </div>
            </div>

            <span className="flow-arrow">→</span>

            <div className="flow-item">
              <span className="flow-number">03</span>
              <div>
                <strong>API</strong>
                <small>Transmite</small>
              </div>
            </div>

            <span className="flow-arrow">→</span>

            <div className="flow-item">
              <span className="flow-number">04</span>
              <div>
                <strong>Banco</strong>
                <small>Armazena</small>
              </div>
            </div>

            <span className="flow-arrow">→</span>

            <div className="flow-item">
              <span className="flow-number">05</span>
              <div>
                <strong>FireWatch</strong>
                <small>Analisa</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Link } from "react-router-dom";

export default function DemoPreview() {
  return (
    <section className="section demo-section">
      <div className="container demo-container">
        <div className="demo-text">
          <span className="section-tag">DEMONSTRAÇÃO</span>

          <h2>
            Veja o risco.
            <br />
            <span>Antes do incêndio.</span>
          </h2>

          <p>
            Explore a demonstração do FireWatch e visualize como dados
            climáticos e sensores podem ser transformados em um mapa de risco
            da Serra da Paulista.
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
    </section>
  );
}
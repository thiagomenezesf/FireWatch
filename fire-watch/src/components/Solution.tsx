export default function Solution() {
  return (
    <section className="section solution-section" id="solucao">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-tag">SOLUÇÃO</span>

          <h2>
            Prevenção transformada
            <br />
            em <span>ação em tempo real.</span>
          </h2>

          <p>
            A principal finalidade do FireWatch é atuar como um radar ambiental preventivo para combater a deteção tardia. Para isso, a ferramenta computacional integra funcionalidades centrais:
          </p>
        </div>

        <div className="flow">
          <div className="flow-card">
            <div className="flow-icon">☁</div>
            <span>01</span>
            <h3>Dados climáticos</h3>
            <p>
              Temperatura, umidade, velocidade e direção do vento obtidos
              através de APIs meteorológicas.
            </p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-card">
            <div className="flow-icon">⌁</div>
            <span>02</span>
            <h3>Sensores IoT</h3>
            <p>
              Dados simulados representam sensores distribuídos em pontos
              estratégicos da região monitorada.
            </p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-card highlighted">
            <div className="flow-icon">✦</div>
            <span>03</span>
            <h3>Inteligência Artificial</h3>
            <p>
              Os dados são cruzados para identificar condições ambientais
              associadas a maior risco de ignição.
            </p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-card">
            <div className="flow-icon">◎</div>
            <span>04</span>
            <h3>Mapa de risco</h3>
            <p>
              O resultado é apresentado visualmente através de um mapa de calor
              interativo e alertas preventivos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
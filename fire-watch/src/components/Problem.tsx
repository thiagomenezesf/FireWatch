export default function Problem() {
  return (
    <section className="section problem-section" id="problema">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">O PROBLEMA</span>

          <h2>
            Quando o fogo é visto,
            <br />
            muitas vezes <span>já é tarde.</span>
          </h2>

          <p>
            A Serra da Paulista sofre com incêndios durante períodos de
            estiagem. A detecção tardia dificulta a resposta e amplia os danos
            ambientais.
          </p>
        </div>

        <div className="problem-grid">
          <article className="problem-card">
            <span className="card-number">01</span>
            <div className="card-icon">△</div>

            <h3>Detecção tardia</h3>

            <p>
              O combate muitas vezes começa após a identificação visual de
              fumaça ou fogo, quando o incêndio já pode ter se espalhado.
            </p>
          </article>

          <article className="problem-card featured">
            <span className="card-number">02</span>
            <div className="card-icon">♨</div>

            <h3>Períodos críticos</h3>

            <p>
              Baixa umidade, altas temperaturas e ventos durante a estiagem
              aumentam significativamente as condições favoráveis ao fogo.
            </p>
          </article>

          <article className="problem-card">
            <span className="card-number">03</span>
            <div className="card-icon">⌁</div>

            <h3>Impacto ambiental</h3>

            <p>
              As queimadas ameaçam a vegetação, a fauna local, a qualidade do
              ar e o equilíbrio ambiental da região.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
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
            A Serra da Paulista sofre com incêndios durante períodos de estiagem. 
            Apenas em 2020, um único evento chegou a consumir cerca de 500 hectares de vegetação no município. 
            A detecção tardia dificulta a resposta e amplia os danos ambientais.
          </p>
        </div>

        <div className="problem-grid">
          <article className="problem-card">
            <span className="card-number">01</span>
            <div className="card-icon">△</div>

            <h3>Detecção tardia</h3>

            <p>
              O combate depende quase exclusivamente de denúncias visuais feitas por moradores quando a fumaça sobe. Quando as equipes chegam, o incêndio já pode ter se espalhado.
            </p>
          </article>

          <article className="problem-card featured">
            <span className="card-number">02</span>
            <div className="card-icon">♨</div>

            <h3>Períodos críticos</h3>

            <p>
              Durante os meses de estiagem, a região concentra focos críticos de calor no estado de São Paulo, combinando baixa umidade, altas temperaturas e ventos fortes.
            </p>
          </article>

          <article className="problem-card">
            <span className="card-number">03</span>
            <div className="card-icon">⌁</div>

            <h3>Impacto ambiental</h3>

            <p>
              As queimadas ameaçam importantes remanescentes de Mata Atlântica e Cerrado, além de colocar em risco mais de 120 espécies de fauna nativa catalogadas.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
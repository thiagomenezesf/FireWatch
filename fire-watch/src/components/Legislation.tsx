const laws = [
  {
    level: "MUNICIPAL",
    number: "Lei nº 3.694/2014",
    location: "São João da Boa Vista",
    title: "Proibição de queimadas",
    description:
      "Proíbe práticas de queimada lesivas ao meio ambiente no município e estabelece penalidades para infrações.",
    link: "https://sapl.saojoaodaboavista.sp.leg.br/norma/7534",
  },
  {
    level: "ESTADUAL",
    number: "Lei nº 17.460/2021",
    location: "Estado de São Paulo",
    title: "Manejo Integrado do Fogo",
    description:
      "Institui a Política Estadual de Manejo Integrado do Fogo, buscando reduzir a incidência e os danos provocados por incêndios florestais.",
    link: "https://www.al.sp.gov.br/norma/?ano=2021&numero=17460&tipo=Lei",
  },
  {
    level: "FEDERAL",
    number: "Lei nº 14.944/2024",
    location: "Brasil",
    title: "Política Nacional",
    description:
      "Institui a Política Nacional de Manejo Integrado do Fogo, estabelecendo princípios para prevenção e enfrentamento de incêndios florestais.",
    link: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14944.htm",
  },
];

export default function Legislation() {
  return (
    <section className="section legislation-section" id="legislacao">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-tag">LEGISLAÇÃO E PREVENÇÃO</span>

          <h2>
            A prevenção também
            <br />
            está <span>prevista em lei.</span>
          </h2>

          <p>
            O combate às queimadas e aos incêndios florestais envolve ações
            previstas nas legislações municipal, estadual e federal, reforçando
            a importância de estratégias de prevenção e monitoramento ambiental.
          </p>
        </div>

        <div className="legislation-grid">
          {laws.map((law, index) => (
            <article className="law-card" key={law.number}>
              <div className="law-card-header">
                <span className="law-level">{law.level}</span>

                <span className="law-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="law-location">{law.location}</div>

              <h3>{law.number}</h3>

              <h4>{law.title}</h4>

              <p>{law.description}</p>

              <a
                href={law.link}
                target="_blank"
                rel="noopener noreferrer"
                className="law-link"
              >
                Consultar legislação
                <span>↗</span>
              </a>

              <div className="law-card-line"></div>
            </article>
          ))}
        </div>

        <div className="legislation-connection">
          <div className="connection-icon">
            <span>✦</span>
          </div>

          <div className="connection-content">
            <span className="connection-label">
              TECNOLOGIA COMO INSTRUMENTO DE PREVENÇÃO
            </span>

            <h3>Onde o FireWatch entra?</h3>

            <p>
              Ao transformar dados climáticos e ambientais em informações
              visuais de risco, o FireWatch busca oferecer suporte tecnológico
              à prevenção e ao monitoramento de incêndios. O projeto se alinha
              aos objetivos de redução de riscos e impactos ambientais
              presentes nas políticas de manejo integrado do fogo.
            </p>
          </div>

          <div className="connection-flow">
            <div>
              <span>01</span>
              <strong>Prevenir</strong>
            </div>

            <span className="connection-arrow">→</span>

            <div>
              <span>02</span>
              <strong>Monitorar</strong>
            </div>

            <span className="connection-arrow">→</span>

            <div>
              <span>03</span>
              <strong>Agir</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
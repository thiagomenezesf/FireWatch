const technologies = [
  {
    number: "01",
    title: "Aplicação Web",
    description:
      "Interface acessível por computador ou smartphone para centralizar o monitoramento.",
  },
  {
    number: "02",
    title: "APIs Meteorológicas",
    description:
      "Integração com serviços externos para obtenção de informações climáticas.",
  },
  {
    number: "03",
    title: "Internet das Coisas",
    description:
      "Simulação de uma rede de sensores ambientais posicionados ao longo da serra.",
  },
  {
    number: "04",
    title: "Machine Learning",
    description:
      "Modelos computacionais para análise das variáveis e identificação de padrões de risco.",
  },
  {
    number: "05",
    title: "Geoprocessamento",
    description:
      "Representação espacial das informações e geração das zonas de risco no mapa.",
  },
  {
    number: "06",
    title: "Heatmap",
    description:
      "Visualização intuitiva da intensidade do risco através de diferentes níveis de calor.",
  },
];

export default function Technologies() {
  return (
    <section className="section technologies-section" id="tecnologia">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">TECNOLOGIA</span>

          <h2>
            Diferentes tecnologias.
            <br />
            <span>Um único objetivo.</span>
          </h2>
        </div>

        <div className="technologies-grid">
          {technologies.map((technology) => (
            <article className="technology-card" key={technology.title}>
              <span className="technology-number">{technology.number}</span>

              <h3>{technology.title}</h3>

              <p>{technology.description}</p>

              <div className="technology-line"></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
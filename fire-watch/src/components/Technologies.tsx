const technologies = [
  {
    number: "01",
    title: "Internet das Coisas",
    description:
      "Simulação de uma rede de sensores ambientais posicionados ao longo da serra.",
  },
  {
    number: "02",
    title: "APIs Meteorológicas",
    description:
      "Integração com serviços externos para obtenção de informações climáticas.",
  },
  {
    number: "03",
    title: "Machine Learning",
    description:
      "Modelos computacionais para análise das variáveis e identificação de padrões de risco.",
  },
  {
    number: "04",
    title: "Geoprocessamento",
    description:
      "Representação espacial das informações e geração das zonas de risco no mapa.",
  },
  {
    number: "05",
    title: "Heatmap",
    description:
      "Visualização intuitiva da intensidade do risco através de diferentes níveis de calor.",
  },
  {
    number: "06",
    title: "Aplicação Web",
    description:
      "Interface acessível por computador ou smartphone para centralizar o monitoramento.",
  }
  
];

export default function Technologies() {
  return (
    <section className="section technologies-section" id="tecnologia">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">PROCESSO DE CONSTRUÇÃO</span>

          <h2>
            Arquitetura da <br />
            <span>ferramenta computacional.</span>
          </h2>
          
          <p style={{ marginTop: '16px', color: '#a1a1aa', maxWidth: '600px' }}>
            O desenvolvimento do FireWatch foi estruturado em diferentes camadas de software e hardware, integrando a captação física de dados com o processamento em nuvem.
          </p>
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
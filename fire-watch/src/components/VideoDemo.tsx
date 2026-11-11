export default function VideoDemo() {
  return (
    <section
      className="section video-demo-section"
      id="video-demonstracao"
    >
      <div className="container">
        <div className="video-demo-heading">
          <span className="section-tag">DEMONSTRAÇÃO EM VÍDEO</span>

          <h2>
            FireWatch em <span>funcionamento.</span>
          </h2>

          <p>
            Confira uma demonstração da plataforma em funcionamento,
            explorando o monitoramento das regiões, a visualização dos
            sensores e as informações utilizadas na análise do risco
            de incêndios.
          </p>
        </div>

        <div className="video-demo-container">
          <video
            controls
            playsInline
            preload="metadata"
            aria-label="Vídeo de demonstração do funcionamento do FireWatch"
          >
            <source
              src="/videos/firewatch-demo.mp4"
              type="video/mp4"
            />

            Seu navegador não suporta a reprodução deste vídeo.
          </video>
        </div>

        <p className="video-demo-caption">
          Demonstração prática das funcionalidades desenvolvidas no FireWatch.
        </p>
      </div>
    </section>
  );
}
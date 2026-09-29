export default function Test() {
  return (
    <section className="section" id="testes">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-tag">TESTES DO PROTÓTIPO</span>

          <h2>
            Como validar a
            <br />
            <span>detecção de risco.</span>
          </h2>

          <p>
            O protótipo pode ser testado em laboratório e em campo para confirmar
            se as medições de temperatura e umidade refletem com precisão as
            condições associadas a ignição e risco de incêndio.
          </p>
        </div>

        <div className="problem-grid">
          <article className="problem-card featured">
            <span className="card-number">01</span>
            <div className="card-icon">◎</div>

            <h3>Teste de laboratório</h3>

            <p>
              Simule diferentes combinações de calor e seca no Arduino conectado ao
              DHT22 para verificar se as leituras se mantêm estáveis e consistentes
              antes de aplicar na região monitorada.
            </p>
          </article>

          <article className="problem-card">
            <span className="card-number">02</span>
            <div className="card-icon">✦</div>

            <h3>Teste de campo</h3>

            <p>
              Instale o protótipo em pontos estratégicos da Serra da Paulista e compare
              a temperatura, a umidade e o comportamento climático com cenários reais
              de estiagem e vento.
            </p>
          </article>

          <article className="problem-card">
            <span className="card-number">03</span>
            <div className="card-icon">△</div>

            <h3>Validação de alerta</h3>

            <p>
              Confirme que o sistema reconhece padrões críticos, como temperatura elevada
              junto a baixa umidade, ativando alertas e reforçando a necessidade de
              resposta antecipada.
            </p>
          </article>
        </div>

        <div className="legislation-connection" style={{ marginTop: "40px" }}>
          <div className="connection-icon">✦</div>

          <div className="connection-content">
            <span className="connection-label">VALIDAÇÃO</span>
            <h3>Critérios esperados para o disparo</h3>
            <p>
              Em cenários de risco, o protótipo deve registrar temperatura elevada, umidade
              reduzida e tendência de continuidade do calor. Esses indicadores ajudam a validar
              se a coleta e a análise do FireWatch operam corretamente.
            </p>
          </div>

          <div className="connection-flow">
            <div>
              <span>01</span>
              <strong>Temperatura</strong>
            </div>

            <span className="connection-arrow">→</span>

            <div>
              <span>02</span>
              <strong>Umidade</strong>
            </div>

            <span className="connection-arrow">→</span>

            <div>
              <span>03</span>
              <strong>Alerta</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

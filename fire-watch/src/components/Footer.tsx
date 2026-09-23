import FireWatchLogo from "../assets/FireWatchLogo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div className="footer-logo">
            <img className="logo-image" src={FireWatchLogo} alt="FireWatch" />
            Fire<strong>Watch</strong>
          </div>

          <p>
            Tecnologia e dados para prevenção
            <br />
            de incêndios ambientais na Serra da Paulista.
          </p>
        </div>

        <div className="footer-location" style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#a1a1aa' }}>EQUIPE DE DESENVOLVIMENTO</span>
          <p style={{ fontSize: '8px', lineHeight: '1.6', color: '#d4d4d8' }}>
            João Pedro Machado Silva (BV3032477)<br />
            Leonardo Solovijovas Santos (BV3032485)<br />
            Thiago Menezes Francisco (BV3032299)<br />
            Gabriel Cavalcante Fernandes (BV3034666)<br />
            João Pedro Lopes Campos (BV3035727)<br />
            Nicholas Alexandre Destefano (BV3031934)<br />
          </p>
        </div>
      </div>

      <div className="container footer-bottom" style={{ borderTop: '1px solid #27272a', paddingTop: '24px', marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>© 2026 FireWatch - Projeto de Extensão</span>
          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>IFSP - Campus São João da Boa Vista</span>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block' }}>Bacharelado em Ciência da Computação</span>
          <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Ciências do Ambiente | Prof. Elias Mendes Oliveira</span>
        </div>
      </div>
    </footer>
  );
}
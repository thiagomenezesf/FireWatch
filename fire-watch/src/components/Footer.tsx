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
            de incêndios ambientais.
          </p>
        </div>

        <div className="footer-location">
          <span>PROJETO ACADÊMICO</span>
          <p>
            São João da Boa Vista
            <br />
            São Paulo — Brasil
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 FireWatch</span>
        <span>Ciência da Computação</span>
      </div>
    </footer>
  );
}
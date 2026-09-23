import { Link } from "react-router-dom";
import FireWatchLogo from "../assets/FireWatchLogo.png";

export default function Navbar() {

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <img className="logo-image" src={FireWatchLogo} alt="FireWatch" />
          Fire<span>Watch</span>
        </Link>

        <nav className="nav-links">
          <a href="#problema">O problema</a>
          <a href="#impacto">Impacto Socioambiental</a>
          <a href="#solucao">Solução</a>
          <a href="#tecnologia">Construção</a>
          <a href="#prototipo">Protótipo</a>
          <a href="#legislacao">Legislação</a>
          <a href="#trabalhos-relacionados">Trabalhos Relacionados</a>
          <a href="#demonstracao">Demonstração</a>
        </nav>

        <Link to="/monitoramento" className="nav-button">
          Ver demonstração
          <span>→</span>
        </Link>
      </div>
    </header>
  );
}
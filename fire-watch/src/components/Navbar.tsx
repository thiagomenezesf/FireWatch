import { useState } from "react";
import { Link } from "react-router-dom";
import FireWatchLogo from "../assets/FireWatchLogo.png";

const secoesBusca = [
  {
    id: "problema",
    titulo: "O problema",
    palavras: "queimadas incêndios desmatamento problema ambiental",
  },
  {
    id: "impacto",
    titulo: "Impacto Socioambiental",
    palavras: "impacto meio ambiente sociedade natureza",
  },
  {
    id: "solucao",
    titulo: "Solução",
    palavras: "firewatch plataforma solução proposta",
  },
  {
    id: "tecnologia",
    titulo: "Construção e tecnologias",
    palavras: "tecnologias desenvolvimento react spring python",
  },
  {
    id: "prototipo",
    titulo: "Protótipo",
    palavras: "arduino sensor dht22 coleta temperatura umidade",
  },
  {
    id: "testes",
    titulo: "Testes",
    palavras: "testes validação resultados",
  },
  {
    id: "legislacao",
    titulo: "Legislação",
    palavras: "leis legislação normas queimadas",
  },
  {
    id: "trabalhos-relacionados",
    titulo: "Trabalhos relacionados",
    palavras: "pesquisas referências trabalhos acadêmicos",
  },
  {
    id: "ia",
    titulo: "Previsão de incêndios",
    palavras: "inteligência artificial ia machine learning risco previsão",
  },
  {
    id: "demonstracao",
    titulo: "Demonstração",
    palavras: "monitoramento mapa calor demonstração",
  },
  {
    id: "video-demonstracao",
    titulo: "Vídeo de demonstração",
    palavras: "vídeo funcionamento apresentação plataforma",
  },
];

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Navbar() {
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resultados = termoBusca.trim()
    ? secoesBusca
        .filter((secao) => {
          const conteudo = normalizarTexto(
            `${secao.titulo} ${secao.palavras}`
          );

          return conteudo.includes(normalizarTexto(termoBusca));
        })
        .slice(0, 6)
    : [];

  const selecionarResultado = (id: string) => {
    const elemento = document.getElementById(id);

    elemento?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setBuscaAberta(false);
    setTermoBusca("");
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <img
            className="logo-image"
            src={FireWatchLogo}
            alt="FireWatch"
          />
          Fire<span>Watch</span>
        </Link>

        <nav className="nav-links">
          <a href="#problema">O problema</a>
          <a href="#impacto">Impacto Socioambiental</a>
          <a href="#solucao">Solução</a>
          <a href="#tecnologia">Construção</a>
          <a href="#prototipo">Protótipo</a>
          <a href="#video-demonstracao">Vídeo</a>
          <a href="#testes">Testes</a>
          <a href="#legislacao">Legislação</a>
          <a href="#trabalhos-relacionados">Trabalhos Relacionados</a>
          <a href="#ia">Previsão de incêndios</a>
          <a href="#demonstracao">Demonstração</a>
        </nav>

        <div className="navbar-search">
          <button
            type="button"
            className="navbar-search-toggle"
            aria-label={buscaAberta ? "Fechar busca" : "Abrir busca"}
            aria-expanded={buscaAberta}
            onClick={() => {
              setBuscaAberta(!buscaAberta);
              setTermoBusca("");
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>

          {buscaAberta && (
            <div className="navbar-search-panel">
              <input
                type="search"
                placeholder="O que você procura?"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && resultados.length > 0) {
                    selecionarResultado(resultados[0].id);
                  }

                  if (e.key === "Escape") {
                    setBuscaAberta(false);
                    setTermoBusca("");
                  }
                }}
              />

              {termoBusca.trim() !== "" && (
                <div className="navbar-search-results">
                  {resultados.length > 0 ? (
                    resultados.map((resultado) => (
                      <button
                        key={resultado.id}
                        type="button"
                        onClick={() => selecionarResultado(resultado.id)}
                      >
                        {resultado.titulo}
                        <span>→</span>
                      </button>
                    ))
                  ) : (
                    <p>Nenhum resultado encontrado.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/monitoramento" className="nav-button">
          Ver demonstração
          <span>→</span>
        </Link>
      </div>
    </header>
  );
}
export default function CorrelatedWorks() {
    return (
        <section className="section related-section" id="trabalhos-relacionados">
            <div className="container">
                <div className="related-header">
                    <span className="section-tag">TRABALHOS RELACIONADOS</span>

                    <h2>
                        Tecnologia aplicada à
                        <br />
                        <span>prevenção de incêndios.</span>
                    </h2>

                    <p>
                        Diferentes pesquisas têm explorado o uso de sensores, Internet das
                        Coisas (IoT), redes de comunicação e Inteligência Artificial como
                        ferramentas para aprimorar o monitoramento ambiental, a detecção
                        de condições de risco e a prevenção de incêndios florestais.
                    </p>
                </div>

                <div className="related-grid">

                    {/* TRABALHO 01 */}
                    <article className="related-card">
                        <div className="related-card-top">
                            <span className="related-number">01</span>
                            <span className="related-category">
                                SENSORES · MONITORAMENTO
                            </span>
                        </div>

                        <h3>Monitoramento ambiental por redes de sensores</h3>

                        <p>
                            Pesquisas baseadas em redes de sensores demonstram que variáveis
                            ambientais, como temperatura, umidade e presença de gases, podem
                            ser coletadas continuamente em áreas florestais para identificar
                            condições associadas ao surgimento de incêndios.
                        </p>

                        <p>
                            Essas abordagens fornecem uma base para sistemas de monitoramento
                            remoto capazes de acompanhar regiões extensas ou de difícil
                            acesso, possibilitando a coleta contínua de informações
                            ambientais.
                        </p>

                        <div className="related-reference">
                            <span>REFERÊNCIA</span>

                            <p>
                                ALKHATIB, Ahmad A. A.; JABER, Khalid M. FDPA Internet of Things
                                System for Forest Fire Detection, Prediction and Behaviour
                                Analysis. <em>IET Wireless Sensor Systems</em>, 2024.
                            </p>

                            {/* Espaço para link/citação da fonte */}
                        </div>
                    </article>

                    {/* TRABALHO 02 */}
                    <article className="related-card">
                        <div className="related-card-top">
                            <span className="related-number">02</span>
                            <span className="related-category">
                                IoT · INTELIGÊNCIA ARTIFICIAL
                            </span>
                        </div>

                        <h3>IoT integrada à Inteligência Artificial</h3>

                        <p>
                            Estudos recentes investigam a integração entre dispositivos IoT
                            e algoritmos de Machine Learning para transformar dados
                            ambientais em informações capazes de auxiliar na avaliação do
                            risco de incêndios.
                        </p>

                        <p>
                            Variáveis como temperatura, umidade e condições meteorológicas
                            podem ser processadas por modelos preditivos, permitindo
                            identificar padrões de risco e apoiar a geração antecipada de
                            alertas.
                        </p>

                        <div className="related-reference">
                            <span>REFERÊNCIA</span>

                            <p>
                                RADHI, Ahmed A.; IBRAHIM, Abdullahi A. An Intelligent
                                IoT–Machine Learning Framework for Wildfire Detection and
                                Prediction Using a Hybrid RF–XGB Model.{" "}
                                <em>Scientific Reports</em>, 2026.
                            </p>

                            {/* Espaço para link/citação da fonte */}
                        </div>
                    </article>

                    {/* TRABALHO 03 */}
                    <article className="related-card">
                        <div className="related-card-top">
                            <span className="related-number">03</span>
                            <span className="related-category">
                                LoRa · COMUNICAÇÃO
                            </span>
                        </div>

                        <h3>Redes de comunicação para áreas remotas</h3>

                        <p>
                            Outra linha de pesquisa explora arquiteturas de comunicação de
                            longo alcance, utilizando tecnologias como LoRa e redes de
                            sensores distribuídas para possibilitar a transmissão de dados
                            ambientais em regiões afastadas.
                        </p>

                        <p>
                            Esse tipo de infraestrutura é especialmente relevante para áreas
                            montanhosas, florestais ou de preservação ambiental, nas quais a
                            disponibilidade de redes de comunicação convencionais pode ser
                            limitada.
                        </p>

                        <div className="related-reference">
                            <span>REFERÊNCIA</span>

                            <p>
                                FERRUFINO, Fernando; AIGHOB AHI, Anthony; RAHMAN, Musfiq. A
                                Hybrid Zigbee–LoRa Sensor Network with Integrated Machine
                                Learning for Ignition-Stage Wildfire Risk Monitoring.{" "}
                                <em>Frontiers in Communications and Networks</em>, 2026.
                            </p>

                            {/* Espaço para link/citação da fonte */}
                        </div>
                    </article>

                </div>

                <div className="related-firewatch">
                    <span className="related-firewatch-label">
                        CONEXÃO COM O FIREWATCH
                    </span>

                    <p>
                        O FireWatch se insere nesse contexto ao propor a integração entre
                        coleta de dados ambientais, informações meteorológicas e análise
                        computacional para apoiar o monitoramento de áreas suscetíveis a
                        incêndios. A proposta reúne conceitos presentes nesses trabalhos
                        em uma aplicação direcionada ao monitoramento da Serra da Paulista.
                    </p>
                </div>
            </div>
        </section>
    );
}
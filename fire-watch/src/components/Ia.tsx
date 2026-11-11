import React, { useState } from 'react';
import * as ort from 'onnxruntime-web';
import '../styles/global.css';
import Tree from "../assets/tree.png";

// Importação do modelo como URL para que o Vite consiga processar o ficheiro estático
import modelUrl from '../../../ia_service/modelo_arvore_ofc.onnx?url';

export default function Ia() {
  const [formData, setFormData] = useState({
    temperatura: '',
    umidade: '',
    dias_sem_chuva: '',
    pressao: '',
  });
  
  const [resultado, setResultado] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const prepararFeatures = (data: typeof formData) => {
    return [
      parseFloat(data.temperatura),
      parseFloat(data.umidade),
      parseInt(data.dias_sem_chuva, 10),
      parseFloat(data.pressao)
    ];
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null);

    try {
      const features = prepararFeatures(formData);
      const tensorEntrada = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
      
      // Passar a variável modelUrl importada no topo em vez da string relativa
      const session = await ort.InferenceSession.create(modelUrl);
      
      const feeds = { float_input: tensorEntrada };
      const results = await session.run(feeds);
      
      const outputName = session.outputNames[0];
      let risco = results[outputName].data[0] as number;
      
      risco = Math.max(0, Math.min(1, risco));
      setResultado(risco);
    } catch (error) {
      console.error("Erro ao realizar a previsão local via ONNX:", error);
      setResultado("erro");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskStatus = (risco: number | string) => {
    if (risco === "erro") return { color: "#ef4444", text: "Erro na inferência. Verifique o console." };
    if (typeof risco === 'number') {
        if (risco < 0.3) return { color: "#10b981", text: "Risco Baixo" };
        if (risco < 0.7) return { color: "#f59e0b", text: "Risco Moderado" };
    }
    return { color: "#ef4444", text: "Risco Crítico" };
  };

  return (
    <section className="ia-section" id="ia">
      <div className="ia-container">
        
        <div className="ia-header">
          <span className="ia-tag">IA & MACHINE LEARNING</span>
          <h2>
            Previsão de Risco de Fogo
            <br />
            <span>Árvore de Decisão Regressiva</span>
          </h2>
        </div>

        <div className="ia-card">
          <form onSubmit={handlePredict} className="ia-form">
            
            <div className="ia-form-group">
              <label htmlFor="temperatura">Temperatura (°C)</label>
              <div className="ia-input-wrapper">
                <input type="number" step="0.1" id="temperatura" name="temperatura" placeholder="Ex: 32.5" value={formData.temperatura} onChange={handleChange} required />
              </div>
            </div>

            <div className="ia-form-group">
              <label htmlFor="umidade">Umidade (%)</label>
              <div className="ia-input-wrapper">
                <input type="number" step="0.01" id="umidade" name="umidade" placeholder="Ex: 45.0" value={formData.umidade} onChange={handleChange} required />
              </div>
            </div>

            <div className="ia-form-group">
              <label htmlFor="dias_sem_chuva">Dias sem chuva</label>
              <div className="ia-input-wrapper">
                <input type="number" step="1" id="dias_sem_chuva" name="dias_sem_chuva" placeholder="Ex: 12" value={formData.dias_sem_chuva} onChange={handleChange} required />
              </div>
            </div>

            <div className="ia-form-group">
              <label htmlFor="pressao">Pressão (hPa)</label>
              <div className="ia-input-wrapper">
                <input type="number" step="0.1" id="pressao" name="pressao" placeholder="Ex: 1012.5" value={formData.pressao} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className={`ia-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Processando Modelo...' : 'Prever Risco de Fogo'}
            </button>
          </form>

          {resultado !== null && (
            <div 
              className="ia-result-card" 
              style={{ 
                '--risk-color': getRiskStatus(resultado).color,
                borderColor: getRiskStatus(resultado).color 
              } as React.CSSProperties}
            >
              <h3>Resultado da Inferência</h3>
              {resultado === "erro" ? (
                <p className="ia-risk-error">{getRiskStatus(resultado).text}</p>
              ) : (
                <>
                  <div className="ia-risk-value">{((resultado as number) * 100).toFixed(1)}%</div>
                  <p className="ia-risk-label" style={{ color: getRiskStatus(resultado).color }}>
                    {getRiskStatus(resultado).text}
                  </p>
                </>
              )}
            </div>
          )}

          <div className="section-heading-ia centered" style={{ marginTop: '2rem', marginBottom: '1rem', color: '#a1a1aa', minWidth: '600px' }}>
            <p>
              Para o desenvolvimento da nossa IA, utilizamos uma base de dados do Kaggle (saviovianna/queimadas-inpe), que cruza informações do BDQueimadas (INPE) com a API de meteorologia da Open-Meteo. Nossa variável-alvo é o "risco de fogo" , um cálculo determinístico disponibilizado pelo próprio INPE.
              <br/><br/>O objetivo principal é criar um surrogate model (modelo substituto) capaz de aproximar esse cálculo utilizando menos features e evitando a dependência de dados históricos complexos. Para a construção do modelo, empregamos as seguintes variáveis: umidade (ESP/Arduino), temperatura (ESP/Arduino), dias sem chuva (Open-Meteo) e pressão atmosférica (Open-Meteo).
              <br/><br/>A principal mudança estratégica foi simplificar a abordagem, sacrificando um leve ganho de precisão em prol de um modelo mais interpretável e auditável. Para isso, abandonamos o antigo modelo de caixa-preta (MLP) e adotamos uma árvore de decisão relativamente rasa. Esse formato funciona essencialmente como um gerador de regras que separam os dados com clareza, permitindo que especialistas do domínio validem o comportamento do modelo e forneçam feedback assertivo.
              <br/><br/>Como resultado, a árvore obteve um Erro Absoluto Médio (MAE) de 0,125 em relação ao risco de fogo. Durante o processo de construção, constatamos também que a variável "bioma" não se mostrou relevante para o modelo, razão pela qual optamos por removê-la do conjunto de features.
            </p>

            <h2 style={{ color: '#a1a1aa', marginTop: '2rem' }}>Modelo de Previsão: <span>Árvore de Decisão Regressiva</span></h2>
            <p style={{ marginTop: '0rem' }}>Erro Absoluto Médio (MAE): 0.125</p>
            <img style={{maxWidth: '100%', height: 'auto' }}
              src={Tree}
              alt="Árvore de decisão representando o modelo de previsão de risco de fogo"
            />
            
          </div>
        </div>
      </div>
    </section>
  );
}
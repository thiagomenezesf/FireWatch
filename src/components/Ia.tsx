import React, { useState } from 'react';
import * as ort from 'onnxruntime-web';
import '../App.css';

export default function Ia() {
  const [formData, setFormData] = useState({
    temperatura: '',
    umidade: '',
    dias_sem_chuva: '',
    pressao: '',
    bioma: 'Mata Atlântica'
  });
  
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const prepararFeatures = (data) => {
    return [
      parseFloat(data.temperatura),
      parseFloat(data.umidade),
      parseInt(data.dias_sem_chuva, 10),
      parseFloat(data.pressao),
      data.bioma === 'Mata Atlântica' ? 1.0 : 0.0 
    ];
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null); // Limpa o resultado anterior durante o cálculo

    try {
      const features = prepararFeatures(formData);
      const tensorEntrada = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
      const session = await ort.InferenceSession.create('../ia/pipeline_mlp.onnx');
      const feeds = { float_input: tensorEntrada };
      const results = await session.run(feeds);
      
      const outputName = session.outputNames[0];
      let risco = results[outputName].data[0];
      
      risco = Math.max(0, Math.min(1, risco));
      setResultado(risco);
    } catch (error) {
      console.error("Erro ao realizar a previsão local via ONNX:", error);
      setResultado("erro");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para definir a cor do card de resultado baseado na porcentagem
  const getRiskStatus = (risco) => {
    if (risco === "erro") return { color: "#ef4444", text: "Erro na inferência. Verifique o console." };
    if (risco < 0.3) return { color: "#10b981", text: "Risco Baixo" }; // Verde
    if (risco < 0.7) return { color: "#f59e0b", text: "Risco Moderado" }; // Laranja/Amarelo
    return { color: "#ef4444", text: "Risco Crítico" }; // Vermelho
  };

  return (
    <section className="ia-section" id="ia">
      <div className="ia-container">
        
        <div className="ia-header">
          <span className="ia-tag">IA & MACHINE LEARNING</span>
          <h2>
            Previsão de Risco de Fogo
            <br />
            <span>Rede Neural MLP</span>
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

            <div className="ia-form-group ia-full-width">
              <label htmlFor="bioma">Bioma da Região</label>
              <div className="ia-input-wrapper">
                <select id="bioma" name="bioma" value={formData.bioma} onChange={handleChange} required>
                  <option value="Mata Atlântica">Mata Atlântica</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
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
              }}
            >
              <h3>Resultado da Inferência</h3>
              {resultado === "erro" ? (
                <p className="ia-risk-error">{getRiskStatus(resultado).text}</p>
              ) : (
                <>
                  <div className="ia-risk-value">{(resultado * 100).toFixed(1)}%</div>
                  <p className="ia-risk-label" style={{ color: getRiskStatus(resultado).color }}>
                    {getRiskStatus(resultado).text}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
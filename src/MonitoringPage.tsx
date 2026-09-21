import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/MonitoringPage.css';
import mapaSerra from './assets/mapa-serra.png';

interface SensorData {
  id: string;
  name: string;
  temp: number;
  humidity: number;
  status: 'normal' | 'atencao' | 'critico';
  x: string;
  y: string;
}

interface AlertItem {
  id: number;
  location: string;
  time: string;
  message: string;
}

export default function MonitoringPage() {
  // Relógio em tempo real para a apresentação
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Estados principais do Sistema
  const [climate, setClimate] = useState({
    temp: 31.2,
    humidity: 22,
    wind: 18,
    risk: 'ALTO'
  });

  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 1, location: 'Encosta Leste (Setor 2)', time: 'Há 5 min', message: 'Vento constante de 18km/h detectado.' }
  ]);

  const [sensors, setSensors] = useState<SensorData[]>([
    { id: 'S-01', name: 'Pico Norte', temp: 31.5, humidity: 21, status: 'atencao', x: '50%', y: '30%' },
    { id: 'S-02', name: 'Vale Central', temp: 29.8, humidity: 25, status: 'normal', x: '35%', y: '60%' },
    { id: 'S-03', name: 'Mirante SUL', temp: 30.1, humidity: 24, status: 'normal', x: '65%', y: '70%' },
  ]);

  // Controle de passos da simulação (0 = Normal, 1 = Foco inicial, 2 = Vento espalha, 3 = Crítico)
  const [simStep, setSimStep] = useState(0);

  // Função para a demonstração na banca
  // Função para a demonstração na banca
  // Função passo a passo para a demonstração na banca
  const triggerEmergency = () => {
    if (simStep === 0) {
      // FASE 1: Início da anomalia térmica no Pico Norte
      setClimate({ temp: 34.5, humidity: 18, wind: 25, risk: 'MUITO ALTO' });
      setSensors(prev => prev.map(s => s.id === 'S-01' ? { ...s, temp: 38.0, status: 'critico' } : s));
      setAlerts(prev => [
        { id: Date.now(), location: 'Pico Norte (Setor 1)', time: 'AGORA', message: 'ALERTA: Anomalia térmica isolada detectada.' },
        ...prev
      ]);
      setSimStep(1);

    } else if (simStep === 1) {
      // FASE 2: Vento aumenta e espalha para o Vale Central
      setClimate({ temp: 36.8, humidity: 15, wind: 35, risk: 'EXTREMO' });
      setSensors(prev => prev.map(s => s.id === 'S-02' ? { ...s, temp: 37.2, status: 'critico' } : s));
      setAlerts(prev => [
        { id: Date.now(), location: 'Vale Central (Setor 2)', time: 'AGORA', message: 'CRÍTICO: Foco secundário provocado por rajadas de vento (35km/h).' },
        ...prev
      ]);
      setSimStep(2);

    } else if (simStep === 2) {
      // FASE 3: Alastramento total chegando no Mirante Sul
      setClimate({ temp: 38.5, humidity: 12, wind: 45, risk: 'EXTREMO' });
      setSensors(prev => prev.map(s => s.id === 'S-03' ? { ...s, temp: 35.1, status: 'atencao' } : s));
      setAlerts(prev => [
        { id: Date.now(), location: 'MÚLTIPLOS SETORES', time: 'AGORA', message: 'EMERGÊNCIA GERAL: Fogo em alastramento. Evacuação recomendada.' },
        ...prev
      ]);
      setSimStep(3);

    } else {
      // RESET: Volta tudo ao normal se clicar de novo
      setClimate({ temp: 31.2, humidity: 22, wind: 18, risk: 'ALTO' });
      setSensors([
        { id: 'S-01', name: 'Pico Norte', temp: 31.5, humidity: 21, status: 'atencao', x: '50%', y: '30%' },
        { id: 'S-02', name: 'Vale Central', temp: 29.8, humidity: 25, status: 'normal', x: '35%', y: '60%' },
        { id: 'S-03', name: 'Mirante SUL', temp: 30.1, humidity: 24, status: 'normal', x: '65%', y: '70%' },
      ]);
      setAlerts([{ id: 1, location: 'Encosta Leste (Setor 2)', time: 'Há 5 min', message: 'Vento constante de 18km/h detectado.' }]);
      setSimStep(0);
    }
  };

  return (
    <div className="dash-container">

      {/* MENU LATERAL */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 0-5 6.5-5 11a5 5 0 0 0 10 0c0-4.5-5-11-5-11Z" />
          </svg>
          <h2>FireWatch</h2>
        </div>
        <nav className="dash-nav">
          <Link to="/monitoramento" className="dash-nav-item active">📡 Monitoramento</Link>
          <Link to="#" className="dash-nav-item">📊 Relatórios de IA</Link>
          <Link to="/monitoramento/redes-sensores" className="dash-nav-item">🌡️ Rede de Sensores</Link>
          <Link to="#" className="dash-nav-item">⚙️ Configurações</Link>
        </nav>
        <div style={{ padding: '24px' }}>
          <Link to="/" style={{ color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}>
            ← Sair para Landing Page
          </Link>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="dash-main">

        {/* CABEÇALHO SUPERIOR */}
        <header className="dash-header">
          <div className="status-badge">
            <div className="status-dot"></div>
            Online • São João da Boa Vista, SP • {time.toLocaleTimeString('pt-BR')}
          </div>

          {/* INDICADORES TÉCNICOS (Substituindo o antigo usuário) */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#a1a1aa', fontWeight: '500' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              API Meteo: ON
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
              Rede IoT: SIMULADA
            </span>
          </div>
        </header>

        {/* CONTEÚDO DO DASHBOARD */}
        <div className="dash-content">

          {/* CARDS DE INDICADORES (KPIs) */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>Temperatura Média</h3>
              <div className="kpi-value" style={{ color: climate.temp > 35 ? '#ef4444' : '#f4f4f5' }}>
                {climate.temp}°C
              </div>
              <div className="kpi-trend trend-up">↑ Dados API Meteo</div>
            </div>

            <div className="kpi-card">
              <h3>Umidade Relativa</h3>
              <div className="kpi-value" style={{ color: climate.humidity < 20 ? '#ef4444' : '#f4f4f5' }}>
                {climate.humidity}%
              </div>
              <div className="kpi-trend trend-down">↓ Alerta de Seca</div>
            </div>

            <div className="kpi-card">
              <h3>Velocidade do Vento</h3>
              <div className="kpi-value">{climate.wind} km/h</div>
              <div className="kpi-trend trend-neutral">Rajadas no quadrante SUL</div>
            </div>

            <div className="kpi-card" style={{ border: climate.risk === 'EXTREMO' ? '1px solid #ef4444' : '1px solid #f97316' }}>
              <h3>Índice de Risco (IA)</h3>
              <div className="kpi-value" style={{ color: climate.risk === 'EXTREMO' ? '#ef4444' : '#f97316' }}>
                {climate.risk}
              </div>
              <div className="kpi-trend trend-up">Análise Preditiva Ativa</div>
            </div>
          </div>

          {/* ÁREA DO MAPA E FEED DE ALERTAS */}
          <div className="dash-body-grid">

            {/* PAINEL GIS (ESQUERDA) */}
            <div className="dash-panel">
              <div className="dash-panel-header">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>Mapeamento GIS em Tempo Real</h3>
                  <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Área de Preservação: Serra da Paulista, São João da Boa Vista - SP</span>
                </div>
                <button className="btn-simulate" onClick={triggerEmergency}>
                  {simStep === 0 ? '🚨 Iniciar Simulação' :
                    simStep === 1 ? '⚠️ Simular Rajada de Vento' :
                      simStep === 2 ? '🔥 Simular Alastramento' :
                        '🔄 Resetar Sistema'}
                </button>
              </div>

              <div className="map-canvas" style={{
                backgroundImage: `linear-gradient(rgba(9, 9, 11, 0.6), rgba(9, 9, 11, 0.6)), url(${mapaSerra})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                aspectRatio: '16 / 9' /* <-- ADICIONE ESTA LINHA */
              }}>

                {/* ZONAS DE CALOR (MÚLTIPLOS FOCOS ESPALHADOS) */}
                {/* Foco 1: Pico Norte (Aparece a partir do Passo 1) */}
                {simStep >= 1 && (
                  <div style={{
                    position: 'absolute', top: '5%', left: '30%', width: '350px', height: '350px',
                    background: 'radial-gradient(circle, rgba(249,115,22,0.45) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'pulse 2s infinite'
                  }} />
                )}

                {/* Foco 2: Vale Central (Aparece a partir do Passo 2) */}
                {simStep >= 2 && (
                  <div style={{
                    position: 'absolute', top: '40%', left: '15%', width: '280px', height: '280px',
                    background: 'radial-gradient(circle, rgba(239,68,68,0.55) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'pulse 2.5s infinite'
                  }} />
                )}

                {/* Foco 3: Mirante Sul (Aparece a partir do Passo 3) */}
                {simStep >= 3 && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'pulse 3s infinite'
                  }} />
                )}

                {/* SENSORES IOT NO MAPA */}
                {sensors.map(s => (
                  <div key={s.id} style={{
                    position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    zIndex: 10 /* Garante que o sensor fique por cima das manchas de calor */
                  }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: s.status === 'critico' ? '#ef4444' : s.status === 'atencao' ? '#f97316' : '#10b981',
                      boxShadow: `0 0 12px ${s.status === 'critico' ? '#ef4444' : s.status === 'atencao' ? '#f97316' : 'transparent'}`
                    }}></div>
                    <div style={{
                      backgroundColor: 'rgba(9,9,11,0.9)', border: '1px solid #27272a', padding: '4px 8px',
                      borderRadius: '4px', fontSize: '10px', color: '#f4f4f5', whiteSpace: 'nowrap'
                    }}>
                      <strong>{s.name}</strong> | {s.temp}°C
                    </div>
                  </div>
                ))}
                {/* LEGENDA DO MAPA (Canto Inferior Direito) */}
                <div style={{
                  position: 'absolute', bottom: '12px', right: '12px',
                  backgroundColor: 'rgba(9, 9, 11, 0.85)', border: '1px solid #27272a',
                  padding: '8px 12px', borderRadius: '6px', fontSize: '10px', color: '#a1a1aa',
                  backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', gap: '4px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#f4f4f5' }}>Gradiente de Risco</span>
                  <div style={{
                    width: '120px', height: '6px', borderRadius: '3px',
                    background: 'linear-gradient(to right, #10b981, #f97316, #ef4444)'
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                    <span>Baixo</span>
                    <span>Atenção</span>
                    <span style={{ color: '#ef4444' }}>Crítico</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAINEL DE ALERTAS (DIREITA) */}
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h3>Feed de Alertas</h3>
              </div>
 
              <div className="alert-feed">
                {alerts.map(alert => (
                  <div key={alert.id} className="alert-item" style={{
                    borderColor: alert.message.includes('CRÍTICO') ? '#ef4444' : '#f97316'
                  }}>
                    <div className="alert-time">{alert.time}</div>
                    <div className="alert-loc">{alert.location}</div>
                    <div className="alert-msg">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
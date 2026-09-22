import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/MonitoringPage.css';
import mapaSerra from './assets/mapa-serra.png'; // Certifique-se de que a imagem esteja em src/assets/

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
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [simStep, setSimStep] = useState(0);

  // ESTADO CLIMÁTICO ATUALIZADO COM PRESSÃO E DIAS SEM CHUVA
  const [climate, setClimate] = useState({
    temp: 31.2,
    humidity: 22,
    wind: 18,
    pressure: 1015, // hPa (Hectopascais)
    dryDays: 14,    // Dias de estiagem
    risk: 'ALTO'
  });

  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 1, location: 'Mirante Serra da Paulista', time: 'Há 5 min', message: 'Vento constante de 18km/h detectado.' }
  ]);

  const [sensors, setSensors] = useState<SensorData[]>([
    { id: 'S-01', name: 'Mirante Serra da Paulista', temp: 31.5, humidity: 21, status: 'atencao', x: '61.5%', y: '13%' },
    { id: 'S-02', name: 'Região Pedra Balão', temp: 29.8, humidity: 25, status: 'normal', x: '56%', y: '81%' },
    { id: 'S-03', name: 'Pesqueiro Bambu Amarelo', temp: 30.1, humidity: 24, status: 'normal', x: '30.5%', y: '47%' },
    { id: 'S-04', name: 'Capelinha Nossa Senhora', temp: 30.8, humidity: 22, status: 'normal', x: '40%', y: '58%' },
    { id: 'S-05', name: 'Vinicola Lanchellotti', temp: 29.5, humidity: 21, status: 'normal', x: '43%', y: '22%' },
    { id: 'S-06', name: 'Cruz Cruzeiro do Sul', temp: 32.1, humidity: 23, status: 'normal', x: '65%', y: '48%' },
  ]);

  const triggerEmergency = () => {
    if (simStep === 0) {
      // Queda leve de pressão indicando piora climática
      setClimate({ temp: 35.2, humidity: 18, wind: 28, pressure: 1010, dryDays: 14, risk: 'MUITO ALTO' });
      setSensors(prev => prev.map(s => (s.id === 'S-01' || s.id === 'S-05') ? { ...s, temp: 41.5, status: 'critico' } : s));
      setAlerts(prev => [
        { id: Date.now(), location: 'Setor Norte (Vinícola/Mirante)', time: 'AGORA', message: 'ALERTA: Foco de calor extremo detectado na região alta.' },
        ...prev
      ]);
      setSimStep(1);
      
    } else if (simStep === 1) {
      // Pressão caindo mais, puxando ventos de 38km/h
      setClimate({ temp: 37.8, humidity: 14, wind: 38, pressure: 1005, dryDays: 14, risk: 'EXTREMO' });
      setSensors(prev => prev.map(s => (s.id === 'S-03' || s.id === 'S-04') ? { ...s, temp: 39.8, status: 'critico' } : s));
      setAlerts(prev => [
        { id: Date.now(), location: 'Setor Central (Capelinha/Bambu)', time: 'AGORA', message: 'CRÍTICO: Incêndio alastrando rapidamente devido aos ventos (38km/h).' },
        ...prev
      ]);
      setSimStep(2);
      
    } else if (simStep === 2) {
      // Baixa pressão crítica alimentando o desastre
      setClimate({ temp: 39.5, humidity: 11, wind: 45, pressure: 998, dryDays: 14, risk: 'EXTREMO' });
      setSensors(prev => prev.map(s => ({ ...s, temp: +(s.temp + 3.5).toFixed(1), status: 'critico' })));
      setAlerts(prev => [
        { id: Date.now(), location: 'SERRA DA PAULISTA (GERAL)', time: 'AGORA', message: 'EMERGÊNCIA: Perda de controle. Múltiplos sensores em temperatura máxima!' },
        ...prev
      ]);
      setSimStep(3);
      
    } else {
      // RESET
      setClimate({ temp: 31.2, humidity: 22, wind: 18, pressure: 1015, dryDays: 14, risk: 'ALTO' });
      setSensors([
        { id: 'S-01', name: 'Mirante Serra da Paulista', temp: 31.5, humidity: 21, status: 'atencao', x: '61.5%', y: '13%' },
        { id: 'S-02', name: 'Região Pedra Balão', temp: 29.8, humidity: 25, status: 'normal', x: '56%', y: '81%' },
        { id: 'S-03', name: 'Pesqueiro Bambu Amarelo', temp: 30.1, humidity: 24, status: 'normal', x: '30.5%', y: '47%' },
        { id: 'S-04', name: 'Capelinha Nossa Senhora', temp: 30.8, humidity: 22, status: 'normal', x: '40%', y: '58%' },
        { id: 'S-05', name: 'Vinicola Lanchellotti', temp: 29.5, humidity: 21, status: 'normal', x: '43%', y: '22%' },
        { id: 'S-06', name: 'Cruz Cruzeiro do Sul', temp: 32.1, humidity: 23, status: 'normal', x: '65%', y: '48%' },
      ]);
      setAlerts([{ id: 1, location: 'Mirante Serra da Paulista', time: 'Há 5 min', message: 'Vento constante de 18km/h detectado.' }]);
      setSimStep(0);
    }
  };

  return (
    <div className="dash-container">
      
      {/* MENU LATERAL */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 0-5 6.5-5 11a5 5 0 0 0 10 0c0-4.5-5-11-5-11Z"/>
          </svg>
          <h2>FireWatch</h2>
        </div>
        <nav className="dash-nav">
          <Link to="/monitoramento" className="dash-nav-item active">📡 Monitoramento</Link>
          <Link to="/monitoramento/redes-sensores" className="dash-nav-item">🌡️ Rede de Sensores</Link>
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
          
          {/* GRID DE KPIs FORÇADO PARA 3 COLUNAS */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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

            {/* NOVOS CARDS: PRESSÃO E DIAS SEM CHUVA */}
            <div className="kpi-card">
              <h3>Pressão Atmosférica</h3>
              <div className="kpi-value" style={{ color: climate.pressure < 1005 ? '#f97316' : '#f4f4f5' }}>
                {climate.pressure} hPa
              </div>
              <div className="kpi-trend trend-down">↓ Sistema de baixa pressão</div>
            </div>

            <div className="kpi-card">
              <h3>Dias Sem Chuva</h3>
              <div className="kpi-value" style={{ color: climate.dryDays >= 14 ? '#ef4444' : '#f4f4f5' }}>
                {climate.dryDays} Dias
              </div>
              <div className="kpi-trend trend-up">↑ Acúmulo de biomassa seca</div>
            </div>

            <div className="kpi-card" style={{ border: climate.risk === 'EXTREMO' ? '1px solid #ef4444' : '1px solid #f97316' }}>
              <h3>Índice de Risco (IA)</h3>
              <div className="kpi-value" style={{ color: climate.risk === 'EXTREMO' ? '#ef4444' : '#f97316' }}>
                {climate.risk}
              </div>
              <div className="kpi-trend trend-up">Análise Preditiva Ativa</div>
            </div>
          </div>

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
                aspectRatio: '16 / 9'
              }}>
                
                {simStep >= 1 && (
                  <div style={{
                    position: 'absolute', top: '17%', left: '52%', width: '450px', height: '250px',
                    background: 'radial-gradient(ellipse, rgba(239,68,68,0.55) 0%, transparent 70%)',
                    borderRadius: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 2s infinite'
                  }} />
                )}
                
                {simStep >= 2 && (
                  <div style={{
                    position: 'absolute', top: '52%', left: '35%', width: '380px', height: '380px',
                    background: 'radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)',
                    borderRadius: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 2.5s infinite'
                  }} />
                )}

                {simStep >= 3 && (
                  <div style={{
                    position: 'absolute', top: '65%', left: '60%', width: '450px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(239,68,68,0.45) 0%, transparent 70%)',
                    borderRadius: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 3s infinite'
                  }} />
                )}
                
                {sensors.map(s => (
                  <div key={s.id} style={{
                    position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    zIndex: 10
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

                {/* LEGENDA DO MAPA */}
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
                    borderColor: alert.message.includes('CRÍTICO') || alert.message.includes('EMERGÊNCIA') ? '#ef4444' : '#f97316' 
                  }}>
                    <div className="alert-time">{alert.time}</div>
                    <div className="alert-loc">{alert.location}</div>
                    <div className="alert-msg">{alert.message}</div>
                    
                    <button 
                      onClick={() => window.alert(`[PROTOCOLO ENVIADO] Notificação de patrulha despachada para: ${alert.location}`)}
                      style={{
                        marginTop: '8px', width: '100%', padding: '4px 8px', backgroundColor: '#27272a',
                        border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '4px', fontSize: '10px',
                        cursor: 'pointer', fontWeight: '500'
                      }}
                    >
                      📢 Despachar Patrulha de Campo
                    </button>
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
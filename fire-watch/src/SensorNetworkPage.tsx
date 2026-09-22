import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface SensorNetworkItem {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  fireProbability: number;
  status: 'normal' | 'atencao' | 'critico';
}

const sensorNetwork: SensorNetworkItem[] = [
  { id: 'S-01', location: 'Pico Norte', temperature: 31.5, humidity: 21, fireProbability: 72, status: 'atencao' },
  { id: 'S-02', location: 'Vale Central', temperature: 29.8, humidity: 25, fireProbability: 38, status: 'normal' },
  { id: 'S-03', location: 'Mirante SUL', temperature: 30.1, humidity: 24, fireProbability: 44, status: 'normal' },
  { id: 'S-04', location: 'Pedra Balão', temperature: 32.1, humidity: 18, fireProbability: 81, status: 'critico' },
  { id: 'S-05', location: 'Parque da Cachoeira', temperature: 28.9, humidity: 27, fireProbability: 29, status: 'normal' },
];

const statusLabelMap = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

export default function SensorNetworkPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSensors = sensorNetwork.filter((sensor) => sensor.status !== 'normal').length;
  const avgTemperature = (sensorNetwork.reduce((sum, sensor) => sum + sensor.temperature, 0) / sensorNetwork.length).toFixed(1);
  const avgHumidity = Math.round(sensorNetwork.reduce((sum, sensor) => sum + sensor.humidity, 0) / sensorNetwork.length);

  return (
    <div className="dash-container">
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 0-5 6.5-5 11a5 5 0 0 0 10 0c0-4.5-5-11-5-11Z" />
          </svg>
          <h2>FireWatch</h2>
        </div>

        <nav className="dash-nav">
          <Link to="/monitoramento" className="dash-nav-item">📡 Monitoramento</Link>
          <NavLink
            to="/monitoramento/redes-sensores"
            className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
          >
            🌡️ Rede de Sensores
          </NavLink>
        </nav>

        <div style={{ padding: '24px' }}>
          <Link to="/monitoramento" style={{ color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}>
            ← Voltar ao monitoramento
          </Link>
        </div>
      </aside>

      <main className="dash-main">
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

        <div className="dash-content sensor-network-layout">
          <div className="kpi-grid sensor-network-summary">
            <div className="kpi-card">
              <h3>Dispositivos ativos</h3>
              <div className="kpi-value">{sensorNetwork.length}</div>
              <div className="kpi-trend trend-up">↑ Sensores operando</div>
            </div>

            <div className="kpi-card">
              <h3>Temp. média</h3>
              <div className="kpi-value">{avgTemperature}°C</div>
              <div className="kpi-trend trend-neutral">Média da rede</div>
            </div>

            <div className="kpi-card">
              <h3>Umidade média</h3>
              <div className="kpi-value">{avgHumidity}%</div>
              <div className="kpi-trend trend-down">↓ Ambiente seco</div>
            </div>

            <div className="kpi-card" style={{ border: activeSensors > 0 ? '1px solid #f97316' : '1px solid #10b981' }}>
              <h3>Unidades em alerta</h3>
              <div className="kpi-value" style={{ color: activeSensors > 0 ? '#f97316' : '#10b981' }}>{activeSensors}</div>
              <div className="kpi-trend trend-up">Monitoramento em curso</div>
            </div>
          </div>

          <div className="dash-panel sensor-panel">
            <div className="dash-panel-header sensor-panel-header">
              <div>
                <h3>Rede de Sensores</h3>
                <span>Distribuição da região de preservação</span>
              </div>
            </div>

            <div className="sensor-card-grid">
              {sensorNetwork.map((sensor) => (
                <article key={sensor.id} className="sensor-card">
                  <div className="sensor-card-header">
                    <div>
                      <span className="sensor-card-id">{sensor.id}</span>
                      <h3>{sensor.location}</h3>
                    </div>
                    <span className={`sensor-status ${sensor.status}`}>{statusLabelMap[sensor.status]}</span>
                  </div>

                  <div className="sensor-metrics">
                    <div>
                      <span>Temperatura</span>
                      <strong>{sensor.temperature.toFixed(1)}°C</strong>
                    </div>
                    <div>
                      <span>Umidade</span>
                      <strong>{sensor.humidity}%</strong>
                    </div>
                    <div>
                      <span>Prob. incêndio</span>
                      <strong>{sensor.fireProbability}%</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './HomePage.tsx'
import MonitoringPage from './MonitoringPage.tsx'
import SensorNetworkPage from './SensorNetworkPage.tsx'

function App() {

  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/monitoramento" element={<MonitoringPage />} />
            <Route path="/monitoramento/redes-sensores" element={<SensorNetworkPage />} />
          </Routes>
        </Router>
        
  )
}

export default App

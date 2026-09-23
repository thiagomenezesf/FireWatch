import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import HomePage from './HomePage.tsx'
import MonitoringPage from './MonitoringPage.tsx'
import SensorNetworkPage from './SensorNetworkPage.tsx'
import MonitoringPageTeste from './MonitoringPageTeste.tsx'
import MonitoringDetailsPage from './MonitoringDetails.tsx'

function App() {

  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/monitoramento" element={<MonitoringPage />} />
            <Route path="/monitoramento/redes-sensores" element={<SensorNetworkPage />} />
            <Route path="/monitoramentoTeste" element={<MonitoringPageTeste />} />
            <Route path="/monitoramento/regiao/:regiao" element={<MonitoringDetailsPage />} />
          </Routes>
        </Router>
        
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import './App.css'
import { IniciarSesion } from './components/IniciarSesion'
import { Inicio } from './components/Inicio'
import { Registrarse } from './components/Registrarse'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IniciarSesion />} />
      <Route path="/Registrarse" element={<Registrarse />} />
      <Route path="/Inicio" element={<Inicio />} />
    </Routes>
  )
}

export default App

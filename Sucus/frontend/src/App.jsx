import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Deseados } from './components/Deseados'
import { Detalles } from './components/Detalles'
import { IniciarSesion } from './components/IniciarSesion'
import { Inicio } from './components/Inicio'
import { Perfil } from './components/Perfil'
import { Registrarse } from './components/Registrarse'
import { Visitados } from './components/Visitados'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IniciarSesion />} />
      <Route path="/Registrarse" element={<Registrarse />} />
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Visitados" element={<Visitados />} />
      <Route path="/Deseados" element={<Deseados />} />
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/Detalles" element={<Detalles />} />
    </Routes>
  )
}

export default App

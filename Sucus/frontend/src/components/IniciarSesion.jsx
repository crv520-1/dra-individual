import axios from "axios";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './IniciarSesion.css';

export const IniciarSesion = () => {
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !contrasena) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    axios.get('http://localhost:3000/api/usuario/nombre/${nombre}')
      .then((response) => {
        if (response.data.length > 0) {
          const usuarioData = response.data[0];
          if (usuarioData.contrasena === contrasena) {
            alert('Inicio de sesión exitoso');
            // Aquí puedes redirigir al usuario a otra página o realizar otras acciones
          } else {
            alert('Contraseña incorrecta');
          }
        } else {
          alert('Usuario no encontrado');
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      });
  }

  return (
    <div className="login-container">
        <img src="/logo/logo_sucus.png" alt="Logo Sucus" className="logo" />
        <h1 className="login-title">Iniciar Sesión</h1>
        <form className="login-form">
            <input type="text" placeholder="Usuario" className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="password" placeholder="Contraseña" className="password-field" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            <button type="submit" className="login-button" onClick={handleSubmit}>Iniciar Sesión</button>
        </form>
        <p className="register-text">¿No tienes una cuenta? <Link to="/Registrarse" className="register-link">Regístrate aquí</Link></p>
    </div>
  )
}

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Registrarse.css';

export const Registrarse = () => {
  const [contrasena, setContrasena] = useState('');
  const [contrasenaRepetida, setContrasenaRepetida] = useState('');
  const [nombre, setNombre] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('/fotoPerfil/tintin.png');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !contrasena || !contrasenaRepetida || !fotoPerfil) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (contrasena !== contrasenaRepetida) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    let newUsuario = {
        nombreUsuario: nombre,
        contrasena: contrasena,
        fotoPerfil: fotoPerfil
    }
    try {
        const response = await axios.post('http://localhost:3000/api/usuario', newUsuario);
        if (response.data && response.data.id) {
            localStorage.setItem('usuario', JSON.stringify(newUsuario.idUsuario));
            navigate('/Inicio');
        } else {
            alert('Error al registrar el usuario. Inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario. Inténtalo de nuevo más tarde.');
    }
  }

  const opcionesImagenes = [
    { src: "/fotoPerfil/aviones.png", alt: "Aviones" },
    { src: "/fotoPerfil/cohete.png", alt: "Cohete" },
    { src: "/fotoPerfil/nathan_drake.png", alt: "Nathan Drake" },
    { src: "/fotoPerfil/tadeo_jones.png", alt: "Tadeo Jones" },
    { src: "/fotoPerfil/tintin.png", alt: "Tintin" },
    { src: "/fotoPerfil/willy_fog.png", alt: "Willy Fog" },
  ];

  return (
    <div className="login-container">
        <img src="/logo/logo_sucus.png" alt="Logo Sucus" className="logo" />
        <h1 className="login-title">Registrarse</h1>
        <form className="register-form">
            <div className='register-row'>
                <div className="image-dropdown-container">
                    <img src={fotoPerfil} alt="Foto de perfil seleccionada" className="selected-image" />
                    <select className="image-dropdown" value={fotoPerfil} onChange={(e) => setFotoPerfil(e.target.value)} >
                        {opcionesImagenes.map((imagen, index) => (
                            <option key={index} value={imagen.src}>
                                {imagen.alt}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='register-column'>
                    <input type="text" placeholder="Usuario" className="input-field-register" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <input type="password" placeholder="Contraseña" className="password-field-register" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                    <input type="password" placeholder="Repite la contraseña" className="password-field-register" value={contrasenaRepetida} onChange={(e) => setContrasenaRepetida(e.target.value)} />
                </div>
            </div>
            <button type="submit" className="login-button" onClick={handleSubmit}>Registrarse</button>
        </form>
        <p className="register-text">¿Ya tienes una cuenta? <a href="/" className="register-link">Inicia sesión aquí</a></p>
    </div>
  )
}

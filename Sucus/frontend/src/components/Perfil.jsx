import axios from 'axios';
import { LogOut, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Inicio.css';
import './Perfil.css';
import './Registrarse.css';

export const Perfil = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [contrasena, setContrasena] = useState('');
  const [contrasenaRepetida, setContrasenaRepetida] = useState('');
  const [nombre, setNombre] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
        const idUsuario = JSON.parse(localStorage.getItem('usuario'));
        if (!idUsuario) {
            navigate('/');
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.data != null) {
                    setUsuario(response.data);
                    setNombre(response.data.nombreUsuario);
                    setFotoPerfil(response.data.fotoPerfil);
                    setContrasena(response.data.contrasena);
                    setContrasenaRepetida(response.data.contrasena);
                } else {
                    alert('Error al obtener los datos del usuario porque da null el response.data.');
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                alert('Error al obtener los datos del usuario.');
            }
        }
    }
    obtenerUsuario()
  }, [navigate]);

  const opcionesImagenes = [
    { src: "/fotoPerfil/aviones.png", alt: "Aviones" },
    { src: "/fotoPerfil/cohete.png", alt: "Cohete" },
    { src: "/fotoPerfil/nathan_drake.png", alt: "Nathan Drake" },
    { src: "/fotoPerfil/tadeo_jones.png", alt: "Tadeo Jones" },
    { src: "/fotoPerfil/tintin.png", alt: "Tintin" },
    { src: "/fotoPerfil/willy_fog.png", alt: "Willy Fog" },
  ];

  const handleCancelar = (e) => {
    e.preventDefault();
    navigate('/Inicio');
  }

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (contrasena !== contrasenaRepetida) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
    }
    
    if (nombre !== usuario.nombreUsuario) {
        try {
            const checkResponse = await axios.get(`http://localhost:3000/api/usuario/nombre/${nombre}`);
            if (checkResponse.data && checkResponse.data.idUsuario !== usuario.idUsuario) {
                alert('El nombre de usuario ya está en uso. Por favor, elige otro.');
                return;
            }
        } catch (checkError) {
            if (checkError.response && checkError.response.status !== 404) {
                console.error('Error al verificar el nombre de usuario:', checkError);
                alert('Error al verificar el nombre de usuario. Inténtalo de nuevo más tarde.');
                return;
            }
        }
    }
    
    let newUsuario = {
        nombreUsuario: nombre,
        contrasena: contrasena,
        fotoPerfil: fotoPerfil
    }
    
    try {
        const response = await axios.put(`http://localhost:3000/api/usuario/${usuario.idUsuario}`, newUsuario);
        if (response.data) {
            navigate('/Inicio');
        } else {
            alert('Error al intentar guardar los cambios.');
        }
    } catch (error) {
        console.error('Error al guardar los cambios del usuario:', error);
        alert('Error al intentar guardar los cambios en el perfil. Inténtalo de nuevo más tarde.');
    }
  }

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem('usuario');
    navigate('/');
  }

  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        try {
            const response = await axios.delete(`http://localhost:3000/api/usuario/${usuario.idUsuario}`);
            if (response.data) {
                localStorage.removeItem('usuario');
                navigate('/');
            } else {
                alert('Error al intentar eliminar la cuenta.');
            }
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            alert('Error al intentar eliminar la cuenta. Inténtalo de nuevo más tarde.');
        }
    }
  }

  return (
    <div className='login-container'>
        <div className='container-banner'>
            <img src="/logo/logo_sucus.png" alt="Logo Sucus" className='imagen-logo' />
            <div className='container-texto'>
                <button className='boton-secundario' onClick={() => navigate('/Visitados')}>Visitados</button>
                <button className='boton-secundario' onClick={() => navigate('/Inicio')}>Inicio</button>
                <button className='boton-secundario' onClick={() => navigate('/Deseados')}>Pendientes</button>
            </div>
            {usuario && (
                <button className='boton-perfil' onClick={() => {navigate('/Perfil')}}>
                    <img src={usuario.fotoPerfil} alt="Perfil" />
                </button>
            )}
        </div>
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
                <div className='container-cerrar'>
                    <LogOut className='iconos-cerrar' onClick={handleCerrarSesion}/>
                    <Trash2 className='iconos-cerrar' onClick={handleEliminarCuenta}/>
                </div>
            </div>
            <div className='container-botones-perfil'>
                <button type="submit" className="boton-cancelar" onClick={handleCancelar}>Cancelar</button>
                <button type="submit" className="boton-guardar" onClick={handleGuardar}>Guardar</button>
            </div>
        </form>
    </div>
  )
}

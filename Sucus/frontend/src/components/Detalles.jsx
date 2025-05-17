import axios from 'axios';
import { MapPin, MapPinCheck, MapPinMinus, MapPinPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './Detalles.css';
import './IniciarSesion.css';
import './Inicio.css';

export const Detalles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [pais, setPais] = useState(null);

  useEffect(() => {
    // Obtener el país de location.state
    if (location.state && location.state.pais) {
      setPais(location.state.pais);
    } else {
      // Manejar el caso donde no se ha pasado un país
      alert('No se ha seleccionado ningún país');
      navigate('/Inicio');
    }

    const obtenerUsuario = async () => {
        const idUsuario = JSON.parse(localStorage.getItem('usuario'));
        if (!idUsuario) {
            navigate('/');
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.data != null) {
                    setUsuario(response.data);
                } else {
                    alert('Error al obtener los datos del usuario porque da null el response.data.');
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                alert('Error al obtener los datos del usuario.');
            }
        }
    }
    obtenerUsuario();
  }, [navigate, location]);

  // Verifica si pais existe antes de mostrar sus datos
  return (
    <div className='login-container'>
        <div className='container-banner'>
            <img src="/logo/logo_sucus.png" alt="Logo Sucus" className='imagen-logo' />
            <div className='container-texto'>
                <button className='boton-secundario' onClick={() => navigate('/Visitados')}>Visitados</button>
                <button className='boton-principal' onClick={() => navigate('/Inicio')}>Inicio</button>
                <button className='boton-secundario' onClick={() => navigate('/Deseados')}>Pendientes</button>
            </div>
            {usuario && (
                <button className='boton-perfil' onClick={() => {navigate('/Perfil')}}>
                    <img src={usuario.fotoPerfil} alt="Perfil" />
                </button>
            )}
        </div>
        
        {pais ? (
            <div className='detalles-pais'>
                <img src={pais.flags.svg} alt={pais.translations.spa.common} className='pais-flag-detalles' />
                <div>
                    <div className='container-datos-generales'>
                        <MapPin className='iconos'/>
                        <MapPinCheck className='iconos'/>
                        <h2 className="titulo-pais">{pais.translations.spa.common}</h2>
                        <MapPinPlus className='iconos'/>
                        <MapPinMinus className='iconos'/>
                    </div>
                    <div className='container-datos'>
                        <p>Capital: {pais.capital}</p>
                        {pais.independent == true ? (
                            <p>Independiente: Sí</p>
                        ) : (
                            <p>Independiente: No</p>
                        )}
                        <p>Región: {pais.region}</p>
                        <p>Subregión: {pais.subregion}</p>
                    </div>
                </div>
                <img src={pais.coatOfArms.svg} className='pais-coat-of-arms-detalles' />
            </div>
        ) : (
            <p>Cargando información del país...</p>
        )}
    </div>
  )
}

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
  const [paisDB, setPaisDB] = useState(null);
  const [visitado, setVisitado] = useState(false);
  const [pendiente, setPendiente] = useState(false);

  useEffect(() => {
    if (location.state && location.state.pais) {
      setPais(location.state.pais);
    } else {
      alert('No se ha seleccionado ningún país');
      navigate('/Inicio');
    }

    console.log('Pais recibido:', location.state.pais);
    console.log('País en estado:', pais);

    const obtenerDatosUsuario = async () => {
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
    obtenerDatosUsuario();
  }, [navigate, location, pais]);

  useEffect(() => {
    const obtenerDatosPaisYScraping = async () => {
        if (pais) {
            try {
                let nombrePais = pais.translations.spa.common;
                const responsePais = await axios.get(`http://localhost:3000/api/paises/nombre/${nombrePais}`);
                if (responsePais.data != null) {
                    setPaisDB(responsePais.data);
                } else {
                    alert('Error al obtener los datos del país porque da null el response.data.');
                }
            } catch (error) {
                console.error('Error al obtener los datos del país:', error);
                alert('Error al obtener los datos del país.');
            }
        }
    };

    obtenerDatosPaisYScraping();
  }, [pais]);

  useEffect(() => {
    const verificarEstado = async () => {
        if (usuario && paisDB) {
            try {
                const responseVisitado = await axios.get(`http://localhost:3000/api/visitado/check/${usuario.idUsuario}/${paisDB.idPaises}`);
                if (responseVisitado.data != null) {
                    setVisitado(responseVisitado.data);
                } else {
                    setVisitado(false);
                }
            } catch (error) {
                console.error('Error al obtener el estado de visitado:', error);
            }

            try {
                const responsePendiente = await axios.get(`http://localhost:3000/api/wishlist/check/${usuario.idUsuario}/${paisDB.idPaises}`);
                if (responsePendiente.data != null) {
                    setPendiente(responsePendiente.data);
                } else {
                    setPendiente(false);
                }
            } catch (error) {
                console.error('Error al obtener el estado de pendiente:', error);
            }
        }
    };

    verificarEstado();
  }, [usuario, paisDB]);

  const handleVisitado = async () => {
    if (visitado) {
        try {
            const response = await axios.delete(`http://localhost:3000/api/visitado/${visitado.idvisitado}`);
            if (response.status === 200) {
                setVisitado(false);
            } else {
                alert('Error al eliminar el país de la lista de visitados.');
            }
        } catch (error) {
            console.error('Error al eliminar el país de la lista de visitados:', error);
        }
    } else {
        try {
            const response = await axios.post('http://localhost:3000/api/visitado', {
                idUser: usuario.idUsuario,
                idPais: paisDB.idPaises
            });
            if (response.status === 201) {
                if (response.data && response.data.idvisitado) {
                    setVisitado(response.data);
                } else {
                    try {
                        const checkResponse = await axios.get(`http://localhost:3000/api/visitado/check/${usuario.idUsuario}/${paisDB.idPaises}`);
                        if (checkResponse.data && typeof checkResponse.data === 'object' && checkResponse.data.idvisitado) {
                            setVisitado(checkResponse.data);
                        } else {
                            setVisitado(true);
                        }
                    } catch (fetchError) {
                        console.error('Error al re-verificar estado de visitado tras añadir:', fetchError);
                        setVisitado(true);
                        alert('Error al verificar el estado tras añadir el país a visitados.');
                    }
                }
            } else {
                alert('Error al añadir el país a la lista de visitados.');
            }
        } catch (error) {
            console.error('Error al añadir el país a la lista de visitados:', error);
        }
    }
  }

  const handlePendiente = async () => {
    if (pendiente) {
        try {
            const response = await axios.delete(`http://localhost:3000/api/wishlist/${pendiente.idwishlist}`);
            if (response.status === 200) {
                setPendiente(false);
            } else {
                alert('Error al eliminar el país de la lista de pendientes.');
            }
        } catch (error) {
            console.error('Error al eliminar el país de la lista de pendientes:', error);
        }
    } else {
        try {
            const response = await axios.post('http://localhost:3000/api/wishlist', {
                idUsuarios: usuario.idUsuario,
                idCountry: paisDB.idPaises
            });
            if (response.status === 201) {
                if (response.data && response.data.idwishlist) {
                    setPendiente(response.data);
                } else {
                    try {
                        const checkResponse = await axios.get(`http://localhost:3000/api/wishlist/check/${usuario.idUsuario}/${paisDB.idPaises}`);
                        if (checkResponse.data && typeof checkResponse.data === 'object' && checkResponse.data.idwishlist) {
                            setPendiente(checkResponse.data);
                        } else {
                            setPendiente(true);
                        }
                    } catch (fetchError) {
                        console.error('Error al re-verificar estado de visitado tras añadir:', fetchError);
                        setPendiente(true);
                        alert('Error al verificar el estado tras añadir el país a visitados.');
                    }
                }
            } else {
                alert('Error al añadir el país a la lista de pendientes.');
            }
        } catch (error) {
            console.error('Error al añadir el país a la lista de pendientes:', error);
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
        
        {pais ? (
            <div className='detalles-pais'>
                <img src={pais.flags.svg} alt={pais.translations.spa.common} className='pais-flag-detalles' />
                <div>
                    <div className='container-datos-generales'>
                        {visitado ? (
                            <MapPin className='iconos' onClick={handleVisitado}/>
                        ) : (
                            <MapPinCheck className='iconos' onClick={handleVisitado}/>
                        )
                        }
                        <h2 className="titulo-pais">{pais.translations.spa.common}</h2>
                        {pendiente ? (
                            <MapPinMinus className='iconos' onClick={handlePendiente}/>
                        ) : (
                            <MapPinPlus className='iconos' onClick={handlePendiente}/>
                        )}
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

        {paisDB ? (
            <div className='container-informacion'>
                <h2>Información del país</h2>
                <p>{paisDB.scraping}</p>
            </div>
        ) : (
            <p className='texto-cargando'>Cargando información del país...</p>
        )}
    </div>
  )
}

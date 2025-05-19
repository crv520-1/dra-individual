import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Inicio.css';

export const Deseados = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [paisesPendientes, setPaisesPendientes] = useState([]);

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

  useEffect(() => {
    const obtenerPaisesPendientes = async () => {
        if (usuario) {
            try {
                const response = await axios.get(`http://localhost:3000/api/wishlist/user/${usuario.idUsuario}`);
                if (response.data != null) {
                    const paisPromises = response.data.map(async (pais) => {
                        const responsePais = await axios.get(`http://localhost:3000/api/paises/${pais.idCountry}`);
                        return responsePais.data.cca2;
                    });

                    const cca2Array = await Promise.all(paisPromises);
                    const cca2String = cca2Array.join(',');

                    if (cca2String) {
                        try {
                            const responsePaises = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${cca2String}`);
                            if (responsePaises.data != null) {
                                setPaisesPendientes(responsePaises.data);
                            } else {
                                alert('Error al obtener los paises pendientes porque da null el responsePaises.data.');
                                console.log('Error al obtener los paises pendientes porque da null el responsePaises.data.');
                            }
                        } catch (error) {
                            console.error('Error al obtener los paises pendientes:', error);
                            alert('Error al obtener los paises pendientes por alphaCodes.');
                        }
                    } else {
                        setPaisesPendientes([]);
                    }
                } else {
                    setPaisesPendientes([]);
                    alert('Error al obtener los paises pendientes porque da null el response.data.');
                    console.log('Error al obtener los paises pendientes porque da null el response.data.');
                }
            } catch (error) {
                console.error('Error al obtener los paises pendientes:', error);
                alert('Error al obtener los paises pendientes.');
            }
        }
    }
    obtenerPaisesPendientes();
  }, [usuario]);

  return (
    <div className='login-container'>
        <div className='container-banner'>
            <img src="/logo/logo_sucus.png" alt="Logo Sucus" className='imagen-logo' />
            <div className='container-texto'>
                <button className='boton-secundario' onClick={() => navigate('/Visitados')}>Visitados</button>
                <button className='boton-secundario' onClick={() => navigate('/Inicio')}>Inicio</button>
                <button className='boton-principal' onClick={() => navigate('/Deseados')}>Pendientes</button>
            </div>
            {usuario && (
                <button className='boton-perfil' onClick={() => {navigate('/Perfil')}}>
                    <img src={usuario.fotoPerfil} alt="Perfil" />
                </button>
            )}
        </div>
        <div className='container-paises'>
            {paisesPendientes.map((pais) => (
                <button key={pais.cca2} className='pais-card' onClick={() => navigate('/Detalles', { state: { pais } })}>
                    <img src={pais.flags.svg} alt={pais.translations.spa.common} className='pais-flag' />
                    <p>{pais.capital && pais.capital[0]}, {pais.translations.spa.common}, {pais.region}</p>
                </button>
            ))}
        </div>
    </div>
  )
}

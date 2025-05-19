import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Inicio.css';

export const Visitados = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [paisesVisitados, setPaisesVisitados] = useState([]);

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
    const obtenerPaisesVisitados = async () => {
        if (usuario) {
            try {
                const response = await axios.get(`http://localhost:3000/api/visitado/usuario/${usuario.idUsuario}`);
                if (response.data != null) {
                    const paisPromises = response.data.map(async (pais) => {
                        const responsePais = await axios.get(`http://localhost:3000/api/paises/${pais.idPais}`);
                        return responsePais.data.cca2;
                    });

                    const cca2Array = await Promise.all(paisPromises);
                    const cca2String = cca2Array.join(',');

                    if (cca2String) {
                        try {
                            console.log('cca2String:', cca2String);
                            console.log(`https://restcountries.com/v3.1/alpha?codes=${cca2String}`);
                            const responsePaises = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${cca2String}`);
                            if (responsePaises.data != null) {
                                setPaisesVisitados(responsePaises.data);
                            } else {
                                alert('Error al obtener los paises visitados porque da null el responsePaises.data.');
                            }
                        } catch (error) {
                            console.error('Error al obtener los paises visitados:', error);
                            alert('Error al obtener los paises visitados por alphaCodes.');
                        }
                    } else {
                        setPaisesVisitados([]);
                    }
                } else {
                    setPaisesVisitados([]);
                    alert('Error al obtener los paises visitados porque da null el response.data.');
                }
            } catch (error) {
                console.error('Error al obtener los paises visitados:', error);
                alert('Error al obtener los paises visitados.');
            }
        }
    }
    obtenerPaisesVisitados();
  }, [usuario]);

  return (
    <div className='login-container'>
        <div className='container-banner'>
            <img src="/logo/logo_sucus.png" alt="Logo Sucus" className='imagen-logo' />
            <div className='container-texto'>
                <button className='boton-principal' onClick={() => navigate('/Visitados')}>Visitados</button>
                <button className='boton-secundario' onClick={() => navigate('/Inicio')}>Inicio</button>
                <button className='boton-secundario' onClick={() => navigate('/Deseados')}>Pendientes</button>
            </div>
            {usuario && (
                <button className='boton-perfil' onClick={() => {navigate('/Perfil')}}>
                    <img src={usuario.fotoPerfil} alt="Perfil" />
                </button>
            )}
        </div>
        <div className='container-paises'>
            {paisesVisitados.map((pais) => (
                <button key={pais.cca2} className='pais-card' onClick={() => navigate('/Detalles', { state: { pais } })}>
                    <img src={pais.flags.svg} alt={pais.translations.spa.common} className='pais-flag' />
                    <p>{pais.capital && pais.capital[0]}, {pais.translations.spa.common}, {pais.region}</p>
                </button>
            ))}
        </div>
    </div>
  )
}

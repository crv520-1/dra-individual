import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [paises, setPaises] = useState([]);

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
        try {
            axios.get('https://restcountries.com/v3.1/all').then(response => {
                setPaises(response.data);
            }).catch(error => {
                console.error('Error fetching the country data:', error);
            });
        } catch (error) {
            console.error('Error al obtener los datos de los paises:', error);
            alert('Error al obtener los datos de los paises.');
        }
    }
    obtenerUsuario()
  }, [navigate]);

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
        <div className='container-paises'>
            {paises.map((pais) => (
                <button key={pais.id} className='pais-card'>
                    <img src={pais.flags.svg} alt={pais.translations.spa} className='pais-flag' />
                    <p>{pais.capital}, {pais.translations.spa.common}, {pais.region}</p>
                </button>
            ))}
        </div>
    </div>
  )
}

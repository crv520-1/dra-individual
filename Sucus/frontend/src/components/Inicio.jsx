import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './IniciarSesion.css';
import './Inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [paises, setPaises] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [continentesDisponibles, setContinentesDisponibles] = useState([]);
  const [continentesSeleccionados, setContinentesSeleccionados] = useState(new Set());

  useEffect(() => {
    const obtenerDatos = async () => {
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
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,capital,translations,region,subregion,independent,coatOfArms,cca3');
            const paisesData = response.data;
            setPaises(paisesData);

            const regionesUnicas = [...new Set(paisesData.map(pais => pais.region).filter(region => region))];
            setContinentesDisponibles(regionesUnicas.sort());
            setContinentesSeleccionados(new Set(regionesUnicas));

        } catch (error) {
            console.error('Error fetching the country data:', error);
            alert('Error al obtener los datos de los paises.');
        }
    }
    obtenerDatos();
  }, [navigate]);

  const handleToggleContinente = (continente) => {
    setContinentesSeleccionados(prevSeleccionados => {
      const nuevosSeleccionados = new Set(prevSeleccionados);
      if (nuevosSeleccionados.has(continente)) {
        nuevosSeleccionados.delete(continente);
      } else {
        nuevosSeleccionados.add(continente);
      }
      return nuevosSeleccionados;
    });
  };

  const paisesFiltrados = paises.filter(pais => {
    const coincideBusqueda = pais.translations.spa.common.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideContinente = continentesSeleccionados.size === 0 || continentesSeleccionados.has(pais.region);
    return coincideBusqueda && coincideContinente;
  });

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
        <div className='container-filtros'>
            {continentesDisponibles.map(continente => (
                <button key={continente} onClick={() => handleToggleContinente(continente)} className={`boton-continente ${continentesSeleccionados.has(continente) ? 'activo' : ''}`}>
                    {continente}
                </button>
            ))}
            <input type="text" placeholder="Buscar país..." className="input-buscador" value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)}/>
        </div>
        <div className='container-paises'>
            {paisesFiltrados.map((pais) => (
                <button key={pais.cca3} className='pais-card' onClick={() => navigate('/Detalles', { state: { pais } })}>
                    <img src={pais.flags.svg} alt={pais.translations.spa.common} className='pais-flag' />
                    <p>{pais.capital && pais.capital[0]}, {pais.translations.spa.common}, {pais.region}</p>
                </button>
            ))}
        </div>
    </div>
  )
}

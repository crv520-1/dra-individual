const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const axios = require('axios');
const db = require('../models/paisesModel');

async function almacenarPaises() {

    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const paises = await Promise.all(response.data.map(async (apiPais) => {
            const url = await getURLScraping(apiPais);
            return {
                urlScraping: url,
                nombrePais: apiPais.translations.spa.common
            };
        }));

        // Eliminar todos los registros existentes en la tabla paises
        await db.deleteAllPaises();

        for (const pais of paises) {
            await db.createPais(pais);
        }
        
        console.log('Todos los países han sido almacenados exitosamente.');

    } catch (error) {
        console.error('Error al obtener los datos de los países:', error);
    }
}

async function getURLScraping(pais) {
    if (pais.translations.spa.common === "Alandia" || pais.translations.spa.common === "Palestina") {
        return "https://es.wikipedia.org/wiki/" + pais.translations.spa.official;
    }
    return "https://es.wikipedia.org/wiki/" + pais.translations.spa.common;
}

almacenarPaises();
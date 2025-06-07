const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const axios = require('axios');
const db = require('../models/paisesModel');
const puppeteer = require('puppeteer');

// Función de scraping (similar a la anterior)
async function scrapeWikipediaFirstParagraph(url) {
    if (!url) {
        console.warn(`URL de scraping no definida. Saltando scraping.`);
        return null;
    }
    let browser;
    try {
        console.log(`Iniciando scraping para: ${url}`);
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

        await page.waitForSelector('#mw-content-text .mw-parser-output', { timeout: 60000 });

        const firstParagraph = await page.evaluate(() => {
            const parserOutput = document.querySelector('#mw-content-text .mw-parser-output');
            if (!parserOutput) return null;

            const paragraphs = parserOutput.querySelectorAll('p');
            for (const p of paragraphs) {
                // Filtros para evitar párrafos no deseados (infoboxes, notas, etc.)
                if (p.closest('table.infobox, table.metadata, .hatnote, .rellink, .noprint, .gallery, .thumb, .mw-references, .reference, .reflist, .IPA')) {
                    continue;
                }
                if (p.classList.contains('mw-empty-elt')) {
                    continue;
                }
                // Evitar párrafos que solo contienen coordenadas
                if (p.querySelector('#coordinates') || p.querySelector('.geo-nondefault')) {
                    continue;
                }
                const text = p.textContent.trim();
                // Limpiar texto de citas como [1], [2], [cita requerida]
                const cleanedText = text.replace(/\[\d+\]/g, '').replace(/\[cita requerida\]/gi, '').trim();
                if (cleanedText) {
                    return cleanedText;
                }
            }
            return null;
        });
        
        if (!firstParagraph) {
            console.warn(`No se encontró el primer párrafo útil para: ${url}`);
        }
        return firstParagraph;

    } catch (error) {
        console.error(`Error al scrapear la página de Wikipedia (${url}):`, error.message);
        return null;
    } finally {
        if (browser) {
            await browser.close();
            console.log(`Navegador cerrado para: ${url}`);
        }
    }
}

async function almacenarPaises() {
    try {
        console.log('Obteniendo lista de países desde la API...');
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,translations,cca2');
        const apiPaises = response.data;
        console.log(`Se encontraron ${apiPaises.length} países. Procesando secuencialmente...`);

        const paisesParaDB = [];

        for (let i = 0; i < apiPaises.length; i++) {
            const apiPais = apiPaises[i];
            const nombreComunSpa = apiPais.translations.spa.common;
            console.log(`Procesando país ${i + 1}/${apiPaises.length}: ${nombreComunSpa}`);

            const urlScraping = await getURLScraping(apiPais);
            let scraping = null;

            if (urlScraping) {
                // Pausa opcional para no saturar Wikipedia o tu red
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                scraping = await scrapeWikipediaFirstParagraph(urlScraping);
                if (scraping) {
                    console.log(`Descripción obtenida para ${nombreComunSpa}.`);
                } else {
                    console.log(`No se pudo obtener descripción para ${nombreComunSpa}.`);
                }
            } else {
                console.warn(`No se generó URL de scraping para ${nombreComunSpa}.`);
            }
            
            paisesParaDB.push({
                urlScraping: urlScraping,
                nombrePais: nombreComunSpa,
                cca2: apiPais.cca2,
                scraping: scraping !== null ? scraping : ''
            });
        }

        console.log('Eliminando registros existentes en la tabla paises...');
        await db.deleteAllPaises();
        console.log('Registros eliminados. Almacenando nuevos países...');

        for (const pais of paisesParaDB) {
            await db.createPais(pais);
        }
        
        console.log('Todos los países han sido procesados y almacenados exitosamente.');

    } catch (error) {
        console.error('Error en el proceso de almacenar los datos de los países:', error);
    }
}

async function getURLScraping(pais) {
    const nombreComun = pais.translations.spa.common;
    const nombreOficial = pais.translations.spa.official;

    // Casos especiales
    if (nombreComun === "Alandia" || nombreComun === "Palestina" || nombreComun === "Islas Tokelau" || nombreComun === "Congo (Rep. Dem.)") {
        return "https://es.wikipedia.org/wiki/" + encodeURIComponent(nombreOficial);
    }
    if (nombreComun === "Guadalupe") {
        return "https://es.wikipedia.org/wiki/Guadalupe_(Francia)";
    }
    if (nombreComun === "Islas Svalbard y Jan Mayen") {
        return "https://es.wikipedia.org/wiki/Svalbard_y_Jan_Mayen";
    }
    if (nombreComun === "Islas Cocos o Islas Keeling") {
        return "https://es.wikipedia.org/wiki/Islas_Cocos";
    }
    if (nombreComun === "Islas Vírgenes del Reino Unido") {
        return "https://es.wikipedia.org/wiki/Islas_Vírgenes_Británicas";
    }

    // Caso general
    return "https://es.wikipedia.org/wiki/" + encodeURIComponent(nombreComun);
}

almacenarPaises().then(() => {
    console.log('Proceso de almacenamiento de países finalizado.');
}).catch(error => {
    console.error('Error fatal en el proceso de almacenamiento de países:', error);
});
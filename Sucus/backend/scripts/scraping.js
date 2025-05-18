const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

async function scrapeWikipediaFirstParagraph(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // Puedes ponerlo en false para ver el navegador
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necesario en algunos entornos
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Espera a que el contenido principal esté cargado
    await page.waitForSelector('#mw-content-text .mw-parser-output', { timeout: 60000 }); // Aumentado el timeout

    const firstParagraph = await page.evaluate(() => {
      const parserOutput = document.querySelector('#mw-content-text .mw-parser-output');
      if (!parserOutput) {
        return null;
      }

      // Select all <p> elements within the main content area
      const paragraphs = parserOutput.querySelectorAll('p');
      
      for (const p of paragraphs) {
        // Skip paragraphs that are inside common non-content structures:
        // infoboxes, metadata tables, hatnotes, rellinks, noprint sections, image galleries, thumbnails, or reference sections.
        if (p.closest('table.infobox, table.metadata, .hatnote, .rellink, .noprint, .gallery, .thumb, .mw-references')) {
          continue;
        }
        
        // Skip paragraphs explicitly marked as empty (like <p class="mw-empty-elt"></p>)
        if (p.classList.contains('mw-empty-elt')) {
          continue;
        }

        const text = p.textContent.trim();
        // If the trimmed text is not empty, we've found our first content paragraph
        if (text) {
          return text;
        }
      }
      
      // If no suitable paragraph was found after checking all candidates
      return null;
    });

    return firstParagraph;
  } catch (error) {
    console.error(`Error scraping Wikipedia page (${url}):`, error);
    // Considera devolver un objeto de error más específico o lanzar el error
    // para que el manejador de rutas pueda enviar una respuesta de error adecuada.
    return { error: true, message: error.message, url };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ruta para hacer scraping de una URL de Wikipedia
router.get('/scrape-wikipedia', async (req, res) => {
  const { url } = req.query; // Obtiene la URL de los query params (ej: /scrape-wikipedia?url=https://...)

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Scraping URL: ${url}`);
    const paragraph = await scrapeWikipediaFirstParagraph(url);

    if (paragraph && paragraph.error) {
        console.error(`Scraping failed for ${url}: ${paragraph.message}`);
        // Decide qué estado HTTP enviar en caso de error de scraping
        return res.status(500).json({ error: 'Failed to scrape Wikipedia page', details: paragraph.message });
    }

    if (paragraph) {
      res.json({ firstParagraph: paragraph });
    } else {
      res.status(404).json({ error: 'Could not retrieve the first paragraph from the provided URL.' });
    }
  } catch (error) {
    console.error('Error in /scrape-wikipedia route:', error);
    res.status(500).json({ error: 'Internal server error while scraping' });
  }
});

module.exports = router;
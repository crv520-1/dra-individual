const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

async function scrapeWikipediaFirstParagraph(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#mw-content-text .mw-parser-output', { timeout: 60000 });

    const firstParagraph = await page.evaluate(() => {
      const parserOutput = document.querySelector('#mw-content-text .mw-parser-output');
      if (!parserOutput) {
        return null;
      }

      const paragraphs = parserOutput.querySelectorAll('p');
      
      for (const p of paragraphs) {
        if (p.closest('table.infobox, table.metadata, .hatnote, .rellink, .noprint, .gallery, .thumb, .mw-references')) {
          continue;
        }
        
        if (p.classList.contains('mw-empty-elt')) {
          continue;
        }

        const text = p.textContent.trim();
        if (text) {
          return text;
        }
      }
      
      return null;
    });

    return firstParagraph;
  } catch (error) {
    console.error(`Error scraping Wikipedia page (${url}):`, error);
    return { error: true, message: error.message, url };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

router.get('/scrape-wikipedia', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Scraping URL: ${url}`);
    const paragraph = await scrapeWikipediaFirstParagraph(url);

    if (paragraph && paragraph.error) {
        console.error(`Scraping failed for ${url}: ${paragraph.message}`);
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
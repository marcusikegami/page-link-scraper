const fs = require('fs');
const puppeteer = require('puppeteer');

// Initialize a Set to track visited URLs
const visitedUrls = new Set();

// Base domain for the scraper
const baseDomain = new URL('https://www.summerhaysmusic.com').origin;

/**
 * Function to scrape links from a webpage.
 * @param {string} url - The URL to scrape.
 * @param {object} browser - The Puppeteer browser instance.
 * @param {string} origin - The URL where the current link was found (for tree structure).
 */
async function scrapePage(url, browser, origin = null) {
    try {
        // Mark the URL as visited
        visitedUrls.add(url);

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract all links from the page
        const links = await page.$$eval('a', anchors =>
            anchors
                .map(anchor => anchor.href)
                .filter(href => href.startsWith('http'))
        );

        // Write links to a file in tree structure
        const uniqueLinks = links.filter(link => !visitedUrls.has(link));
        uniqueLinks.forEach(link => {
            if (origin) {
                fs.appendFileSync('links.txt', `${origin} -> ${link}\n`);
            } else {
                fs.appendFileSync('links.txt', `${url} -> ${link}\n`);
            }
        });

        console.log(`Scraped ${uniqueLinks.length} links from ${url}`);

        // Close the current page
        await page.close();

        // Recursively visit each new link within the base domain
        for (const link of uniqueLinks) {
            if (!visitedUrls.has(link) && link.startsWith(baseDomain)) {
                await scrapePage(link, browser, url);
            }
        }
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
    }
}

// Starting URL for the scraper
const startUrl = 'https://www.summerhaysmusic.com';

// Main function to start the scraper
(async () => {
    const browser = await puppeteer.launch();
    console.log(`Starting web scraper at ${startUrl}`);
    await scrapePage(startUrl, browser);
    console.log('Scraping complete. Check links.txt for the results.');
    await browser.close();
})();
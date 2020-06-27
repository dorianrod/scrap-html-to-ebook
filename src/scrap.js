const tasks     = require('nodejs-web-scraper');
const sanitize    = require("sanitize-filename");
const fs          = require('fs');

async function scrap(options, callback) { 
    let subdir = options.subdir || sanitize((new Date).toISOString() + " - " + (options.baseSiteUrl || ""));

    const config = {
        concurrency: 1,
        filePath: `${subdir}/files/`,
        logPath: `${subdir}/logs/`,
        ...options
    }

    fs.mkdirSync(config.filePath, { recursive: true });
    fs.mkdirSync(config.logPath, { recursive: true });

    const scraper = new tasks.Scraper(config);

    var {
        pages,
        root
    } = callback({
        scraper,
        tasks
    })

    await scraper.scrape(root);
    return pages;
}

module.exports = {
    scrap
}
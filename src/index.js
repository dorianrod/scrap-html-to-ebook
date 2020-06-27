const {scrap} = require("./scrap");
const {convert} = require("./html2book");
const sanitize  = require("sanitize-filename");
const fs = require('fs');
const afs = fs.promises;
const {sortBy} = require("lodash");

async function scrapToEbook(options) {
    let subdir = "./output/" + sanitize((new Date).toISOString() + " - " + (options.name || ""));

    options= {
        subdir,
        ...options,
    }

    var scrapOptions    = {...options};
    var convertOptions  = {...options};

    //Scrap
    if(!options.pages || !options.subdir) {
        pages = await scrap(scrapOptions, options.scrap)
        savePages(pages, subdir)
    } else {
        pages = options.pages;
    }

    //Convert pages to EPUB (JSON object [{data, title, index},...])
    pages = sortBy(pages, "index");
    convertOptions.content = pages;
    await convert(convertOptions);
}

async function savePages(pages, subdir) {
    var s = JSON.stringify(pages);
    fs.mkdirSync(subdir, { recursive: true });
    var ret = await afs.writeFile(`${subdir}/pages.json`, s, (err) => {
        console.error(err);
    });
    console.log(ret);
}

module.exports = {
    scrapToEbook,
    savePages
}
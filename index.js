const {scrapToEbook}    = require("./src");
const fs                = require('fs');

var options = {
    name: "The-Legendary-Mechanic", //ebook name

    //If subdir and pages are given, scrap is not done, and ebook is generated with pages data.
    /*
    subdir: "output/2020-06-27T110312.056Z - The-Legendary-Mechanic/",
    pages: JSON.parse(fs.readFileSync("output/2020-06-27T110312.056Z - The-Legendary-Mechanic/pages.json")),
    */
    
    //Scrap options
    concurrency: 10, //max number of request at the same time
    baseSiteUrl: "https://m.wuxiaworld.co", //base site url
    startUrl: "https://m.wuxiaworld.co/The-Legendary-Mechanic/all.html", //first url to get
    scrap: ({tasks})=>{

        //Doc: https://www.npmjs.com/package/nodejs-web-scraper and Cheerio

        const {CollectContent, OpenLinks, Root} = tasks;

        const root           = new Root();

        //We request all links which can been got by this path
        const chapters       = new OpenLinks('#chapterlist p a', { name: 'chapter', getPageObject: addPage, condition: (node)=>{
            if(node[0].attribs.href == "#bottom") return false;
            return true;
        }});
        
        //In every chapter, we collect text, title and index number. Index is used to sort chapters
        const data           = new CollectContent('#chaptercontent', { name: 'data', contentType: "html" });
        const title          = new CollectContent('.title', { name: 'title', afterScrape: (wrapper)=>{
            wrapper.data[0] = wrapper.data[0].replace("The Legendary Mechanic", "");
        }});
        const index          = new CollectContent('.title', { name: 'index', afterScrape: (wrapper)=>{
            wrapper.data[0] = parseInt(wrapper.data[0].split(" ")[0]);
        }});

        //Add the operation tree
        root.addOperation(chapters);
        chapters.addOperation(index);
        chapters.addOperation(title);
        chapters.addOperation(data);

        //Important
        return {
            root,
            pages
        };
    }
}

var pages   = [];
function addPage(page) {
    pages.push(page);
    return pages.length;
}

(async function main() {
    await scrapToEbook(options);
})();
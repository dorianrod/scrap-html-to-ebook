# scrap-html-to-ebook
## What's the purpose ?
Generating an Ebook based on a website content.

## How to use it ?
1) Clone the repository and create an "output" directory at the root. Data will be generated into this directory
2) Edit index.js to detail you ebook name and specify how to scrap content
3) Launch command line with "npm run start" to generate ebook.

## How does it work ?
1) Scrapping the website content. I use https://github.com/ibrod83/nodejs-web-scraper (which is based on https://github.com/cheeriojs/cheerio) to generate a JSON object representing the book chapters. 
pages format: [{index: 1, title: "chapter 1", data: "&#60;b>html content&#60;/b> of my chapter"}, {index: 2, title: "chapter 2", ...}, ...]
2) Generating the ebook (EPUB format). I use https://github.com/cyrilis/epub-gen

const request = require('request-promise')
const fs = require('fs')

async function getHtml(url) {
    try {
        const html = await request.get(url)
        return html
    } catch (e) {
        console.error(e)
    }
}

function saveHtmlToFile(html) {
    fs.writeFileSync('./test.html', html)
}

async function main() {
    const html = await getHtml('https://vancouver.craigslist.org/d/apartments-housing-for-rent/search/apa')
    saveHtmlToFile(html)
}

main()
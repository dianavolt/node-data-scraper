const request = require('request-promise')
const cheerio = require('cheerio')

async function main() {
    const result = await request.get('https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000501')
    const $ = await cheerio.load(result)
 
    const scrapedRows = []
    const tableHeaders = []
    $('body > table > tbody > tr').each((index, element) => {
        // if (index === 0) return true // filter out first header row
        if (index === 0) {
            const ths = $(element).find('th')
            ths.each((i, element) => {
                tableHeaders.push($(element).text().toLocaleLowerCase())
            })
            return true // stop going through rest of code
        }
        const tds = $(element).find('td')
        const tableRow = {}
        tds.each((i, element) => {
            tableRow[tableHeaders[i]] = $(element).text()
        })
        scrapedRows.push(tableRow)
    })
    console.log(scrapedRows)
}

main()

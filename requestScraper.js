// if blocked: run in glitch.com
// https://www.scraperapi.com/
// use Posrman for the scraping request
// or use request inside NodeJS
const request = require('request-promise')
    // .defaults({
    //     proxy: '192.168.0.1:49849'
    // })
const cheerio = require('cheerio')

const url = 'https://vancouver.craigslist.org/d/apartments-housing-for-rent/search/apa'

const resultList = []

async function scrapeList() {
    try {
        const htmlRequest = await request.get(url)
        const $ = await cheerio.load(htmlRequest)

        $('.result-info').each((i, element) => {
            const resultTitle = $(element).children('.result-title')
            const title = resultTitle.text()
            const url = resultTitle.attr('href')
            const result = { title, url }
            resultList.push(result)
        })
        console.log(resultList)
    } catch (e) {
        console.error(e)
    }
}

scrapeList()

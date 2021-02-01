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
            const postedDate = new Date($(element)
                .children('time')
                .attr('datetime'))
            const area = $(element).find('.result-hood').text()

            const result = { title, url, postedDate, area }
            resultList.push(result)
        })
        console.log(result)
        return resultList
    } catch (e) {
        console.error(e)
    }
}

async function scrapeDescription(postingsWithHeaders) {
    return await Promise.all(
        postingsWithHeaders.map(async post => {
            try {
                const htmlResult = await request.get(post.url)
                const $ = await cheerio.load(htmlResult)
                $('.print-qrcode-container').remove()
                post.description = $('#postingbody').text()
                post.address = $('div.mapaddress').text()
                const priceText = $('.attrgroup').children().first().text()
                post.price = priceText.replace('price: ', '')
                return post
            } catch {
                console.error(error)
            }
        })
    )
}
async function srapeWeb() {
    const postingsWithHeaders = await scrapeList()
    const postingDescription = await scrapeDescription(postingsWithHeaders)
    console.log(postingDescription.length)
}

srapeWeb()

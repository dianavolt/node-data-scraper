const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

async function scrapeListings(page) {
    await page.goto('https://vancouver.craigslist.org/d/apartments-housing-for-rent/search/apa')

    const html = await page.content(page)
    const $ = cheerio.load(html)

    const listings = $('.result-info').map((i, element) => {
        const titleElement = $(element).find('.result-title')
        const dateElement = $(element).find('.result-date')
        const hoodElement = $(element).find('.result-hood')

        const title = titleElement.text()
        const url = titleElement.attr('href')
        const postingDate = new Date($(dateElement).attr('datetime'))
        const area = hoodElement
            .text()
            .trim()
            .replace('(', '')
            .replace(')', '')

        return {title, url, postingDate, area}
    }).get()
    return listings
}

async function scrapeListingDesc(listings, page) {
    // Puppeteer doesn't like forEach -- does things concurrently in parallel
    for (var i = 0; i < listings.length; i++) {
        await page.goto(listings[i].url)
        const html = await page.content()
        const $ = cheerio.load(html)

        const description = $('#postingbody').text()
        listings[i].description = description
        console.log(listings[i].description)

        // prevent page blocking
        await sleep(1000).catch(e => console.log('Interruption exception: ', e))
    }
}

async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

async function main() {
    const browser = await puppeteer.launch({headless: false}) // disable browser hiding
    const page = await browser.newPage()
    const listings = await scrapeListings(page)
    const listingsWithDescriptions = await scrapeListingDesc(listings, page)
    console.log(listings)
}

main()

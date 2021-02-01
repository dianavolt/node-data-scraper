const parser = require('../parser')
const fs = require('fs')

let html
let listings

beforeAll(() => {
    html = fs.readFileSync('./test.html')
    listings = parser.listings(html)
})

// const listings = [{
//     title: '1 bedroom condo',
//     url: '',
//     datePosted: new Date('2021-01-31'),
//     area: '(Kitsilano)'
// }]

it('should correct number of listings', () => {
    expect(listings.length).toBe(120)
})

it('should get correct area', () => {
    expect(listings[0].hood).toBe('(Kitsilano)')
})

it('should get correct date from listing', () => {
    expect(listings[0].datePosted).toBe(new Date('2021-01-31'))
})

it('should get correct title', () => {
    // const listings = parser.listings(html)
    expect(listings[0].title).toBe('1 bedroom condo')
})

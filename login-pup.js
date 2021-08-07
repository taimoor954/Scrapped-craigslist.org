const puppeteer = require('puppeteer')

const login = async () => {
    try {
       const browser = await puppeteer.launch({headless: false})   
       const page = await browser.newPage()
       await page.goto('https://accounts.craigslist.org/login')
       await page.type('input#inputEmailHandle', 'subhanmuhammad11332@gmail.com')
       await page.type('input#inputPassword', 'pastore123@123@123')
       await page.click('button#login', {delay:200})
       await page.waitForNavigation()
       await page.goto('https://accounts.craigslist.org/login/home')
    } catch (error) {
        console.log(error);
    }
}
login()
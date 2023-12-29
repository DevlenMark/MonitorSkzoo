const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');


const url = 'https://en.skzoostore.com/category/%EF%A5%9C-star/86/';

async function initBrowser() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkStock(page){
    await page.reload();
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);

    const products = $('.inner');

    products.each((i, el) => {
        const name = $(el).find('.name').text();
        const sold_out_img = $(el).find('.promotion').html();

        if (sold_out_img !== null && !(sold_out_img.includes('<img src="//img.echosting.cafe24.com/design/skin/admin/en_US/ico_product_soldout.gif" class="icon_img" alt="Out-of-stock">')) && name){
            console.log(name + " is in Stock!");
        }
    });

    await page.close();
}

// async function sendEmail() {

// }

async function monitor() {
    let page = await initBrowser();
    await checkStock(page);
}

monitor();
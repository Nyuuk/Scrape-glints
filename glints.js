const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// const fs = require('fs');

(async () => {
  // Membuat objek browser
  const browser = await puppeteer.launch({
    args: ['--start-maximized'],
    // headless: false
});

  // Membuat objek halaman
  const page = await browser.newPage();

  // Mengatur resolusi tampilan halaman
  await page.setViewport({ width: 1920, height: 720 });

  // Memuat halaman web
  await page.goto('https://glints.com/id');

  // Menunggu hingga elemen input dengan placeholder "Cari lowongan" muncul
  await page.waitForSelector('input[placeholder="Cari lowongan"]');

  // Mengisi input dengan placeholder "Cari lowongan"
  await page.type('input[placeholder="Cari lowongan"]', 'Programming');

//   Mengambil class dari button dengan isi text "Cari"
  const buttonClass = await waitFromText(page, 'button', 'Cari');

//   console.log(buttonClass);

  // Mengklik button dengan class yang telah didapatkan
  await page.click(`.${buttonClass}`);

  // menunggu halaman di muat
  await page.waitForNavigation();

//   await page.$eval(buttonClass, button => {
//     button.dispatchEvent(new Event('mousedown'));
//     button.dispatchEvent(new Event('mouseup'));
//   })

//   await waitFromText(page, 'button', 'For You');
  //  menunggu
  await page.waitForSelector('div.CollapsibleStyle__CollapsibleHeader-sc-133mwvh-2.hVSloV.collapsible-title');

  await page.waitForSelector('div.JobCardsc__JobcardContainer-sc-hmqj50-0.kWccWU.CompactOpportunityCardsc__CompactJobCardWrapper-sc-dkg8my-0.kwAlsu.compact_job_card');

  // menyimpan file html
//   fs.writeFileSync('example.html', await page.content());
  
  const [juduls, tempats, gajis, lamanyas, links] = [[],[],[],[],[]];

  const $ = cheerio.load(await page.content());
  $('.CompactOpportunityCardsc__CompactJobCardWrapper-sc-dkg8my-0.kwAlsu.compact_job_card').each((index, element) => {
    const judul = $(element).find('div > div > div:nth-child(1) h3').text();
    const tempat = $(element).find('div > div > div:nth-child(2) > div:nth-child(1) > span').text();
    const gaji = $(element).find('div > div > div:nth-child(2) > div:nth-child(2) > span').text();
    const lamanya = $(element).find('div > div > div:nth-child(2) > div:nth-child(3)').text().split('Diperbarui')[0].trim();
    const link = $(element).find('div > div:nth-child(1) a').attr('href');
    juduls.push(judul);
    tempats.push(tempat);
    gajis.push(gaji);
    lamanyas.push(lamanya);
    links.push(link);
  });

  console.log(juduls);
  console.log(tempats);
  console.log(gajis);
  console.log(lamanyas);
  console.log(links);

//   // Mendapatkan responsenya
//   const response = await page.content();
  await page.screenshot({ path: 'screenshot.png' });


  // Menutup browser
  await browser.close();
})();

async function waitFromText(page, typ, text) {
  // Menunggu hingga button muncul
  await page.waitForSelector(typ, {timeout: 30000});

  // Mendapatkan semua button pada halaman
  const buttons = await page.$$(typ);

  // Mencari button dengan isi text "Cari"
  let button;
  for (let i = 0; i < buttons.length; i++) {
    const buttonText = await buttons[i].evaluate(button => button.textContent);
    if (buttonText.includes(text)) {
      button = buttons[i];
      break;
    }
  }

  const className = await button.evaluate(button => button.className);
  const newString = className.split(' ').join('.');

  return newString;
}
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');


const DEVICES = [
  {
    'name': 'desktop',
    size: {
      width: 1366,
      height: 1024,
    },
  },
  {
    'name': 'ipad',
    'device': devices['iPad 2'],
  },
  {
    'name': 'iphone6',
    'device': devices['iPhone 6'],
  }
];


async function takeScreenshot(url, data) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  if (data.size) {
    await page.setViewport(data.size);
  }
  else if (data.device) {
    await page.emulate(data.device);
  }
  else {
    // TODO: throw;
  }
  await page.goto(url);
  const screenshot = await page.screenshot({ fullPage: true, encoding: 'base64' });
  await page.close();
  await browser.close();
  return {'base64': screenshot, 'device': data['name']};
}


function takeScreenshots(url) {
  return Promise.all(
    DEVICES.map(d => takeScreenshot(url, d)),
  )
}

module.exports = {
  takeScreenshots
};

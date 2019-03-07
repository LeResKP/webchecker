const puppeteer = require('puppeteer');


let resources = [];
let page = {};

let responses = [];


const responseToObject = (response) => {
  const req = response.request()

  return {
    'url': req.url(),
    'ok': response.ok(),
    'http_status': response.status(),
    'http_status_text': response.statusText(),
    'resource_type': req.resourceType(),
    'redirect_to': null,
  };
};


const parseResponse = (response, withRedirects) => {
  const req = response.request()
  let page = null;
  let lis = [];
  let responses = [];
  if (typeof withRedirects !== 'undefined' && withRedirects) {
    responses = responses.concat(req.redirectChain());
  }
  responses.push({'response': () => response});
  responses.reverse().map((r) => {
    let newpage = responseToObject(r.response());
    newpage.redirect_to = page;
    page = newpage;
  });
  return page;
};


const handleResponses = (pageResponse, links) => {

  if(responses[0] !== pageResponse) {
    throw 'Bad response';
  }

  const page = parseResponse(pageResponse, true);
  const resources = responses.slice(1).map((res) => parseResponse(res, true));

  console.log(JSON.stringify({
    page,
    resources,
    links,
  }));

};


async function getLinks(url) {
  const browser = await puppeteer.launch({ headless: true });
  const bpage = await browser.newPage();
  bpage.setDefaultNavigationTimeout(5000);

  bpage.on('response', (response) => {
    const status = response.status();
    // Don't get the redirects we have them in request.redirectChain()
    if (!((status >= 300) && (status <= 399))) {
      responses.push(response);
    }
  });

  // TODO: try/catch: https://github.com/GoogleChrome/puppeteer/issues/2220
  const pageResponse = await bpage.goto(url);

  const links = await bpage.$$eval('a[href]', anchors => { return anchors.map(anchor => anchor.href) });
  await bpage.close();
  await browser.close();

  handleResponses(pageResponse, links);
}


const args = require('process').argv.slice(2);

// https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
if (args.length !== 1) {
  throw 'No url given';
}

getLinks(args[0])

const { chromium } = require('playwright');

(async () => {
  console.log('Starting PDI keepalive...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('https://signon.service-now.com/ssologin.do?redirectUri=https://developer.servicenow.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('Waiting for username field...');
    await page.waitForSelector('#username', { timeout: 60000 });
    console.log('Entering username...');
    await page.fill('#username', process.env.SN_PDI_USERNAME);
    await page.press('#username', 'Enter');

    console.log('Waiting for password field...');
    await page.waitForSelector('#password', { timeout: 60000 });
    console.log('Entering password...');
    await page.fill('#password', process.env.SN_PDI_PASSWORD);
    await page.press('#password', 'Enter');

    console.log('Waiting for post-login redirect...');
    await page.waitForURL('**/developer.servicenow.com/**', { timeout: 60000 });

    console.log('Login successful. PDI keepalive complete.');

  } catch (err) {
    console.error('Error during keepalive:', err.message);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
})();

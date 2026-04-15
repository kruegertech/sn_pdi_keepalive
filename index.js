const { chromium } = require('playwright');

async function wakeInstance(accountName, username, password) {
  console.log(`\n--- Starting keepalive for ${accountName} ---`);

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
    await page.fill('#username', username);
    await page.press('#username', 'Enter');

    console.log('Waiting for password field...');
    await page.waitForSelector('#password', { timeout: 60000 });
    console.log('Entering password...');
    await page.fill('#password', password);
    await page.press('#password', 'Enter');

    console.log('Waiting for post-login redirect...');
    await page.waitForURL('**/developer.servicenow.com/**', { timeout: 60000 });

    console.log(`Login successful for ${accountName}.`);

  } catch (err) {
    console.error(`Error during keepalive for ${accountName}:`, err.message);
  } finally {
    await context.close();
    await browser.close();
    console.log(`Browser closed for ${accountName}.`);
  }
}

(async () => {
  // Add or remove wakeInstance calls below to match your number of accounts.
  // Each account needs its own pair of secrets defined in keepalive.yml.
  await wakeInstance('Account1', process.env.SN_PDI_USERNAME_1, process.env.SN_PDI_PASSWORD_1);
  await wakeInstance('Account2', process.env.SN_PDI_USERNAME_2, process.env.SN_PDI_PASSWORD_2);
  await wakeInstance('Account3', process.env.SN_PDI_USERNAME_3, process.env.SN_PDI_PASSWORD_3);

  console.log('\nAll accounts processed.');
})();

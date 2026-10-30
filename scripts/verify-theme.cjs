const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const context = await browser.newContext({colorScheme:'dark',viewport:{width:390,height:900}});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.stack));
  page.on('console', message => {if(message.type()==='error')errors.push(message.text());});
  const theme = () => page.locator('html').getAttribute('data-theme');
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await theme(),'dark','Uses system preference on first visit');
  await page.emulateMedia({colorScheme:'light'});
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await page.getByRole('button',{name:'Ativar modo escuro'}).press('Enter');
  assert.equal(await theme(),'dark');
  await page.reload();
  assert.equal(await theme(),'dark','Persists explicit preference after reload');
  await page.goto('http://127.0.0.1:4173/servicos');
  assert.equal(await theme(),'dark','Persists preference between pages');
  const logo = await page.locator('.site-header .logo').evaluate(svg => {
    const box = svg.getBBox(), v = svg.viewBox.baseVal;
    return box.x >= v.x && box.y >= v.y && box.x+box.width <= v.x+v.width && box.y+box.height <= v.y+v.height;
  });
  assert.ok(logo,'Complete official logo stays inside viewBox');
  await page.goto('http://127.0.0.1:4173/');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  for (const mode of ['dark','light']) {
    if (await theme() !== mode) await page.locator('.theme-toggle').click();
    for (const width of [320,390,1440]) {
      await page.setViewportSize({width,height:900});
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({path:`docs/theme-qa/final-${mode}-${width}.png`,fullPage:true});
    }
  }
  const blocked = await browser.newContext({colorScheme:'dark'});
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {get(){throw new DOMException('Unavailable','SecurityError');}});
  });
  const blockedPage = await blocked.newPage();
  blockedPage.on('pageerror', error => errors.push(error.stack));
  await blockedPage.goto('http://127.0.0.1:4173/');
  await blockedPage.getByRole('button',{name:'Ativar modo claro'}).click();
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'),'light');
  assert.deepEqual(errors,[],'No application runtime or console errors');
  await fs.writeFile('docs/theme-qa/behavior.json',JSON.stringify({systemPreference:true,systemChange:true,keyboardToggle:true,persistence:true,completeLogo:true,reducedMotion:true,blockedStorage:true,errors},null,2));
  await browser.close();
  console.log('Theme behavior, complete logo, reduced motion, storage fallback and runtime checks passed.');
})().catch(error => {console.error(error);process.exit(1);});

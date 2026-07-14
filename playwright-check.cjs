const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3001/test-favcard-temp', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'before.png', fullPage: true });

  const info = await page.evaluate(() => {
    const wrap = document.querySelector('.relative');
    const link = document.querySelector('a.moto-card');
    const header = document.querySelector('.moto-card__header');
    const btn = document.querySelector('button[aria-label="Remove from favorites"]');
    const yearBadge = document.querySelector('.moto-card__year');
    function rect(el) { return el ? el.getBoundingClientRect() : null; }
    return {
      wrap: rect(wrap),
      link: rect(link),
      header: rect(header),
      btn: rect(btn),
      yearBadge: rect(yearBadge),
      wrapPosition: wrap ? getComputedStyle(wrap).position : null,
      linkDisplay: link ? getComputedStyle(link).display : null,
      btnPosition: btn ? getComputedStyle(btn).position : null,
      wrapHTML: wrap ? wrap.outerHTML.slice(0, 400) : null,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();

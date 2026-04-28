import { chromium } from 'playwright';
import { execSync } from 'child_process';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait for hydration
  await page.waitForSelector('[data-hydrated="true"]');
  
  // Choose vs Friend
  await page.getByRole('button', { name: /vs Friend/i }).click();

  // Play some moves
  const squares = page.getByTestId('square');
  await squares.nth(4).click(); // X in center
  await squares.nth(0).click(); // O in top-left
  await squares.nth(8).click(); // X in bottom-right
  
  // Wait a bit for animations if any
  await page.waitForTimeout(500);

  // Take screenshot of the board area
  const board = page.locator('.grid.grid-cols-3'); // Assuming standard tailwind grid classes
  if (await board.count() > 0) {
    await board.first().screenshot({ path: 'board_screenshot.png' });
  } else {
    // fallback
    await page.screenshot({ path: 'board_screenshot.png' });
  }

  await browser.close();

  // Export the generated screenshot to the public directory
  console.log('Exporting logos to public/ ...');
  
  try {
    execSync('sips -z 192 192 board_screenshot.png --out public/logo192.png');
    execSync('sips -z 512 512 board_screenshot.png --out public/logo512.png');
    execSync('sips -s format ico -z 64 64 board_screenshot.png --out public/favicon.ico');
    console.log('Successfully generated logo192.png, logo512.png, and favicon.ico in public/');
  } catch (err) {
    console.error('Failed to generate logos:', err);
  }
})();

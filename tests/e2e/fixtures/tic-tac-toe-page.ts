import { test as base, expect, type Page, type Locator } from '@playwright/test';

// 1. Define the Page Object Model
export class TicTacToePage {
  readonly page: Page;
  readonly squares: Locator;
  readonly status: Locator;
  readonly restartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // We'll use data-testid attributes to reliably target elements
    this.squares = page.getByTestId('square');
    this.status = page.getByTestId('game-status');
    this.restartButton = page.getByRole('button', { name: /restart|reset/i });
  }

  async goto(groupId?: string) {
    const url = groupId ? `/?groupId=${groupId}` : "/";
    await this.page.goto(url);
    await this.page.waitForSelector('[data-hydrated="true"]', {
      timeout: 10000,
    });
  }

  async playMove(index: number) {
    await this.squares.nth(index).click();
  }
}

// 2. Define the fixture
export const test = base.extend<{ 
  gamePage: TicTacToePage,
  player1: TicTacToePage,
  player2: TicTacToePage 
}>({
  gamePage: async ({ page }, use, testInfo) => {
    const gamePage = new TicTacToePage(page);
    await gamePage.goto(testInfo.testId);
    await use(gamePage);
  },
  player1: async ({ browser }, use, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const gamePage = new TicTacToePage(page);
    await gamePage.goto(testInfo.testId);
    await use(gamePage);
    await context.close();
  },
  player2: async ({ browser }, use, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const gamePage = new TicTacToePage(page);
    await gamePage.goto(testInfo.testId);
    await use(gamePage);
    await context.close();
  },
});

export { expect };

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

  async goto() {
    // Assuming the game is on the root page for now
    await this.page.goto('/');
  }

  async playMove(index: number) {
    await this.squares.nth(index).click();
  }
}

// 2. Define the fixture
export const test = base.extend<{ gamePage: TicTacToePage }>({
  gamePage: async ({ page }, use) => {
    const gamePage = new TicTacToePage(page);
    await gamePage.goto();
    await use(gamePage);
  },
});

export { expect };

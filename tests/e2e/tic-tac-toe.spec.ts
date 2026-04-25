import { test, expect } from './fixtures/tic-tac-toe-page';

test.describe('Tic Tac Toe Game', () => {
  test('initial state is correct', async ({ gamePage }) => {
    await expect(gamePage.status).toHaveText(/Next player: X/i);
    await expect(gamePage.squares).toHaveCount(9);
    for (let i = 0; i < 9; i++) {
      await expect(gamePage.squares.nth(i)).toBeEmpty();
    }
  });

  test('players can alternate turns', async ({ gamePage }) => {
    await gamePage.playMove(0);
    await expect(gamePage.squares.nth(0)).toHaveText('X');
    await expect(gamePage.status).toHaveText(/Next player: O/i);

    await gamePage.playMove(1);
    await expect(gamePage.squares.nth(1)).toHaveText('O');
    await expect(gamePage.status).toHaveText(/Next player: X/i);
  });

  test('cannot play on an already occupied square', async ({ gamePage }) => {
    await gamePage.playMove(0);
    await expect(gamePage.squares.nth(0)).toHaveText('X');
    
    await gamePage.playMove(0);
    await expect(gamePage.squares.nth(0)).toHaveText('X');
    await expect(gamePage.status).toHaveText(/Next player: O/i);
  });

  test('detects a win for Player X', async ({ gamePage }) => {
    // X wins top row
    for (const move of [0, 3, 1, 4, 2]) {
      await gamePage.playMove(move);
    }
    await expect(gamePage.status).toHaveText(/Winner: X/i);
  });

  test('detects a win for Player O', async ({ gamePage }) => {
    // O wins middle column
    for (const move of [0, 1, 3, 4, 8, 7]) {
      await gamePage.playMove(move);
    }
    await expect(gamePage.status).toHaveText(/Winner: O/i);
  });

  test('detects a draw', async ({ gamePage }) => {
    // X O X
    // X O O
    // O X X
    for (const move of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
      await gamePage.playMove(move);
    }
    await expect(gamePage.status).toHaveText(/Draw/i);
  });

  test('prevents moves after a win', async ({ gamePage }) => {
    for (const move of [0, 3, 1, 4, 2]) { // X wins
      await gamePage.playMove(move);
    }
    await expect(gamePage.status).toHaveText(/Winner: X/i);

    await gamePage.playMove(8);
    await expect(gamePage.squares.nth(8)).toBeEmpty();
  });

  test('can restart the game', async ({ gamePage }) => {
    await gamePage.playMove(0);
    await gamePage.playMove(1);
    
    await gamePage.restartButton.click();
    
    await expect(gamePage.status).toHaveText(/Next player: X/i);
    await expect(gamePage.squares.nth(0)).toBeEmpty();
    await expect(gamePage.squares.nth(1)).toBeEmpty();
  });
});

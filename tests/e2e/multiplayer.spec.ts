import { expect, test } from '@playwright/test';
import { TicTacToePage } from './fixtures/tic-tac-toe-page';

test.describe('Multiplayer Tic Tac Toe (WebSockets)', () => {
  test('players can join a party, match up, and play a game together', async ({ browser }) => {
    // We create two separate browser contexts for two different players to ensure 
    // they don't share any local state/cookies by default (though they wouldn't anyway if using different contexts)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const player1 = new TicTacToePage(page1);
    const player2 = new TicTacToePage(page2);

    // Both players navigate to the home page
    await player1.goto();
    await player2.goto();

    // 1. Join Party
    // Assuming there's a button to switch to multiplayer or find a match
    const findMatchBtn1 = page1.getByRole('button', { name: /Find Match|Join Party/i });
    const findMatchBtn2 = page2.getByRole('button', { name: /Find Match|Join Party/i });

    await findMatchBtn1.click();
    
    // Player 1 should see a waiting status
    await expect(page1.getByText(/Looking for opponent|Waiting for another player/i)).toBeVisible();

    // Player 2 clicks the button
    await findMatchBtn2.click();

    // 2. Both players should now be matched and see the game board
    // One should be X, one should be O
    await expect(page1.getByText(/Looking for opponent/i)).toBeHidden();
    await expect(page2.getByText(/Looking for opponent/i)).toBeHidden();

    // The game status should indicate who is X and who is O, or whose turn it is
    await expect(player1.status).toHaveText(/Next player: X/i);
    await expect(player2.status).toHaveText(/Next player: X/i);

    // Assume Player 1 is assigned X (since they joined first) and Player 2 is assigned O.
    // We can verify this via a player indicator if it exists, but let's test the gameplay.
    
    // 3. Gameplay across WebSockets
    
    // Player 1 (X) plays top-left
    await player1.playMove(0);
    
    // Player 1 sees their move
    await expect(player1.squares.nth(0)).toHaveText('X');
    await expect(player1.status).toHaveText(/Next player: O/i);
    
    // Player 2 sees Player 1's move
    await expect(player2.squares.nth(0)).toHaveText('X');
    await expect(player2.status).toHaveText(/Next player: O/i);

    // Player 2 (O) plays center
    await player2.playMove(4);

    // Player 2 sees their move
    await expect(player2.squares.nth(4)).toHaveText('O');
    await expect(player2.status).toHaveText(/Next player: X/i);

    // Player 1 sees Player 2's move
    await expect(player1.squares.nth(4)).toHaveText('O');
    await expect(player1.status).toHaveText(/Next player: X/i);

    // Clean up
    await context1.close();
    await context2.close();
  });
});

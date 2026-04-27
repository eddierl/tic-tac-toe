import { expect, test } from "./fixtures/tic-tac-toe-page";

test.describe("Rematch Feature", () => {
	test("players can request a rematch and play again with swapped symbols", async ({
		player1,
		player2,
	}) => {
		// 1. Join and Match
		await player1.findMatchButton.click();
		await player2.findMatchButton.click();

		// Ensure matched
		await expect(player1.status).toHaveText(/Next player: X/i);
		await expect(player2.status).toHaveText(/Next player: X/i);

		// 2. Play a full game (X wins)
		// Player 1 (X) moves
		await player1.playMove(0); // X
		await player2.playMove(3); // O
		await player1.playMove(1); // X
		await player2.playMove(4); // O
		await player1.playMove(2); // X

		await expect(player1.status).toHaveText(/Winner: X/i);
		await expect(player2.status).toHaveText(/Winner: X/i);

		// 3. Rematch Button should appear for both
		await expect(player1.rematchButton).toBeVisible();
		await expect(player2.rematchButton).toBeVisible();

		// 4. Player 1 requests rematch
		await player1.rematchButton.click();
		await expect(player1.page.getByText(/Waiting for opponent/i)).toBeVisible();
		// await expect(player1.rematchButton).toBeDisabled();

		// 5. Player 2 accepts rematch
		await player2.rematchButton.click();

		// 6. Game should restart
		await expect(player1.status).toHaveText(/Next player: X/i);
		await expect(player2.status).toHaveText(/Next player: X/i);

		// Board should be empty
		for (let i = 0; i < 9; i++) {
			await expect(player1.squares.nth(i)).toHaveText("");
		}

		// 7. Symbols should have swapped (Player 2 was O, should now be X)
		// If Player 2 plays first, and it works, it means they are X.
		await player2.playMove(4);
		await expect(player2.squares.nth(4)).toHaveText("X");
		await expect(player1.squares.nth(4)).toHaveText("X");
		await expect(player1.status).toHaveText(/Next player: O/i);
	});

	test("rematch is cancelled if opponent leaves", async ({
		player1,
		player2,
	}) => {
		// 1. Match and play to end
		await player1.findMatchButton.click();
		await player2.findMatchButton.click();

		await player1.playMove(0);
		await player2.playMove(3);
		await player1.playMove(1);
		await player2.playMove(4);
		await player1.playMove(2); // X wins

		// 2. Player 1 requests rematch
		await player1.rematchButton.click();
		await expect(player1.page.getByText(/Waiting for opponent/i)).toBeVisible();

		// 3. Player 2 leaves instead of rematching
		await player2.leaveButton.click();

		// 4. Player 1 should see that opponent left or be returned to idle/waiting
		// Depending on implementation, they might see "Opponent left"
		await expect(player1.page.getByText(/Opponent left|Waiting for another player/i)).toBeVisible();
	});
});

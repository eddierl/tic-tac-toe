import { expect, test } from "./fixtures/tic-tac-toe-page";

test.describe("Scoring System", () => {
	test("tracks score across multiple games and resets when leaving", async ({
		player1,
		player2,
	}) => {
		// 1. Join and Match
		await player1.findMatchButton.click();
		await player2.findMatchButton.click();

		// Initial score should be 0-0
		await expect(player1.scoreMine).toHaveText("0");
		await expect(player1.scoreTheirs).toHaveText("0");
		await expect(player2.scoreMine).toHaveText("0");
		await expect(player2.scoreTheirs).toHaveText("0");

		// 2. Play a full game (Player 1 wins)
		await player1.playMove(0); // X
		await player2.playMove(3); // O
		await player1.playMove(1); // X
		await player2.playMove(4); // O
		await player1.playMove(2); // X wins

		// Score should update
		await expect(player1.scoreMine).toHaveText("1");
		await expect(player1.scoreTheirs).toHaveText("0");
		await expect(player2.scoreMine).toHaveText("0");
		await expect(player2.scoreTheirs).toHaveText("1");

		// 3. Rematch
		await player1.rematchButton.click();
		await player2.rematchButton.click();

		// Score should be persisted
		await expect(player1.scoreMine).toHaveText("1");
		await expect(player2.scoreMine).toHaveText("0");

		// 4. Play second game (Player 2 wins)
		// Symbols swap: Player 2 is X, Player 1 is O.
		await player2.playMove(3); // X
		await player1.playMove(0); // O
		await player2.playMove(4); // X
		await player1.playMove(1); // O
		await player2.playMove(5); // X wins (Player 2 wins)

		// Score should be 1-1
		await expect(player1.scoreMine).toHaveText("1");
		await expect(player1.scoreTheirs).toHaveText("1");
		await expect(player2.scoreMine).toHaveText("1");
		await expect(player2.scoreTheirs).toHaveText("1");

		// 5. Player 1 leaves
		await player1.leaveButton.click();
		
		// 6. Player 1 joins a new game
		await player1.findMatchButton.click();
		await player2.leaveButton.click();
		await player2.findMatchButton.click();
		
		// Score should reset
		await expect(player1.scoreMine).toHaveText("0");
		await expect(player1.scoreTheirs).toHaveText("0");
	});
});

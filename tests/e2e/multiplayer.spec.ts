import { expect, test } from "./fixtures/tic-tac-toe-page";

test.describe("Multiplayer Tic Tac Toe (WebSockets)", () => {
	test("players can join a party, match up, and play a game together", async ({
		player1,
		player2,
	}) => {
		// 1. Join Party
		const findMatchBtn1 = player1.page.getByRole("button", {
			name: /Find Match|Join Party/i,
		});
		const findMatchBtn2 = player2.page.getByRole("button", {
			name: /Find Match|Join Party/i,
		});

		await findMatchBtn1.click();

		// Player 1 should see a waiting status
		await expect(
			player1.page.getByText(/Looking for opponent|Waiting for another player/i),
		).toBeVisible();

		// Player 2 clicks the button
		await findMatchBtn2.click();

		// 2. Both players should now be matched and see the game board
		await expect(
			player1.page.getByText(/Looking for opponent/i),
		).toBeHidden();
		await expect(
			player2.page.getByText(/Looking for opponent/i),
		).toBeHidden();

		// The game status should indicate who is X and who is O, or whose turn it is
		await expect(player1.status).toHaveText(/Next player: X/i);
		await expect(player2.status).toHaveText(/Next player: X/i);

		// 3. Gameplay across WebSockets
		// Player 1 plays top-left
		await player1.playMove(0);

		// Player 1 sees their move
		await expect(player1.squares.nth(0)).toHaveText("X");
		await expect(player1.status).toHaveText(/Next player: O/i);

		// Player 2 sees Player 1's move
		await expect(player2.squares.nth(0)).toHaveText("X");
		await expect(player2.status).toHaveText(/Next player: O/i);

		// Player 2 plays center
		await player2.playMove(4);

		// Player 2 sees their move
		await expect(player2.squares.nth(4)).toHaveText("O");
		await expect(player2.status).toHaveText(/Next player: X/i);

		// Player 1 sees Player 2's move
		await expect(player1.squares.nth(4)).toHaveText("O");
		await expect(player1.status).toHaveText(/Next player: X/i);
	});
});

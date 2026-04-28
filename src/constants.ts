export type PlayerSymbol = "X" | "O";
export type SquareValue = PlayerSymbol | null;
export type MatchStatus = "idle" | "waiting" | "matched";
export type BotDifficulty = "beginner" | "medium" | "expert";

const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export const checkWinningCombination =
	(squares: SquareValue[]) => (combo: number[]) => {
		const [a, b, c] = combo;
		return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
	};

export const getWinner = (squares: SquareValue[]) => {
	const winnerInfo = WINNING_COMBINATIONS.find(
		checkWinningCombination(squares),
	);
	return {
		winner: winnerInfo ? squares[winnerInfo[0]] : null,
		winnerInfo,
	};
};

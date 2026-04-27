import { useCallback, useState } from "react";

export type Symbol = "X" | "O";
export type SquareValue = Symbol | null;

export const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export function useGame() {
	const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));

	const xIsNext = squares.filter(Boolean).length % 2 === 0;

	const winnerInfo = WINNING_COMBINATIONS.find(
		([a, b, c]) =>
			squares[a] && squares[a] === squares[b] && squares[a] === squares[c],
	);

	const winner = winnerInfo ? squares[winnerInfo[0]] : null;
	const isDraw = !winner && squares.every((square) => square !== null);
	const gameOver = !!winner || isDraw;

	const applyMove = useCallback((index: number) => {
		setSquares((prev) => {
			if (prev[index]) return prev;
			const newSquares = [...prev];
			const isX = prev.filter(Boolean).length % 2 === 0;
			newSquares[index] = isX ? "X" : "O";
			return newSquares;
		});
	}, []);

	const resetGame = useCallback(() => {
		setSquares(Array(9).fill(null));
	}, []);

	return {
		squares,
		xIsNext,
		winner,
		winnerInfo,
		isDraw,
		gameOver,
		applyMove,
		resetGame,
	};
}

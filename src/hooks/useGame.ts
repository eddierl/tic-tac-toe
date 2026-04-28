import { useCallback, useState } from "react";
import { getWinner, type SquareValue } from "#/constants";

export function useGame() {
	const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));

	const xIsNext = squares.filter(Boolean).length % 2 === 0;

	const { winner, winnerInfo } = getWinner(squares);
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

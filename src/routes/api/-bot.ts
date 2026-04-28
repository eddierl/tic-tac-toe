import { defineEventHandler, readBody } from "nitro/h3";
import { WINNING_COMBINATIONS, type PlayerSymbol, type SquareValue } from "../../constants";

function checkWinner(squares: SquareValue[]): SquareValue {
	for (const [a, b, c] of WINNING_COMBINATIONS) {
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function minimax(squares: SquareValue[], depth: number, isMaximizing: boolean, computerSymbol: PlayerSymbol): number {
	const winner = checkWinner(squares);
	const playerSymbol = computerSymbol === "X" ? "O" : "X";
	if (winner === computerSymbol) return 10 - depth;
	if (winner === playerSymbol) return depth - 10;
	if (squares.every((sq) => sq !== null)) return 0;

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < squares.length; i++) {
			if (!squares[i]) {
				squares[i] = computerSymbol;
				const score = minimax(squares, depth + 1, false, computerSymbol);
				squares[i] = null;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < squares.length; i++) {
			if (!squares[i]) {
				squares[i] = playerSymbol;
				const score = minimax(squares, depth + 1, true, computerSymbol);
				squares[i] = null;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

export default defineEventHandler(async (event) => {
	const body = (await readBody(event)) as {
		squares: SquareValue[];
		difficulty?: "beginner" | "medium" | "expert";
	};
	const squares: SquareValue[] = body.squares;
	const difficulty: "beginner" | "medium" | "expert" = body.difficulty || "medium";
	
	// Determine whose turn it is
	const xCount = squares.filter((s) => s === "X").length;
	const oCount = squares.filter((s) => s === "O").length;
	const computerSymbol = xCount > oCount ? "O" : "X";

	const availableMoves = squares
		.map((sq, i) => (sq === null ? i : null))
		.filter((i) => i !== null) as number[];

	if (availableMoves.length === 0) {
		return { index: -1 };
	}

	let moveIndex = -1;

	// Beginner: Random move
	if (difficulty === "beginner") {
		moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	} 
	// Medium: 30% random, 70% minimax
	else if (difficulty === "medium") {
		if (Math.random() < 0.3) {
			moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
		} else {
			// fallback to expert
		}
	}

	// Expert (or medium fallback): Minimax
	if (moveIndex === -1) {
		let bestScore = -Infinity;
		let bestMoves: number[] = [];
		for (const move of availableMoves) {
			squares[move] = computerSymbol;
			const score = minimax(squares, 0, false, computerSymbol);
			squares[move] = null;
			if (score > bestScore) {
				bestScore = score;
				bestMoves = [move];
			} else if (score === bestScore) {
				bestMoves.push(move);
			}
		}
		// Pick random among the best moves to add slight variety
		moveIndex = bestMoves[Math.floor(Math.random() * bestMoves.length)];
	}

	return { index: moveIndex };
});

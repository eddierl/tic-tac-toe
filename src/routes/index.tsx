import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [isHydrated, setIsHydrated] = useState(false);
	const [square, setSquare] = useState<Array<"X" | "O" | null>>(
		Array(9).fill(null),
	);
	const [xIsNext, setXIsNext] = useState(true);

	const isDraw = square.filter(Boolean).length === 9;

	const isWin = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
		.filter(
			(winState) =>
				square[winState[0]] &&
				square[winState[0]] === square[winState[1]] &&
				square[winState[0]] === square[winState[2]],
		)
		.pop();

	const gameOver = isWin || isDraw;

	const onClickOnCell = (index: number) => {
		if (square[index] || gameOver) {
			return;
		}
		const newSquare = [...square];
		newSquare[index] = xIsNext ? "X" : "O";
		setSquare(newSquare);
		setXIsNext(!xIsNext);
	};

	const onRestart = () => {
		setSquare(Array(9).fill(null));
		setXIsNext(true);
	};

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<div className="p-8" data-hydrated={isHydrated}>
			<h1 className="text-4xl font-bold" data-testid="game-status">
				{isWin
					? `Winner: ${square[isWin[0]]}`
					: isDraw
						? "Draw"
						: `Next player: ${xIsNext ? "X" : "O"}`}
			</h1>

			<div className="mt-4 text-lg grid grid-cols-3 gap-4">
				{Array(9)
					.fill(null)
					.map((_, i) => (
						<button
							data-testid="square"
							className="size-5"
							type="button"
							// biome-ignore lint/suspicious/noArrayIndexKey: that is just an cell index
							key={i}
							onClick={() => onClickOnCell(i)}
						>
							{square[i]}
						</button>
					))}
			</div>
			<div>
				<button type="button" data-testid="restart" onClick={onRestart}>
					restart
				</button>
			</div>
		</div>
	);
}

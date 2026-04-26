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
		<div
			className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30 overflow-hidden"
			data-hydrated={isHydrated}
		>
			<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />

			<div className="relative z-10 flex flex-col items-center">
				<h1
					className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight text-white drop-shadow-lg h-12 flex items-center justify-center transition-all duration-300"
					data-testid="game-status"
				>
					{isWin ? (
						<span>
							Winner:{" "}
							<span
								className={
									square[isWin[0]] === "X" ? "text-emerald-400" : "text-sky-400"
								}
							>
								{square[isWin[0]]}
							</span>{" "}
							🎉
						</span>
					) : isDraw ? (
						<span className="text-amber-400">Draw 🤝</span>
					) : (
						<span>
							Next player:{" "}
							<span className={xIsNext ? "text-emerald-400" : "text-sky-400"}>
								{xIsNext ? "X" : "O"}
							</span>
						</span>
					)}
				</h1>

				{/* The Game Board */}
				<div className="grid grid-cols-3 gap-3 md:gap-4 bg-white/5 p-4 md:p-6 rounded-4xl shadow-2xl backdrop-blur-md border border-white/10 relative">
					{/* Animated background glow */}
					<div className="absolute -inset-10 bg-indigo-500/20 blur-3xl rounded-full mix-blend-screen pointer-events-none" />

					{Array(9)
						.fill(null)
						.map((_, i) => {
							const isWinningSquare = isWin?.includes(i);
							const val = square[i];
							return (
								<button
									data-testid="square"
									// biome-ignore lint/suspicious/noArrayIndexKey: rigid grid
									key={i}
									type="button"
									onClick={() => onClickOnCell(i)}
									className={`
										relative w-20 h-20 md:w-28 md:h-28 text-5xl md:text-6xl font-black rounded-2xl 
										transition-all duration-300 flex items-center justify-center outline-none
										${
											!val && !gameOver
												? "hover:bg-white/10 active:scale-90 cursor-pointer bg-black/20 border-2 border-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
												: "bg-black/40 border-2 border-transparent cursor-default"
										}
										${isWinningSquare ? "scale-105 z-10 bg-indigo-500/30 border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.6)]" : ""}
										${gameOver && !isWinningSquare && val ? "opacity-40 grayscale" : ""}
									`}
								>
									<span
										className={`
										transition-all duration-300 transform inline-block
										${val ? "scale-100 opacity-100" : "scale-50 opacity-0"}
										${val === "X" ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" : ""}
										${val === "O" ? "text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]" : ""}
										${isWinningSquare ? "animate-pulse" : ""}
									`}
									>
										{val}
									</span>
								</button>
							);
						})}
				</div>

				<button
					type="button"
					data-testid="restart"
					onClick={onRestart}
					className={`
						mt-14 px-10 py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 
						text-white rounded-full font-bold text-xl tracking-wide 
						transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(99,102,241,0.5)] 
						active:scale-95 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-500/50
						${gameOver ? "animate-bounce shadow-[0_0_20px_rgba(99,102,241,0.6)]" : "shadow-lg"}
					`}
				>
					Restart Game
				</button>
			</div>
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { BotDifficulty } from "#/constants";
import { useGame } from "#/hooks/useGame";
import { useMultiplayer } from "#/hooks/useMultiplayer";
import { GameBoard } from "../components/GameBoard";
import { GameControls } from "../components/GameControls";
import { GameStatus } from "../components/GameStatus";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [isHydrated, setIsHydrated] = useState(false);
	const [isVsComputer, setIsVsComputer] = useState(true);
	const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");
	const {
		squares,
		xIsNext,
		winner,
		winnerInfo,
		isDraw,
		gameOver,
		applyMove,
		resetGame,
	} = useGame();

	const { groupId } = Route.useSearch() as { groupId?: string };

	const {
		isMultiplayer,
		matchStatus,
		playerSymbol,
		hasRequestedRematch,
		opponentRequestedRematch,
		opponentDisconnected,
		joinParty,
		leaveParty,
		sendMove,
		requestRematch,
		sendGameOver,
		scores,
	} = useMultiplayer({
		onMoveReceived: applyMove,
		onReset: resetGame,
		groupId,
	});

	useEffect(() => {
		if (isMultiplayer && gameOver && winner) {
			sendGameOver(winner);
		}
	}, [isMultiplayer, gameOver, winner, sendGameOver]);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const isMyTurn = isMultiplayer
		? (playerSymbol === "X" && xIsNext) || (playerSymbol === "O" && !xIsNext)
		: isVsComputer
			? xIsNext
			: true;

	useEffect(() => {
		if (isMultiplayer || !isVsComputer || gameOver || xIsNext) return;

		let ignore = false;
		const fetchBotMove = async () => {
			try {
				const res = await fetch("/api/bot", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ squares, difficulty }),
				});
				const data = await res.json();
				if (!ignore && data.index !== -1 && data.index !== undefined) {
					setTimeout(() => {
						if (!ignore) applyMove(data.index);
					}, 500);
				}
			} catch (err) {
				console.error("Failed to fetch bot move:", err);
			}
		};

		fetchBotMove();

		return () => {
			ignore = true;
		};
	}, [
		isMultiplayer,
		isVsComputer,
		gameOver,
		xIsNext,
		squares,
		difficulty,
		applyMove,
	]);

	const handleSquareClick = (index: number) => {
		if (squares[index] || gameOver || !isMyTurn) return;
		if (isMultiplayer) sendMove(index);
		applyMove(index);
	};

	if (!isHydrated) {
		return (
			<div
				className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30 overflow-hidden text-white"
				data-hydrated={isHydrated}
			>
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />
				<div className="relative z-10 flex flex-col items-center gap-10">
					<div className="flex gap-4 p-6 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className="w-20 h-20 md:w-28 md:h-28 bg-black/40 rounded-2xl border-2 border-transparent flex items-center justify-center animate-sequence"
								style={{ animationDelay: `${i * 300}ms` }}
							>
								{i % 2 === 0 ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
									>
										<title>X</title>
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-10 h-10 md:w-14 md:h-14 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
									>
										<title>O</title>
										<circle cx="12" cy="12" r="10" />
									</svg>
								)}
							</div>
						))}
					</div>
					<div className="flex flex-col items-center gap-2">
						<p className="text-indigo-300 font-bold text-xl tracking-widest animate-pulse uppercase">
							Preparing Match
						</p>
						<div className="flex gap-1">
							<div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
							<div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
							<div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center pt-16 md:pt-24 lg:pt-32 p-8 font-sans selection:bg-indigo-500/30 overflow-hidden text-white"
			data-hydrated={isHydrated}
		>
			<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />

			<div className="relative z-10 flex flex-col items-center w-full max-w-md">
				<GameStatus
					isMultiplayer={isMultiplayer}
					matchStatus={matchStatus}
					winner={winner}
					isDraw={isDraw}
					xIsNext={xIsNext}
					playerSymbol={playerSymbol}
					isMyTurn={isMyTurn}
					gameOver={gameOver}
					opponentDisconnected={opponentDisconnected}
					scores={scores}
				/>

				<GameBoard
					squares={squares}
					isMultiplayer={isMultiplayer}
					matchStatus={matchStatus}
					gameOver={gameOver}
					isMyTurn={isMyTurn}
					winnerInfo={winnerInfo}
					onSquareClick={handleSquareClick}
				/>

				<GameControls
					isMultiplayer={isMultiplayer}
					gameOver={gameOver}
					resetGame={resetGame}
					leaveParty={leaveParty}
					joinParty={joinParty}
					requestRematch={requestRematch}
					hasRequestedRematch={hasRequestedRematch}
					opponentRequestedRematch={opponentRequestedRematch}
					isVsComputer={isVsComputer}
					setIsVsComputer={setIsVsComputer}
					difficulty={difficulty}
					setDifficulty={setDifficulty}
				/>
			</div>
		</div>
	);
}

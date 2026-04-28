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
	} = useMultiplayer({
		onMoveReceived: applyMove,
		onReset: resetGame,
		groupId,
	});

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

	if (!isHydrated) return null;

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

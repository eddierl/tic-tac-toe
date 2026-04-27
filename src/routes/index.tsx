import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGame } from "#/hooks/useGame";
import { useMultiplayer } from "#/hooks/useMultiplayer";
import { GameBoard } from "../components/GameBoard";
import { GameControls } from "../components/GameControls";
import { GameStatus } from "../components/GameStatus";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [isHydrated, setIsHydrated] = useState(false);
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

	const {
		isMultiplayer,
		matchStatus,
		playerSymbol,
		joinParty,
		leaveParty,
		sendMove,
		switchSymbols,
	} = useMultiplayer({
		onMoveReceived: applyMove,
		onReset: resetGame,
	});

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const isMyTurn = isMultiplayer
		? (playerSymbol === "X" && xIsNext) || (playerSymbol === "O" && !xIsNext)
		: true;

	const handleSquareClick = (index: number) => {
		if (squares[index] || gameOver || !isMyTurn) return;
		if (isMultiplayer) sendMove(index);
		applyMove(index);
	};

	if (!isHydrated) return null;

	return (
		<div
			className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30 overflow-hidden text-white"
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
					switchSymbols={switchSymbols}
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
				/>
			</div>
		</div>
	);
}

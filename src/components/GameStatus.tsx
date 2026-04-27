import { Handshake, Trophy } from "lucide-react";

interface GameStatusProps {
	isMultiplayer: boolean;
	matchStatus: "idle" | "waiting" | "matched";
	winner: "X" | "O" | null;
	isDraw: boolean;
	xIsNext: boolean;
	playerSymbol: "X" | "O" | null;
	isMyTurn: boolean;
	gameOver: boolean;
	opponentDisconnected?: boolean;
}

export function GameStatus({
	isMultiplayer,
	matchStatus,
	winner,
	isDraw,
	xIsNext,
	playerSymbol,
	isMyTurn,
	gameOver,
	opponentDisconnected,
}: GameStatusProps) {
	return (
		<header className="w-full mb-8 text-center">
			<h1
				className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
				data-testid="game-status"
			>
				{isMultiplayer && opponentDisconnected ? (
					<span className="text-rose-400 animate-bounce flex items-center gap-2">
						Opponent Left! 💔
					</span>
				) : isMultiplayer && matchStatus === "waiting" ? (
					<span className="text-amber-300 animate-pulse flex items-center gap-2">
						Looking for opponent...
					</span>
				) : winner ? (
					<span className="flex items-center gap-2">
						<Trophy className="w-10 h-10 text-yellow-400" />
						Winner:{" "}
						<span
							className={winner === "X" ? "text-emerald-400" : "text-sky-400"}
						>
							{winner}
						</span>
					</span>
				) : isDraw ? (
					<span className="text-amber-400 flex items-center gap-2">
						<Handshake className="w-10 h-10" />
						Draw 🤝
					</span>
				) : (
					<span className="flex items-center gap-2">
						Next player:{" "}
						<span className={xIsNext ? "text-emerald-400" : "text-sky-400"}>
							{xIsNext ? "X" : "O"}
						</span>
					</span>
				)}
			</h1>

			{isMultiplayer && matchStatus === "matched" && (
				<div className="flex flex-col items-center gap-4">
					<div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm animate-in fade-in zoom-in duration-500">
						<span className="text-sm font-medium text-white/70">
							You are playing as{" "}
							<strong
								className={`text-xl font-black ${playerSymbol === "X" ? "text-emerald-400" : "text-sky-400"}`}
							>
								{playerSymbol}
							</strong>
						</span>
						<div className="w-px h-4 bg-white/20 mx-1" />
						{isMyTurn && !gameOver ? (
							<span className="text-sm font-bold text-emerald-300 animate-pulse">
								Your Turn
							</span>
						) : !gameOver ? (
							<span className="text-sm font-medium opacity-50 italic">
								Opponent's Turn
							</span>
						) : (
							<span className="text-sm font-bold text-indigo-300">
								Game Over
							</span>
						)}
					</div>
				</div>
			)}
		</header>
	);
}

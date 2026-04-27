import { Globe, LogOut, RefreshCw } from "lucide-react";

interface GameControlsProps {
	isMultiplayer: boolean;
	gameOver: boolean;
	resetGame: () => void;
	leaveParty: () => void;
	joinParty: () => void;
}

export function GameControls({
	isMultiplayer,
	gameOver,
	resetGame,
	leaveParty,
	joinParty,
}: GameControlsProps) {
	return (
		<footer className="mt-12 flex flex-col sm:flex-row gap-4 w-full">
			<button
				type="button"
				data-testid="restart"
				onClick={isMultiplayer ? leaveParty : resetGame}
				className={`
					flex-1 px-8 py-4 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-2
					transition-all duration-300 transform hover:-translate-y-1 active:scale-95
					${
						isMultiplayer
							? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-lg"
							: "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20 shadow-xl"
					}
					${gameOver && !isMultiplayer ? "animate-bounce shadow-indigo-500/40" : ""}
				`}
			>
				{isMultiplayer ? (
					<>
						<LogOut className="w-5 h-5" />
						Leave Party
					</>
				) : (
					<>
						<RefreshCw className="w-5 h-5" />
						Restart Game
					</>
				)}
			</button>

			{!isMultiplayer && (
				<button
					type="button"
					onClick={joinParty}
					className="flex-1 px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
						text-white rounded-2xl font-bold text-lg tracking-wide shadow-xl shadow-emerald-500/20
						transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
				>
					<Globe className="w-5 h-5" />
					Find Match 🌍
				</button>
			)}
		</footer>
	);
}

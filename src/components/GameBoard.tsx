import { Square } from "./Square";

interface GameBoardProps {
	squares: ("X" | "O" | null)[];
	isMultiplayer: boolean;
	matchStatus: "idle" | "waiting" | "matched";
	gameOver: boolean;
	isMyTurn: boolean;
	winnerInfo?: number[] | null;
	onSquareClick: (index: number) => void;
}

export function GameBoard({
	squares,
	isMultiplayer,
	matchStatus,
	gameOver,
	isMyTurn,
	winnerInfo,
	onSquareClick,
}: GameBoardProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		const target = e.target as HTMLElement;
		const indexAttr = target.getAttribute("data-index");
		if (indexAttr === null) return;

		const index = Number.parseInt(indexAttr, 10);
		let nextIndex = index;

		switch (e.key) {
			case "ArrowLeft":
			case "h":
				if (index % 3 > 0) nextIndex = index - 1;
				break;
			case "ArrowRight":
			case "l":
				if (index % 3 < 2) nextIndex = index + 1;
				break;
			case "ArrowUp":
			case "k":
				if (index >= 3) nextIndex = index - 3;
				break;
			case "ArrowDown":
			case "j":
				if (index <= 5) nextIndex = index + 3;
				break;
			default:
				return;
		}

		if (nextIndex !== index) {
			e.preventDefault();
			const squares = document.querySelectorAll<HTMLButtonElement>(
				'[data-testid="square"]',
			);
			squares[nextIndex]?.focus();
		}
	};

	return (
		<main
			onKeyDown={handleKeyDown}
			className={`grid grid-cols-3 gap-3 md:gap-4 bg-white/5 p-4 md:p-6 rounded-4xl shadow-2xl backdrop-blur-md border border-white/10 relative transition-all duration-500 ${
				isMultiplayer && matchStatus === "waiting"
					? "opacity-30 grayscale pointer-events-none scale-95"
					: "opacity-100 scale-100"
			}`}
		>
			<div className="absolute -inset-10 bg-indigo-500/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />

			{squares.map((val, i) => (
				<Square
					// biome-ignore lint/suspicious/noArrayIndexKey: rigid grid
					key={i}
					value={val}
					onClick={() => onSquareClick(i)}
					isWinning={winnerInfo?.includes(i)}
					disabled={!!val || gameOver || !isMyTurn || (isMultiplayer && matchStatus === "waiting")}
					dimmed={gameOver && !winnerInfo?.includes(i) && !!val}
					data-index={i}
				/>
			))}
		</main>
	);
}

import { useEffect, useState } from "react";
import type { MatchStatus, SquareValue } from "#/constants";
import { Square } from "./Square";

interface GameBoardProps {
	squares: SquareValue[];
	isMultiplayer: boolean;
	matchStatus: MatchStatus;
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
	const [pressedKey, setPressedKey] = useState<string | null>(null);

	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			setPressedKey(e.key);
		};
		const handleGlobalKeyUp = (e: KeyboardEvent) => {
			setPressedKey((prev) => (prev === e.key ? null : prev));
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		window.addEventListener("keyup", handleGlobalKeyUp);

		return () => {
			window.removeEventListener("keydown", handleGlobalKeyDown);
			window.removeEventListener("keyup", handleGlobalKeyUp);
		};
	}, []);

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

	const getKbdClass = (keyMatch: string) => {
		const isMatch =
			pressedKey?.toLowerCase() === keyMatch.toLowerCase() ||
			pressedKey === keyMatch;

		const base =
			"px-1.5 py-0.5 rounded-md border text-xs transition-all duration-150";
		if (isMatch) {
			return `${base} bg-indigo-500/60 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-110`;
		}
		return `${base} bg-white/10 border-white/10`;
	};

	return (
		<main className="flex flex-col items-center gap-6 mt-4">
			<div
				role="application"
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
						disabled={
							!!val ||
							gameOver ||
							!isMyTurn ||
							(isMultiplayer && matchStatus === "waiting")
						}
						dimmed={gameOver && !winnerInfo?.includes(i) && !!val}
						data-index={i}
						aria-label={`${["top", "center", "bottom"][Math.floor(i / 3)]} ${["left", "center", "right"][i % 3]} square`}
					/>
				))}
			</div>

			<div className="hidden md:flex items-center gap-2 text-sm text-white/40 font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5">
				<span>Navigate using</span>
				<div className="flex gap-2">
					<kbd className={getKbdClass("ArrowUp")}>↑</kbd>
					<kbd className={getKbdClass("ArrowDown")}>↓</kbd>
					<kbd className={getKbdClass("ArrowLeft")}>←</kbd>
					<kbd className={getKbdClass("ArrowRight")}>→</kbd>
				</div>
				<span>or</span>
				<div className="flex gap-2 font-mono">
					<kbd className={getKbdClass("h")}>H</kbd>
					<kbd className={getKbdClass("j")}>J</kbd>
					<kbd className={getKbdClass("k")}>K</kbd>
					<kbd className={getKbdClass("l")}>L</kbd>
				</div>
			</div>
		</main>
	);
}

import { Circle, X } from "lucide-react";
import type React from "react";
import type { SquareValue } from "#/constants";

interface SquareProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
	value: SquareValue;
	onClick: () => void;
	isWinning?: boolean;
	disabled?: boolean;
	dimmed?: boolean;
}

export function Square({
	value,
	onClick,
	isWinning,
	disabled,
	dimmed,
	...props
}: SquareProps) {
	return (
		<button
			data-testid="square"
			type="button"
			onClick={disabled ? undefined : onClick}
			aria-disabled={disabled}
			className={`
				relative w-20 h-20 md:w-28 md:h-28 text-5xl md:text-6xl font-black rounded-2xl 
				transition-all duration-300 flex items-center justify-center outline-none border-2
				focus-visible:ring-4 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-400
				${
					!value && !disabled
						? "hover:bg-white/10 cursor-pointer bg-black/20 border-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
						: "bg-black/40 border-transparent cursor-default"
				}
				${isWinning ? "scale-105 z-10 bg-indigo-500/30 border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.6)]" : ""}
				${dimmed ? "opacity-40 grayscale" : ""}
				${!disabled && !value ? "active:scale-90" : ""}
			`}
			{...props}
		>
			<div
				className={`
				transition-all duration-500 transform
				${value ? "scale-100 opacity-100" : "scale-0 opacity-0"}
				${isWinning ? "animate-bounce" : ""}
			`}
			>
				{value === "X" ? (
					<X
						className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
						strokeWidth={3}
					/>
				) : value === "O" ? (
					<Circle
						className="w-10 h-10 md:w-14 md:h-14 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
						strokeWidth={3}
					/>
				) : null}
				{value && <span className="sr-only">{value}</span>}
			</div>

			{!value && !disabled && (
				<div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 flex items-center justify-center">
					<X className="w-8 h-8 text-white" strokeWidth={1} />
				</div>
			)}
		</button>
	);
}

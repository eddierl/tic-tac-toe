export type MatchStatus = "idle" | "waiting" | "matched";
export type PlayerSymbol = "X" | "O";

export interface UseMultiplayerOptions {
	onMoveReceived: (index: number) => void;
	onReset: () => void;
}

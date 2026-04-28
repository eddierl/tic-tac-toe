export type MatchStatus = "idle" | "waiting" | "matched";

export interface UseMultiplayerOptions {
	onMoveReceived: (index: number) => void;
	onReset: () => void;
	groupId?: string;
}

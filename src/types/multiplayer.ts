export interface UseMultiplayerOptions {
	onMoveReceived: (index: number) => void;
	onReset: () => void;
	groupId?: string;
}

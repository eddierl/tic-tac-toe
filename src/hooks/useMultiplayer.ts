import { useCallback, useEffect, useRef, useState } from "react";
import type {
	MatchStatus,
	PlayerSymbol,
	UseMultiplayerOptions,
} from "../types/multiplayer";

export function useMultiplayer({
	onMoveReceived,
	onReset,
	groupId,
}: UseMultiplayerOptions) {
	const [isMultiplayer, setIsMultiplayer] = useState(false);
	const [matchStatus, setMatchStatus] = useState<MatchStatus>("idle");
	const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol | null>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const onMoveReceivedRef = useRef(onMoveReceived);
	const onResetRef = useRef(onReset);
	const groupIdRef = useRef(groupId);

	useEffect(() => {
		onMoveReceivedRef.current = onMoveReceived;
		onResetRef.current = onReset;
		groupIdRef.current = groupId;
	}, [onMoveReceived, onReset, groupId]);

	const leaveParty = useCallback(() => {
		if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}
		setIsMultiplayer(false);
		setMatchStatus("idle");
		setPlayerSymbol(null);
		onResetRef.current();
	}, []);

	const switchSymbols = useCallback(() => {
		wsRef.current?.send(JSON.stringify({ type: "switch_symbols" }));
	}, []);

	const joinParty = useCallback(() => {
		setIsMultiplayer(true);
		setMatchStatus("waiting");
		onResetRef.current();

		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
		wsRef.current = ws;

		ws.onopen = () =>
			ws.send(JSON.stringify({ type: "join", groupId: groupIdRef.current }));
		ws.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (data.type === "waiting") setMatchStatus("waiting");
			else if (data.type === "matched") {
				setMatchStatus("matched");
				setPlayerSymbol(data.symbol);
			} else if (data.type === "move") onMoveReceivedRef.current(data.index);
			else if (data.type === "switch_symbols")
				setPlayerSymbol((p) => (p === "X" ? "O" : "X"));
			else if (data.type === "opponent_disconnected") leaveParty();
		};
		ws.onerror = () => leaveParty();
		ws.onclose = () =>
			setMatchStatus((cur) => {
				if (cur !== "idle") {
					setIsMultiplayer(false);
					setPlayerSymbol(null);
					return "idle";
				}
				return cur;
			});
	}, [leaveParty]);

	const sendMove = useCallback((index: number) => {
		wsRef.current?.send(JSON.stringify({ type: "move", index }));
	}, []);

	useEffect(() => () => wsRef.current?.close(), []);

	return {
		isMultiplayer,
		matchStatus,
		playerSymbol,
		joinParty,
		leaveParty,
		sendMove,
		switchSymbols,
	};
}

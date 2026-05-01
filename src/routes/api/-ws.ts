import type { Peer } from "crossws";
import { defineWebSocketHandler } from "nitro/h3";

const waitingPeersByGroup = new Map<string, Peer[]>();
const activeGames = new Map<
	string,
	{ x: Peer; o: Peer; score: { x: number; o: number } }
>();
const peerGroup = new Map<string, string>();
const rematchRequests = new Set<string>();

export default defineWebSocketHandler({
	open(peer) {
		console.log("[ws] connected", peer.id);
	},
	message(peer, message) {
		const data = JSON.parse(message.text());
		const groupId = data.groupId || "default";

		console.log("[ws] message", peer.id, data);
		if (data.type === "join") {
			peerGroup.set(peer.id, groupId);
			const waitingPeers = waitingPeersByGroup.get(groupId) || [];

			if (waitingPeers.length > 0) {
				const opponent = waitingPeers.shift();
				if (!opponent) throw "Something went wrong";

				const gameData = {
					x: opponent,
					o: peer,
					scores: { [opponent.id]: 0, [peer.id]: 0 },
					isGameOver: false,
				};
				activeGames.set(peer.id, gameData);
				activeGames.set(opponent.id, gameData);

				opponent.send(
					JSON.stringify({
						type: "matched",
						symbol: "X",
						scores: { mine: 0, theirs: 0 },
					}),
				);
				peer.send(
					JSON.stringify({
						type: "matched",
						symbol: "O",
						scores: { mine: 0, theirs: 0 },
					}),
				);
			} else {
				waitingPeers.push(peer);
				waitingPeersByGroup.set(groupId, waitingPeers);
				peer.send(JSON.stringify({ type: "waiting" }));
			}
		} else if (data.type === "move") {
			const game = activeGames.get(peer.id);
			if (game) {
				const opponent = game.x.id === peer.id ? game.o : game.x;
				opponent.send(JSON.stringify({ type: "move", index: data.index }));
			}
		} else if (data.type === "game_over") {
			const game = activeGames.get(peer.id);
			if (game && !game.isGameOver && data.winner) {
				game.isGameOver = true;
				const winnerId = data.winner === "X" ? game.x.id : game.o.id;
				game.scores[winnerId]++;

				game.x.send(
					JSON.stringify({
						type: "score_update",
						scores: { mine: game.scores[game.x.id], theirs: game.scores[game.o.id] },
					}),
				);
				game.o.send(
					JSON.stringify({
						type: "score_update",
						scores: { mine: game.scores[game.o.id], theirs: game.scores[game.x.id] },
					}),
				);
			}
		} else if (data.type === "rematch") {
			const game = activeGames.get(peer.id);
			if (game) {
				const opponent = game.x.id === peer.id ? game.o : game.x;
				rematchRequests.add(peer.id);

				if (rematchRequests.has(opponent.id)) {
					// Both agreed, swap symbols and restart
					const newGame = {
						x: game.o,
						o: game.x,
						scores: game.scores,
						isGameOver: false,
					};
					activeGames.set(game.x.id, newGame);
					activeGames.set(game.o.id, newGame);

					newGame.x.send(
						JSON.stringify({
							type: "matched",
							symbol: "X",
							scores: {
								mine: newGame.scores[newGame.x.id],
								theirs: newGame.scores[newGame.o.id],
							},
						}),
					);
					newGame.o.send(
						JSON.stringify({
							type: "matched",
							symbol: "O",
							scores: {
								mine: newGame.scores[newGame.o.id],
								theirs: newGame.scores[newGame.x.id],
							},
						}),
					);

					rematchRequests.delete(game.x.id);
					rematchRequests.delete(game.o.id);
				} else {
					opponent.send(JSON.stringify({ type: "rematch_requested" }));
				}
			}
		}
	},
	close(peer, event) {
		console.log("[ws] close", peer.id, event);
		const groupId = peerGroup.get(peer.id);
		if (groupId) {
			const waitingPeers = waitingPeersByGroup.get(groupId);
			if (waitingPeers) {
				const index = waitingPeers.findIndex((p) => p.id === peer.id);
				if (index !== -1) {
					waitingPeers.splice(index, 1);
				}
				if (waitingPeers.length === 0) {
					waitingPeersByGroup.delete(groupId);
				}
			}
			peerGroup.delete(peer.id);
		}

		const game = activeGames.get(peer.id);
		if (game) {
			const opponent = game.x.id === peer.id ? game.o : game.x;
			try {
				opponent.send(JSON.stringify({ type: "opponent_disconnected" }));
			} catch {}

			activeGames.delete(game.x.id);
			activeGames.delete(game.o.id);
			rematchRequests.delete(game.x.id);
			rematchRequests.delete(game.o.id);
		}
	},
	error(peer, error) {
		console.error("[ws] error", peer.id, error);
	},
});

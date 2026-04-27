import type { Peer } from "crossws";
import { defineWebSocketHandler } from "nitro/h3";

const waitingPeers: Peer[] = [];
const activeGames = new Map<string, { x: Peer; o: Peer }>();

export default defineWebSocketHandler({
	open(peer) {
		console.log("[ws] connected", peer.id);
	},
	message(peer, message) {
		const data = JSON.parse(message.text());

		console.log("[ws] message", peer.id, data, waitingPeers, activeGames);
		if (data.type === "join") {
			if (waitingPeers.length > 0) {
				const opponent = waitingPeers.shift();
				if (!opponent) throw "Something went wrong";

				activeGames.set(peer.id, { x: opponent, o: peer });
				activeGames.set(opponent.id, { x: opponent, o: peer });

				opponent.send(JSON.stringify({ type: "matched", symbol: "X" }));
				peer.send(JSON.stringify({ type: "matched", symbol: "O" }));
			} else {
				waitingPeers.push(peer);
				peer.send(JSON.stringify({ type: "waiting" }));
			}
		} else if (data.type === "move") {
			const game = activeGames.get(peer.id);
			if (game) {
				const opponent = game.x.id === peer.id ? game.o : game.x;
				opponent.send(JSON.stringify({ type: "move", index: data.index }));
			}
		}
	},
	close(peer, event) {
		console.log("[ws] close", peer.id, event);
		const index = waitingPeers.findIndex((p) => p.id === peer.id);
		if (index !== -1) {
			waitingPeers.splice(index, 1);
		}

		const game = activeGames.get(peer.id);
		if (game) {
			const opponent = game.x.id === peer.id ? game.o : game.x;
			try {
				opponent.send(JSON.stringify({ type: "opponent_disconnected" }));
			} catch (e) {}

			activeGames.delete(game.x.id);
			activeGames.delete(game.o.id);
		}
	},
	error(peer, error) {
		console.error("[ws] error", peer.id, error);
	},
});

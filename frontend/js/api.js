// api.js

const host = `${window.location.hostname}:8000`;
export const ws = new WebSocket(`ws://${host}/ws`);

ws.onopen = () => {
	console.log("✅ WebSocket conectado a", host);
};

export function enviarMensaje(username, text) {
	const payload = { username, text };
	ws.send(JSON.stringify(payload));
}

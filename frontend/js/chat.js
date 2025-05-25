// chat.js
import { enviarMensaje, ws } from "./api.js";

const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const messageInput = document.getElementById("message");

let username = localStorage.getItem("chat-username") || "";

async function obtenerUsuario() {
	const ip = await obtenerDireccion();
	const response = await fetch(
		`http://${window.location.hostname}:8000/api/usuario?direccion=${ip}`
	);
	if (response.ok) {
		const data = await response.json();
		username = data.username;
	} else {
		username = prompt("Introduce tu nombre:")?.trim();
		if (username) {
			await fetch(`http://${window.location.hostname}:8000/api/usuario`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, direccion: ip }),
			});
			localStorage.setItem("chat-username", username);
		}
	}
}

function mostrarMensaje(msg) {
	if (!msg.username || !msg.text) return;

	const div = document.createElement("div");
	div.classList.add("message");
	div.classList.add(msg.username === username ? "mine" : "theirs");
	div.textContent = `${msg.username}: ${msg.text}`;
	chatBox.appendChild(div);
	chatBox.scrollTop = chatBox.scrollHeight;
}

async function cargarHistorial() {
	try {
		const res = await fetch(
			`http://${window.location.hostname}:8000/api/mensajes`
		);
		const texto = await res.text(); // 👈 obtenemos texto bruto

		const mensajes = JSON.parse(texto);
		mensajes.forEach(mostrarMensaje);
	} catch (err) {
		console.error("❌ Error cargando historial:", err);
	}

	setTimeout(() => {
		requestAnimationFrame(() => {
			chatBox.scrollTop = chatBox.scrollHeight;
		});
	}, 100);
}

ws.onmessage = (event) => {
	const msg = JSON.parse(event.data);
	mostrarMensaje(msg);
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const text = messageInput.value.trim();
	if (text && username) {
		enviarMensaje(username, text);
		messageInput.value = "";
	}
});

async function obtenerDireccion() {
	try {
		const res = await fetch("https://api.ipify.org?format=json");
		const data = await res.json();
		return data.ip;
	} catch {
		return "localhost";
	}
}
async function mostrarUsuarios() {
	try {
		const res = await fetch(
			`http://${window.location.hostname}:8000/api/usuarios`
		);
		const usuarios = await res.json();
		const div = document.getElementById("usuarios-lista");
		div.textContent = "Usuarios:\n" + usuarios.join("\n");
	} catch (err) {
		console.error("❌ Error cargando usuarios:", err);
	}
}

const emojiBtn = document.getElementById("emoji-btn");
const pickerContainer = document.createElement("div");
document.body.appendChild(pickerContainer);

const picker = document.createElement("emoji-picker");
picker.classList.add("dark"); // Usa 'light' para tema claro
picker.style.position = "absolute";
picker.style.display = "none";
pickerContainer.appendChild(picker);

emojiBtn.addEventListener("click", () => {
	emojiBtn.blur();
	const rect = emojiBtn.getBoundingClientRect();
	const wrapper = document.querySelector(".chat-wrapper");
	const wrapperRect = wrapper.getBoundingClientRect();

	// Calculamos posición relativa dentro del chat-wrapper
	const offsetTop = rect.top - wrapperRect.top - 400; // subimos encima del botón
	const offsetLeft = rect.left - wrapperRect.left;

	picker.style.position = "absolute";
	picker.style.top = `${offsetTop}px`;
	picker.style.left = `${offsetLeft}px`;
	picker.style.zIndex = "9999";
	picker.style.display = picker.style.display === "none" ? "block" : "none";
});

picker.addEventListener("emoji-click", (event) => {
	messageInput.value += event.detail.unicode;
	picker.style.display = "none";
});
document.addEventListener("click", (e) => {
	if (!picker.contains(e.target) && e.target !== emojiBtn) {
		picker.style.display = "none";
	}
});
picker.style.zIndex = "9999";
document.body.appendChild(pickerContainer);

document.querySelector(".chat-wrapper").appendChild(pickerContainer);

(async () => {
	await obtenerUsuario();
	await cargarHistorial();
	await mostrarUsuarios(); // 👈 aquí
})();

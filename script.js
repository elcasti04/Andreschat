const API_KEY = 'AIzaSyD3ZdF6fzciOi-d-QNY_7yQA-6N6A18h8E';

const chat = document.getElementById('chat');
const input = document.getElementById('input');

input.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		enviar();
	}
});

function agregarMensaje(texto) {
	const p = document.createElement('p');
	p.textContent = texto;
	chat.appendChild(p);
}

async function enviar() {
	const input = document.getElementById('input');
	const texto = input.value;

	agregarMensaje('Tú: ' + texto);

	const respuesta = await obtenerRespuesta(texto);
	input.value = '';

	agregarMensaje('AndresGPT: ' + respuesta);
}

async function obtenerRespuesta(mensaje) {
	try {
		const res = await fetch(
			'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyD3ZdF6fzciOi-d-QNY_7yQA-6N6A18h8E',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: mensaje }],
						},
					],
				}),
			},
		);

		const data = await res.json();
		console.log(data);

		if (!res.ok) {
			return 'Error: ' + (data.error?.message || 'Problema con Gemini');
		}

		return (
			data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta 😢'
		);
	} catch (error) {
		console.error(error);
		return 'Error de conexión 😢';
	}
}
function hablar() {
	const recognition = new (
		window.SpeechRecognition || window.webkitSpeechRecognition
	)();
	recognition.lang = 'es-ES';

	recognition.start();

	recognition.onresult = function (event) {
		const texto = event.results[0][0].transcript;
		document.getElementById('input').value = texto;
		enviar();
	};
}

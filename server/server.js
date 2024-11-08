const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {};

wss.on('connection', (ws) => {
	ws.on('message', (message) => {
		const data = JSON.parse(message);

		switch (data.type) {
			case 'join':
				handleJoin(ws, data.roomId);
				break;
			case 'signal':
				handleSignal(ws, data.roomId, data.signal);
				break;
			case 'message':
				handleMessage(ws, data.roomId, data.message);
				break;
		}
	});

	ws.on('close', () => {
		handleDisconnect(ws);
	});
});

function handleJoin(ws, roomId) {
	if (!rooms[roomId]) {
		rooms[roomId] = [];
	}

	if (rooms[roomId].length < 2) {
		rooms[roomId].push(ws);
		ws.roomId = roomId;

		if (rooms[roomId].length === 2) {
			rooms[roomId].forEach((client) =>
				client.send(JSON.stringify({ type: 'ready' }))
			);
		}
	} else {
		ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
	}
}

function handleSignal(ws, roomId, signal) {
	const otherClient = rooms[roomId]?.find((client) => client !== ws);
	if (otherClient) {
		otherClient.send(JSON.stringify({ type: 'signal', signal }));
	}
}

function handleMessage(ws, roomId, message) {
	rooms[roomId]?.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({ type: 'message', message }));
		}
	});
}

function handleDisconnect(ws) {
	const roomId = ws.roomId;
	if (roomId && rooms[roomId]) {
		rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
		if (rooms[roomId].length === 0) {
			delete rooms[roomId];
		}
	}
}

console.log('WebSocket server is running on ws://localhost:8080');

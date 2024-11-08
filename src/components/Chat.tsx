import React, { useState, useEffect, useRef } from 'react';

const Chat: React.FC<{ roomId: string }> = ({ roomId }) => {
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(`wss://your-chat-server.com/${roomId}`);
		ws.current.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};

		return () => ws.current?.close();
	}, [roomId]);

	const sendMessage = () => {
		if (newMessage && ws.current) {
			ws.current.send(newMessage);
			setMessages((prev) => [...prev, newMessage]);
			setNewMessage('');
		}
	};

	return (
		<div className="chat">
			<div className="messages h-64 overflow-y-scroll border p-2">
				{messages.map((msg, idx) => (
					<p key={idx} className="message">
						{msg}
					</p>
				))}
			</div>
			<input
				type="text"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				placeholder="Type a message..."
				className="border p-1 w-full"
			/>
			<button onClick={sendMessage} className="bg-blue-500 text-white p-1 mt-2">
				Send
			</button>
		</div>
	);
};

export default Chat;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
	const [roomIdInput, setRoomIdInput] = useState('');
	const navigate = useNavigate();

	const createRoom = () => {
		const newRoomId = uuidv4();
		navigate(`/room/${newRoomId}`);
	};

	const joinRoom = () => {
		if (roomIdInput.trim()) {
			navigate(`/room/${roomIdInput.trim()}`);
		} else {
			alert('Please enter a valid Room ID.');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen space-y-4">
			<button
				onClick={createRoom}
				className="bg-blue-500 text-white px-4 py-2 rounded-md">
				Create Room
			</button>
			<div className="flex flex-col items-center">
				<input
					type="text"
					placeholder="Enter Room ID"
					value={roomIdInput}
					onChange={(e) => setRoomIdInput(e.target.value)}
					className="border p-2 rounded-md mb-2"
				/>
				<button
					onClick={joinRoom}
					className="bg-green-500 text-white px-4 py-2 rounded-md">
					Join Room
				</button>
			</div>
		</div>
	);
};

export default Home;

import React from 'react';
import { useParams } from 'react-router-dom';
import VideoChat from '../components/VideoChat';
import Chat from '../components/Chat';

const Room: React.FC = () => {
	const { roomId } = useParams<{ roomId: string }>();

	if (!roomId) {
		return <div className="p-4">Invalid Room ID</div>;
	}

	return (
		<div className="room-page p-4">
			<h2 className="text-xl mb-4">Room ID: {roomId}</h2>
			<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
				<VideoChat roomId={roomId} />
				<Chat roomId={roomId} />
			</div>
		</div>
	);
};

export default Room;

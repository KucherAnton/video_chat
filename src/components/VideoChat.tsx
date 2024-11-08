import React, { useRef, useEffect, useState } from 'react';

const VideoChat: React.FC<{ roomId: string }> = ({ roomId }) => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(`ws://localhost:8080`);
		ws.current.onopen = () => {
			ws.current?.send(JSON.stringify({ type: 'join', roomId }));
		};

		ws.current.onmessage = async (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'ready' && peerConnection.current) {
				const offer = await peerConnection.current.createOffer();
				await peerConnection.current.setLocalDescription(offer);
				ws.current?.send(
					JSON.stringify({ type: 'signal', roomId, signal: offer })
				);
			} else if (data.type === 'signal' && peerConnection.current) {
				const signal = data.signal;

				if (signal.type === 'offer') {
					await peerConnection.current.setRemoteDescription(
						new RTCSessionDescription(signal)
					);
					const answer = await peerConnection.current.createAnswer();
					await peerConnection.current.setLocalDescription(answer);
					ws.current?.send(
						JSON.stringify({ type: 'signal', roomId, signal: answer })
					);
				} else if (signal.type === 'answer') {
					await peerConnection.current.setRemoteDescription(
						new RTCSessionDescription(signal)
					);
				} else if (signal.candidate) {
					await peerConnection.current.addIceCandidate(
						new RTCIceCandidate(signal)
					);
				}
			}
		};

		return () => ws.current?.close();
	}, [roomId]);

	useEffect(() => {
		const pc = new RTCPeerConnection();
		peerConnection.current = pc;

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				if (localVideoRef.current) localVideoRef.current.srcObject = stream;
				stream.getTracks().forEach((track) => pc.addTrack(track, stream));
			});

		pc.ontrack = (event) => {
			if (remoteVideoRef.current && event.streams[0]) {
				remoteVideoRef.current.srcObject = event.streams[0];
			}
		};

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				ws.current?.send(
					JSON.stringify({ type: 'signal', roomId, signal: event.candidate })
				);
			}
		};

		return () => pc.close();
	}, []);

	return (
		<div className="video-chat flex">
			<video
				ref={localVideoRef}
				autoPlay
				muted
				className="w-1/2 border rounded-lg"
			/>
			<video
				ref={remoteVideoRef}
				autoPlay
				className="w-1/2 border rounded-lg"
			/>
		</div>
	);
};

export default VideoChat;

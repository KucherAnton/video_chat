import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

const App: React.FC = () => {
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				stream.getTracks().forEach((track) => track.stop());
			})
			.catch((error) => {
				console.error('Ошибка доступа к камере или микрофону:', error);
			});
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:roomId" element={<Room />} />
			</Routes>
		</Router>
	);
};

export default App;

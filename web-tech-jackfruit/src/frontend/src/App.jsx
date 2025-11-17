import React, { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Stream from "./pages/Stream.jsx";
import Timer from "./pages/Timer.jsx";
import Discover from "./pages/Discover.jsx";
import Booking from "./pages/Booking.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import { apiPost } from "./api/client.js";

function Navbar() {
	const navigate = useNavigate();
	const isAuthed = Boolean(localStorage.getItem("token"));
	return (
		<nav className="nav">
			<div className="brand">Elevate</div>
			<NavLink to="/">Home</NavLink>
			<NavLink to="/discover">Discover</NavLink>
			<NavLink to="/timer">Timer</NavLink>
			<NavLink to="/about">About</NavLink>
			<div className="spacer" />
			{isAuthed ? (
				<>
					<NavLink to="/profile">Profile</NavLink>
					<NavLink to="/booking">Booking</NavLink>
					<button className="btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
				</>
			) : (
				<NavLink to="/login" className="btn">Login</NavLink>
			)}
		</nav>
	);
}

export default function App() {
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;
		const today = new Date().toISOString().slice(0, 10);
		const lastPing = localStorage.getItem("activity_last_ping");
		if (lastPing === today) return;
		apiPost("/activity/ping", {}).catch(() => {});
		localStorage.setItem("activity_last_ping", today);
	}, []);

	return (
		<>
			<Navbar />
			<div className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/stream/:id" element={<Stream />} />
					<Route path="/timer" element={<Timer />} />
					<Route path="/discover" element={<Discover />} />
					<Route path="/booking" element={<Booking />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/about" element={<About />} />
				</Routes>
			</div>
		</>
	);
}



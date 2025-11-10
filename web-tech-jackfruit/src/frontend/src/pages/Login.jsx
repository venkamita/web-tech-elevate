import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api/client.js";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [mode, setMode] = useState("login");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const path = mode === "login" ? "/auth/login" : "/auth/register";
			const body = mode === "login" ? { email, password } : { name, email, password, location };
			const data = await apiPost(path, body);
			localStorage.setItem("token", data.token);
			navigate("/");
		} catch (err) {
			setError("Authentication failed");
		}
	}

	return (
		<div className="stack" style={{ maxWidth: 420, margin: "48px auto" }}>
			<h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
			<form className="stack card" onSubmit={handleSubmit}>
				{mode === "register" && (
					<input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				)}
				<input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				{mode === "register" && (
					<input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
				)}
				<button className="btn" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
				<button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "transparent", color: "#93c5fd", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px" }}>
					Switch to {mode === "login" ? "Sign Up" : "Login"}
				</button>
				{error && <div style={{ color: "#fca5a5" }}>{error}</div>}
			</form>
		</div>
	);
}



import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/client.js";

export default function Profile() {
	const [user, setUser] = useState(null);
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	useEffect(() => {
		apiGet("/profile").then((u) => { setUser(u); setName(u?.name || ""); setLocation(u?.location || ""); }).catch(() => {});
	}, []);
	async function save(e) {
		e.preventDefault();
		const u = await apiPut("/profile", { name, location });
		setUser(u);
	}
	if (!user) return <div>Please login to view your profile.</div>;
	return (
		<div className="stack" style={{ maxWidth: 520, margin: "0 auto" }}>
			<h2>Profile</h2>
			<form className="card stack" onSubmit={save}>
				<input className="input" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
				<button className="btn">Save</button>
			</form>
			<div className="card">
				<p>Email: {user.email}</p>
				<p>Streak: {user.streak} days</p>
			</div>
		</div>
	);
}



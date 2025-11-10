import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client.js";

export default function Booking() {
	const [classes, setClasses] = useState([]);
	const [classId, setClassId] = useState("");
	const [perWeek, setPerWeek] = useState(2);
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		apiGet("/classes").then((c) => { setClasses(c); setClassId(c[0]?._id || ""); }).catch(() => {});
		apiGet("/bookings").then(setBookings).catch(() => {});
	}, []);

	async function createBooking(e) {
		e.preventDefault();
		setError("");
		if (!classId) {
			setError("Please select a class before booking.");
			return;
		}
		const b = await apiPost("/bookings", { classId, perWeek });
		setBookings([b, ...bookings]);
	}

	return (
		<div className="stack" style={{ maxWidth: 640, margin: "0 auto" }}>
			<h2>Booking</h2>
			<form className="card stack" onSubmit={createBooking}>
				<label>Choose Teacher/Class</label>
				<select className="input" value={classId} onChange={(e) => setClassId(e.target.value)}>
					{classes.length === 0 && <option value="">No classes available</option>}
					{classes.map((c) => <option key={c._id} value={c._id}>{c.title} — {c.teacher?.name}</option>)}
				</select>
				<label>Number of classes per week</label>
				<input className="input" type="number" min="1" max="7" value={perWeek} onChange={(e) => setPerWeek(Number(e.target.value))} />
				<button className="btn" type="submit" disabled={!classId}>Confirm Booking</button>
				{error && <div style={{ color: "#fca5a5" }}>{error}</div>}
			</form>
			<div className="stack">
				<h3>Your Bookings</h3>
				<div className="grid">
					{bookings.map((b) => (
						<div key={b._id} className="card">
							<p>Per week: {b.perWeek}</p>
							<p>Status: {b.status}</p>
							<p>ID: {b._id}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



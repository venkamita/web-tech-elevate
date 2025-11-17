import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/client.js";

export default function Booking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
	const [classes, setClasses] = useState([]);
	const [classId, setClassId] = useState("");
	const [perWeek, setPerWeek] = useState(2);
	const [bookings, setBookings] = useState([]);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	useEffect(() => {
		apiGet("/classes").then((c) => {
			setClasses(c);
			const qpClass = searchParams.get("class");
			const qpTeacher = searchParams.get("teacher");
			let initial = "";
			if (qpClass && c.some((x) => x._id === qpClass)) {
				initial = qpClass;
			} else if (qpTeacher) {
				const match = c.find((x) => String(x.teacher?._id || x.teacher) === String(qpTeacher));
				if (match) initial = match._id;
			}
			setClassId(initial || c[0]?._id || "");
		}).catch(() => {});
		apiGet("/bookings").then(setBookings).catch(() => {});
	}, [searchParams]);

	const selectedClass = classes.find((c) => c._id === classId);
	const alreadyBookedSameTeacher = (() => {
		if (!selectedClass) return false;
		const teacherId = selectedClass.teacher?._id || selectedClass.teacher;
		return bookings.some((b) => {
			const bTeacher = b.class?.teacher?._id || b.class?.teacher;
			return String(bTeacher) === String(teacherId);
		});
	})();

	async function createBooking(e) {
		e.preventDefault();
		setError("");
		setInfo("");
		if (!classId) {
			// No class chosen: send user to Discover to pick a teacher/class
			navigate("/discover");
			return;
		}
		if (alreadyBookedSameTeacher) {
			setInfo("You already booked a class with this teacher.");
			return;
		}
		try {
			const b = await apiPost("/bookings", { classId, perWeek });
			setBookings([b, ...bookings]);
		} catch (err) {
			// Handle duplicate booking error surfaced from server (409)
			setInfo("You already booked a class with this teacher.");
		}
	}

	return (
		<div className="stack" style={{ maxWidth: 760, margin: "0 auto" }}>
			<div className="hero">
				<h2 className="title">Book a Class</h2>
				<p className="subtitle">Choose a class and frequency. We’ll confirm instantly.</p>
			</div>
			<form className="card stack" onSubmit={createBooking}>
				<div className="row" style={{ justifyContent: "space-between" }}>
					<div style={{ flex: 2 }}>
						<label>Choose Teacher/Class</label>
						<select className="input" value={classId} onChange={(e) => setClassId(e.target.value)}>
							{classes.length === 0 && <option value="">No classes available</option>}
							{classes.map((c) => <option key={c._id} value={c._id}>{c.title} — {c.teacher?.name}</option>)}
						</select>
						{selectedClass && (
							<p style={{ opacity: .85, margin: "6px 0 0" }}>Selected teacher: <strong>{selectedClass.teacher?.name}</strong></p>
						)}
					</div>
					<div style={{ flex: 1 }}>
						<label>Classes per week</label>
						<input className="input" type="number" min="1" max="7" value={perWeek} onChange={(e) => setPerWeek(Number(e.target.value))} />
					</div>
				</div>
				<div className="card-footer" style={{ borderTopColor: "#26334f" }}>
					<button className="btn" type="submit" disabled={!classId || alreadyBookedSameTeacher}>Confirm Booking</button>
					{alreadyBookedSameTeacher && <span className="chip" style={{ background: "#152036", borderColor: "#26334f" }}>You already booked a class with this teacher</span>}
				</div>
				{error && <div style={{ color: "#fca5a5" }}>{error}</div>}
				{info && <div style={{ color: "#a7f3d0" }}>{info}</div>}
			</form>
			<div className="stack">
				<h3>Your Bookings</h3>
				<div className="grid">
					{bookings.map((b) => (
						<div key={b._id} className="card">
							<p style={{ marginTop: 0, fontWeight: 700 }}>{b.class?.title} — {b.class?.teacher?.name || ""}</p>
							<div className="row" style={{ justifyContent: "space-between" }}>
								<span className="chip">Per week: {b.perWeek}</span>
								<span className="chip">Status: {b.status}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



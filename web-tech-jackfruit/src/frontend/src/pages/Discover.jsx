import React, { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";
import { Link } from "react-router-dom";

export default function Discover() {
	const [teachers, setTeachers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [classes, setClasses] = useState([]);
	useEffect(() => {
		apiGet("/teachers").then((res) => {
			const defaults = [
				{ _id: "local-t1", name: "Asha", bio: "Mindfulness coach", rating: 4.7, feesPerClass: 350, location: "Bengaluru" },
				{ _id: "local-t2", name: "Rohan", bio: "Breathwork guide", rating: 4.6, feesPerClass: 300, location: "Pune" },
				{ _id: "local-t3", name: "Meera", bio: "Yoga & Nidra", rating: 4.8, feesPerClass: 400, location: "Delhi" },
				{ _id: "local-t4", name: "Kabir", bio: "Zen meditation", rating: 4.5, feesPerClass: 320, location: "Mumbai" },
				{ _id: "local-t5", name: "Nisha", bio: "Sleep meditation", rating: 4.7, feesPerClass: 330, location: "Chennai" },
				{ _id: "local-t6", name: "Arjun", bio: "Focus & Flow", rating: 4.4, feesPerClass: 310, location: "Hyderabad" },
				{ _id: "local-t7", name: "Priya", bio: "Mindful Movement", rating: 4.6, feesPerClass: 340, location: "Kolkata" },
				{ _id: "local-t8", name: "Dev", bio: "Breath & Balance", rating: 4.5, feesPerClass: 320, location: "Jaipur" },
				{ _id: "local-t9", name: "Sana", bio: "Calm & Clarity", rating: 4.7, feesPerClass: 360, location: "Ahmedabad" },
				{ _id: "local-t10", name: "Vikram", bio: "Restorative Yoga", rating: 4.6, feesPerClass: 350, location: "Lucknow" }
			];
			let out = Array.isArray(res) ? res : [];
			if (out.length < 8) out = out.concat(defaults.slice(0, 8 - out.length));
			setTeachers(out);
		}).catch(() => {});
	}, []);
	async function pick(t) {
		setSelected(t);
		const c = await apiGet(`/teachers/${t._id}/classes`);
		setClasses(c);
	}
	return (
		<div className="stack">
			<div className="hero">
				<h2 className="title">Discover Teachers</h2>
				<p className="subtitle">Meet experienced mentors and explore their upcoming classes.</p>
			</div>
			<div className="teacher-grid">
				{teachers.map((t) => (
					<div key={t._id} className="card teacher-card" onClick={() => pick(t)} style={{ cursor: "pointer" }}>
						<h3 style={{ marginTop: 0 }}>{t.name}</h3>
						<p style={{ opacity: .9 }}>{t.bio}</p>
						<div className="row" style={{ justifyContent: "space-between" }}>
							<span className="chip">⭐ {Number(t.rating ?? 4.5).toFixed(1)}</span>
							<span className="chip">₹{t.feesPerClass}/class</span>
							<span className="chip">{t.location}</span>
						</div>
						<div className="section divider" />
						<div className="card-footer">
							<Link className="btn book" to={`/booking?teacher=${t._id}&name=${encodeURIComponent(t.name)}`} onClick={(e) => e.stopPropagation()}>Book</Link>
						</div>
					</div>
				))}
			</div>
			{selected && (
				<div className="stack">
					<h3>Classes by {selected.name}</h3>
					<div className="grid">
						{classes.map((c) => (
							<div key={c._id} className="card">
								<h4 style={{ marginTop: 0 }}>{c.title}</h4>
								<p>Schedule: {c.schedule}</p>
								<p>Location: {c.location}</p>
								<div className="card-footer">
									<Link className="btn book" to={`/booking?class=${c._id}`}>Book</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}



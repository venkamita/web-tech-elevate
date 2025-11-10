import React, { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";

export default function Discover() {
	const [teachers, setTeachers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [classes, setClasses] = useState([]);
	useEffect(() => {
		apiGet("/teachers").then(setTeachers).catch(() => {});
	}, []);
	async function pick(t) {
		setSelected(t);
		const c = await apiGet(`/teachers/${t._id}/classes`);
		setClasses(c);
	}
	return (
		<div className="stack">
			<h2>Discover Classes / Teachers</h2>
			<div className="grid">
				{teachers.map((t) => (
					<div key={t._id} className="card" onClick={() => pick(t)} style={{ cursor: "pointer" }}>
						<h3>{t.name}</h3>
						<p>{t.bio}</p>
						<p>Location: {t.location}</p>
						<p>Rating: ⭐ {t.rating}</p>
						<p>Fees: ₹{t.feesPerClass} / class</p>
					</div>
				))}
			</div>
			{selected && (
				<div className="stack">
					<h3>Classes by {selected.name}</h3>
					<div className="grid">
						{classes.map((c) => (
							<div key={c._id} className="card">
								<h4>{c.title}</h4>
								<p>Schedule: {c.schedule}</p>
								<p>Location: {c.location}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client.js";

export default function Home() {
	const [videos, setVideos] = useState([]);
	const [q, setQ] = useState("");
	useEffect(() => {
		apiGet("/videos").then(setVideos).catch(() => {});
	}, []);
	const filtered = videos.filter((v) => v.title.toLowerCase().includes(q.toLowerCase()));
	return (
		<div className="stack">
			<div className="row">
				<h2 style={{ margin: 0 }}>Meditation Videos</h2>
				<div className="spacer" />
				<input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
			</div>
			<div className="grid">
				{filtered.map((v) => (
					<div key={v._id} className="card">
						<video className="video" src={v.url} controls={false} />
						<h3>{v.title}</h3>
						<p style={{ opacity: 0.8 }}>{v.description}</p>
						<p style={{ opacity: 0.8 }}>By {v.teacher?.name} · ⭐ {v.avgRating}</p>
						<Link className="btn" to={`/stream/${v._id}`}>Stream</Link>
					</div>
				))}
			</div>
		</div>
	);
}



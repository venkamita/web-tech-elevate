import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client.js";

export default function Home() {
	const [videos, setVideos] = useState([]);
	const [q, setQ] = useState("");
	useEffect(() => {
		apiGet("/videos").then((res) => {
			const defaults = [
				{ _id: "local-1", title: "Morning Calm", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "10 min breathing", teacher: null, avgRating: 4.6 },
				{ _id: "local-2", title: "Evening Relax", url: "https://www.w3schools.com/html/movie.mp4", description: "Wind down", teacher: null, avgRating: 4.4 },
				{ _id: "local-3", title: "Deep Focus", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Focus and flow", teacher: null, avgRating: 4.5 },
				{ _id: "local-4", title: "Sleep Drift", url: "https://www.w3schools.com/html/movie.mp4", description: "Sleep meditation", teacher: null, avgRating: 4.3 },
				{ _id: "local-5", title: "Body Scan", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Awareness scan", teacher: null, avgRating: 4.2 },
				{ _id: "local-6", title: "Calm Waves", url: "https://www.w3schools.com/html/movie.mp4", description: "Soothing ocean", teacher: null, avgRating: 4.4 },
				{ _id: "local-7", title: "Soft Rain", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Rain ambience", teacher: null, avgRating: 4.1 },
				{ _id: "local-8", title: "Gentle Sunrise", url: "https://www.w3schools.com/html/movie.mp4", description: "Start the day", teacher: null, avgRating: 4.5 },
				{ _id: "local-9", title: "Mindful Break", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Quick reset", teacher: null, avgRating: 4.0 },
				{ _id: "local-10", title: "Evening Unwind", url: "https://www.w3schools.com/html/movie.mp4", description: "Unwind gently", teacher: null, avgRating: 4.2 }
			];
			const pool = [
				"https://www.w3schools.com/html/mov_bbb.mp4",
				"https://www.w3schools.com/html/movie.mp4",
				"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
			];
			let out = Array.isArray(res) ? res : [];
			// Fill missing URLs and top up with defaults to ensure enough playable items
			out = out.map((v, i) => ({ ...v, url: v.url || pool[i % pool.length] }));
			if (out.length < 10) {
				const needed = 10 - out.length;
				const add = defaults.slice(0, needed);
				out = out.concat(add);
			}
			setVideos(out);
		}).catch(() => {}); //error handling here
	}, []);
	const filtered = videos.filter((v) => v.title.toLowerCase().includes(q.toLowerCase()));
	return (
		<div className="stack">
			<div className="hero">
				<h1 className="title">Meditation Videos</h1>
				<p className="subtitle">Breathe in. Slow down. Explore calming sessions handpicked for focus and rest.</p>
			</div>
			<div className="searchbar">
				<input className="input" placeholder="Search videos, e.g. breathing, sleep, focus" value={q} onChange={(e) => setQ(e.target.value)} />
			</div>
			<div className="grid">
				{filtered.map((v, i) => {
					const pool = [
						"https://www.w3schools.com/html/mov_bbb.mp4",
						"https://www.w3schools.com/html/movie.mp4",
						"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
					];
					const src = v.url || pool[i % pool.length];
					return (
						<div key={v._id} className="card">
							<video
								className="video"
								src={src}
								muted
								autoPlay
								loop
								playsInline
								preload="metadata"
								onError={(e) => { e.currentTarget.src = pool[(i+1) % pool.length]; }}
							/>
							<h3>{v.title}</h3>
							<p style={{ opacity: 0.8 }}>{v.description}</p>
							<p style={{ opacity: 0.8 }}>{v.teacher?.name ? `By ${v.teacher.name}` : ""} {v.avgRating != null ? `· ⭐ ${Number(v.avgRating).toFixed(1)}` : "· ⭐ 4.5"}</p>
							<div className="card-footer">
								<Link className="btn play" to={`/stream/${v._id}`}>▶ Play</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

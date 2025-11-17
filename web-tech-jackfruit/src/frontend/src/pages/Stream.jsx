import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api/client.js";
import { Link } from "react-router-dom";

export default function Stream() {
	const { id } = useParams();
	const [video, setVideo] = useState(null);
	useEffect(() => {
		apiGet("/videos").then((vs) => setVideo(vs.find((v) => v._id === id) || vs[0])).catch(() => {});
	}, [id]);
	if (!video) return <div>Loading...</div>;

	const desc = (() => {
		const base = (video.description || "").trim();
		if (base && base.length > 40) return base;
		return `Settle in and breathe with "${video.title}" — a calming guided session designed to relax your body and focus your mind. Find a quiet spot, soften your gaze, and let your breath set a gentle rhythm. This practice helps release tension, increase clarity, and restore balance.`;
	})();
	return (
		<div className="stack watch">
			<div className="card" style={{ padding: 0 }}>
				<video className="video" src={video.url} controls />
			</div>
			<h1 className="watch-title">{video.title}</h1>
			<div className="meta">
				<span className="chip">By {video.teacher?.name || "Guest"}</span>
				<span className="chip">⭐ {Number(video.avgRating ?? 4.5).toFixed(1)}</span>
				<span className="chip">Meditation</span>
			</div>
			<div className="divider" />
			<div className="card">
				<h3 style={{ marginTop: 0 }}>About this session</h3>
				<p className="description">{desc}</p>
			</div>
		</div>
	);
}



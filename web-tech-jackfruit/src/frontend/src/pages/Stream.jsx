import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api/client.js";

export default function Stream() {
	const { id } = useParams();
	const [video, setVideo] = useState(null);
	useEffect(() => {
		apiGet("/videos").then((vs) => setVideo(vs.find((v) => v._id === id) || vs[0])).catch(() => {});
	}, [id]);
	if (!video) return <div>Loading...</div>;
	return (
		<div className="stack">
			<h2>{video.title}</h2>
			<video className="video" src={video.url} controls />
			<div className="card">
				<p>{video.description}</p>
				<p>Teacher: {video.teacher?.name}</p>
				<p>Reviews: ⭐ {video.avgRating}</p>
			</div>
		</div>
	);
}



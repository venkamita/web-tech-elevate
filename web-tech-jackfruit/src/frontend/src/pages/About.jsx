import React from "react";

export default function About() {
	return (
		<div className="stack" style={{ maxWidth: 880, margin: "0 auto" }}>
			<div className="hero card" style={{ padding: 32, textAlign: "center", background: "linear-gradient(135deg,#0f172a,#111827)", border: "1px solid #1f2937" }}>
				<h1 style={{ fontSize: 32, margin: 0 }}>Elevate</h1>
				<p style={{ opacity: 0.85, marginTop: 8 }}>Meditation and Yoga Platform</p>
			</div>
			<div className="card stack" style={{ padding: 24 }}>
				<h2 style={{ marginTop: 0 }}>About us</h2>
				<p><strong>Project:</strong> Elevate — Meditation and Yoga Platform</p>
				<p><strong>Team:</strong> Shishir Hegde (PES1UG24CS438), Shubham Kumar Singh (PES1UG24CS451), Sharat Doddihal (PES1UG24CS430)</p>
				<p>This web app offers meditation video streaming, a timer/audio tool, discovery of teachers and classes, booking, profile management, and more.</p>
			</div>
		</div>
	);
}



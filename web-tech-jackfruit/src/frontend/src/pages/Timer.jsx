import React, { useEffect, useRef, useState } from "react";

const bells = [
	{ label: "Soft Bell", url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" },
	{ label: "Tibetan Bowl", url: "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg" }
];

export default function Timer() {
	const [minutes, setMinutes] = useState(5);
	const [music, setMusic] = useState("");
	const [startBell, setStartBell] = useState(bells[0].url);
	const [endBell, setEndBell] = useState(bells[1].url);
	const [remaining, setRemaining] = useState(0);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef(null);

	useEffect(() => {
		return () => clearInterval(intervalRef.current);
	}, []);

	function play(url) {
		const a = new Audio(url);
		a.volume = 0.5;
		a.play();
	}

	function start() {
		if (running) return;
		play(startBell);
		setRemaining(minutes * 60);
		setRunning(true);
		if (music) {
			const m = new Audio(music);
			m.loop = true;
			m.volume = 0.2;
			m.play();
			intervalRef.current = setInterval(() => {
				setRemaining((s) => {
					if (s <= 1) {
						play(endBell);
						clearInterval(intervalRef.current);
						m.pause();
						setRunning(false);
						return 0;
					}
					return s - 1;
				});
			}, 1000);
		} else {
			intervalRef.current = setInterval(() => {
				setRemaining((s) => {
					if (s <= 1) {
						play(endBell);
						clearInterval(intervalRef.current);
						setRunning(false);
						return 0;
					}
					return s - 1;
				});
			}, 1000);
		}
	}

	function reset() {
		clearInterval(intervalRef.current);
		setRunning(false);
		setRemaining(0);
	}

	const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
	const ss = String(remaining % 60).padStart(2, "0");

	return (
		<div className="stack" style={{ maxWidth: 520, margin: "0 auto" }}>
			<h2>Timer / Audio Tool</h2>
			<div className="card stack">
				<label>Minutes</label>
				<input className="input" type="number" min="1" max="60" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
				<label>Background Music URL (optional)</label>
				<input className="input" placeholder="https://..." value={music} onChange={(e) => setMusic(e.target.value)} />
				<label>Start Bell</label>
				<select className="input" value={startBell} onChange={(e) => setStartBell(e.target.value)}>
					{bells.map((b) => <option key={b.url} value={b.url}>{b.label}</option>)}
				</select>
				<label>End Bell</label>
				<select className="input" value={endBell} onChange={(e) => setEndBell(e.target.value)}>
					{bells.map((b) => <option key={b.url} value={b.url}>{b.label}</option>)}
				</select>
				<div className="row">
					<button className="btn" onClick={start} disabled={running}>Start</button>
					<button className="btn" onClick={reset} style={{ background: "#a78bfa", color: "#0b1220" }}>Reset</button>
					<div className="spacer" />
					<div style={{ fontSize: 28, fontWeight: 800 }}>{mm}:{ss}</div>
				</div>
			</div>
		</div>
	);
}



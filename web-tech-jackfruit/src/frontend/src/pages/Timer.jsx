import React, { useEffect, useRef, useState } from "react";

// Preset sounds
const PRESET_END_BELL = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_7b2a9a2d7f.mp3?filename=soft-bell-6126.mp3";
const bellOptions = [
    { label: "(None)", value: "none" },
    { label: "Soft Bell", value: "gen:bell" },
    { label: "Gong Hit", value: "gen:gong" }
];

const musicOptions = [
    { label: "(None)", value: "none" },
    { label: "Delta Waves", value: "gen:deltawaves" },
    { label: "Rain", value: "gen:rain" },
    { label: "Brown Noise", value: "gen:brown" }
];

export default function Timer() {
    const [minutes, setMinutes] = useState(5);
    const [bgMusic, setBgMusic] = useState("gen:deltawaves");
    const [startBell, setStartBell] = useState(""); // store option value, e.g., gen:bell, url:...
    const [endBell, setEndBell] = useState("");   // if empty, use preset on finish
    const [remaining, setRemaining] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    const musicRef = useRef(null);
    const previewRef = useRef(null);
    const [msg, setMsg] = useState("");

    // WebAudio helpers (generated sounds)
    const audioCtxRef = useRef(null);
    function getCtx() {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtxRef.current;
    }

    function stopNode(node) { try { if (node && node.stop) node.stop(); } catch {} }

    function playGenBell(type = "bell", vol = 0.6, seconds = 1.8) {
        const ctx = getCtx();
        const now = ctx.currentTime;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
        gain.connect(ctx.destination);
        const baseFreq = type === "gong" ? 220 : 660;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq / 2, now + seconds);
        const mod = ctx.createOscillator();
        mod.type = "sine";
        mod.frequency.value = 4;
        const modGain = ctx.createGain();
        modGain.gain.value = 6;
        mod.connect(modGain).connect(osc.frequency);
        osc.connect(gain);
        osc.start(now);
        mod.start(now);
        osc.stop(now + seconds);
        mod.stop(now + seconds);
        return { stop: () => { stopNode(osc); stopNode(mod); gain.disconnect(); } };
    }

    function playGenAmbient(kind = "deltawaves", vol = 0.25) {
        const ctx = getCtx();
        const gain = ctx.createGain();
        gain.gain.value = vol;
        gain.connect(ctx.destination);
        if (kind === "deltawaves") {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            osc1.type = "sine"; osc2.type = "sine";
            osc1.frequency.value = 110; osc2.frequency.value = 114; // slight beat
            osc1.connect(gain); osc2.connect(gain);
            osc1.start(); osc2.start();
            return { stop: () => { stopNode(osc1); stopNode(osc2); gain.disconnect(); } };
        }
        // noise
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            if (kind === "brown") {
                lastOut = (lastOut + (0.02 * white)) / 1.02;
                output[i] = lastOut * 3.5; // brown
            } else {
                // rain-like: filtered pink-ish
                output[i] = (output[i-1] || 0) * 0.98 + white * 0.02;
            }
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = kind === "brown" ? 400 : 1200;
        noise.connect(filter).connect(gain);
        noise.start();
        return { stop: () => { stopNode(noise); gain.disconnect(); } };
    }

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            if (musicRef.current) { try { if (musicRef.current.stop) musicRef.current.stop(); else if (musicRef.current.pause) musicRef.current.pause(); } catch {} }
            if (previewRef.current) { try { if (previewRef.current.stop) previewRef.current.stop(); else if (previewRef.current.pause) previewRef.current.pause(); } catch {} }
        };
    }, []);

    function play(url, vol = 0.5) {
        if (!url) return null;
        try {
            const a = new Audio();
            a.crossOrigin = "anonymous";
            a.src = url;
            a.volume = vol;
            const p = a.play();
            if (p && typeof p.then === "function") {
                p.catch(() => setMsg("Playback blocked by the browser. Try interacting with the page and retry."));
            }
            return a;
        } catch {
            setMsg("Could not start audio. Please try again.");
            return null;
        }
    }

    function stopPreview() {
        if (!previewRef.current) return;
        const h = previewRef.current;
        try { if (h.stop) h.stop(); else if (h.pause) h.pause(); } catch {}
        previewRef.current = null;
    }

    function start() {
        if (running) return;
        const startUrl = startBell.startsWith("gen:") ? startBell : (startBell === "none" ? "" : startBell);
        const endSel = endBell.startsWith("gen:") ? endBell : (endBell === "none" ? "" : endBell);
        const endEffective = endSel || PRESET_END_BELL;

        stopPreview();
        setMsg("");
        if (startBell.startsWith("gen:")) {
            playGenBell(startBell.slice(4), 0.6);
        } else if (startUrl) {
            play(startUrl, 0.6);
        }
        setRemaining(minutes * 60);
        setRunning(true);

        if (musicRef.current) { try { if (musicRef.current.stop) musicRef.current.stop(); else if (musicRef.current.pause) musicRef.current.pause(); } catch {} }
        if (bgMusic && bgMusic !== "none") {
            if (bgMusic.startsWith("gen:")) {
                musicRef.current = playGenAmbient(bgMusic.slice(4), 0.25);
            }
        }

        intervalRef.current = setInterval(() => {
            setRemaining((s) => {
                if (s <= 1) {
                    if (musicRef.current) {
                        if (musicRef.current.stop) musicRef.current.stop(); else musicRef.current.pause();
                        musicRef.current = null;
                    }
                    if (endSel && endBell.startsWith("gen:")) {
                        playGenBell(endBell.slice(4), 0.7);
                    } else if (endEffective) {
                        play(endEffective, 0.7);
                    }
                    clearInterval(intervalRef.current);
                    setRunning(false);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }

    function reset() {
        clearInterval(intervalRef.current);
        if (musicRef.current) { try { if (musicRef.current.stop) musicRef.current.stop(); else if (musicRef.current.pause) musicRef.current.pause(); } catch {} }
        musicRef.current = null;
        stopPreview();
        setRunning(false);
        setRemaining(0);
    }

    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");

    return (
        <div className="stack" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="hero">
                <h2 className="title">Meditation Timer</h2>
                <p className="subtitle">Choose a duration, optional background ambience, and bells.</p>
            </div>
            <div className="card stack">
                <label>Minutes</label>
                <input className="input" type="number" min="1" max="120" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
                <div className="row" style={{ gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <label>Background Music</label>
                        <select className="input" value={bgMusic} onChange={(e) => setBgMusic(e.target.value)}>
                            {musicOptions.map((m) => <option key={m.label} value={m.value}>{m.label}</option>)}
                        </select>
                        <div className="row" style={{ justifyContent: "flex-start" }}>
                            <button type="button" className="btn" onClick={() => {
                                stopPreview();
                                if (!bgMusic || bgMusic === "none") return;
                                setMsg("");
                                if (bgMusic.startsWith("gen:")) {
                                    const h = playGenAmbient(bgMusic.slice(4), 0.25);
                                    previewRef.current = h;
                                    setTimeout(() => { if (previewRef.current === h && h.stop) h.stop(); }, 6000);
                                } else if (bgMusic.startsWith("url:")) {
                                    const a = play(bgMusic.slice(4), 0.25);
                                    if (!a) return; previewRef.current = a; setTimeout(() => { if (previewRef.current === a) a.pause(); }, 6000);
                                }
                            }}>Preview</button>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Start Bell</label>
                        <select className="input" value={startBell} onChange={(e) => setStartBell(e.target.value)}>
                            {bellOptions.map((b) => <option key={b.label} value={b.value}>{b.label}</option>)}
                        </select>
                        <div className="row" style={{ justifyContent: "flex-start" }}>
                            <button type="button" className="btn" onClick={() => {
                                stopPreview();
                                if (!startBell || startBell === "none") return;
                                setMsg("");
                                if (startBell.startsWith("gen:")) {
                                    const h = playGenBell(startBell.slice(4), 0.6);
                                    previewRef.current = h;
                                    setTimeout(() => { if (previewRef.current === h && h.stop) h.stop(); }, 4000);
                                } else if (startBell.startsWith("url:")) {
                                    const a = play(startBell.slice(4), 0.6); if (!a) return; previewRef.current = a; setTimeout(() => { if (previewRef.current === a) a.pause(); }, 4000);
                                }
                            }}>Preview</button>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>End Bell</label>
                        <select className="input" value={endBell} onChange={(e) => setEndBell(e.target.value)}>
                            {bellOptions.map((b) => <option key={b.label} value={b.value}>{b.label}</option>)}
                        </select>
                        <div className="row" style={{ justifyContent: "flex-start" }}>
                            <button type="button" className="btn" onClick={() => {
                                stopPreview();
                                if (!endBell || endBell === "none") return;
                                setMsg("");
                                if (endBell.startsWith("gen:")) {
                                    const h = playGenBell(endBell.slice(4), 0.7);
                                    previewRef.current = h;
                                    setTimeout(() => { if (previewRef.current === h && h.stop) h.stop(); }, 3000);
                                } else if (endBell.startsWith("url:")) {
                                    const a = play(endBell.slice(4), 0.7); if (!a) return; previewRef.current = a; setTimeout(() => { if (previewRef.current === a) a.pause(); }, 4000);
                                }
                            }}>Preview</button>
                        </div>
                    </div>
                </div>
                {msg && <div style={{ color: "#fca5a5" }}>{msg}</div>}
                <div className="section divider" />
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

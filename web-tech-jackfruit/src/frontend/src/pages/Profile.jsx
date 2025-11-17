import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/client.js";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiGet("/profile").then((u) => { setUser(u); setName(u?.name || ""); setLocation(u?.location || ""); }).catch(() => {});
    }, []);

    async function save(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const u = await apiPut("/profile", { name, location });
            setUser(u);
        } finally {
            setSaving(false);
        }
    }

    if (!user) return <div className="card" style={{ maxWidth: 560, margin: "2rem auto", textAlign: "center" }}>Please login to view your profile.</div>;

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate + "T00:00:00Z").toUTCString().slice(0, 16) : "—";

    return (
        <div className="stack" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Profile</h2>
                    <div style={{ opacity: 0.8 }}>Welcome back, {name || user.name}</div>
                </div>
                <div className="card" style={{ padding: "16px 20px", textAlign: "center", background: "linear-gradient(135deg,#22c55e20,#16a34a20)", border: "1px solid #16a34a40" }}>
                    <div style={{ width: 88, height: 88, borderRadius: "50%", background: "conic-gradient(#22c55e,#16a34a,#a7f3d0,#22c55e)", display: "grid", placeItems: "center", margin: "0 auto 8px" }}>
                        <div style={{ background: "#0b1220", width: 74, height: 74, borderRadius: "50%", display: "grid", placeItems: "center", color: "#22c55e", fontSize: 26, fontWeight: 800 }}>{user.streak || 0}</div>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>day streak</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Last active: {lastActive}</div>
                </div>
            </div>

            <form className="card stack" onSubmit={save} style={{ padding: 24 }}>
                <label>Name</label>
                <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Location</label>
                <input className="input" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
                <label>Email</label>
                <input className="input" value={user.email} disabled />
                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <button className="btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                </div>
            </form>
        </div>
    );
}



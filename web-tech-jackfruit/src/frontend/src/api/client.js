const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export function getAuthHeaders() {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
	const res = await fetch(`${API_BASE}${path}`, { headers: { ...getAuthHeaders() } });
	if (!res.ok) throw new Error(`GET ${path} failed`);
	return res.json();
}

export async function apiPost(path, body) {
	const res = await fetch(`${API_BASE}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...getAuthHeaders() },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`POST ${path} failed`);
	return res.json();
}

export async function apiPut(path, body) {
	const res = await fetch(`${API_BASE}${path}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json", ...getAuthHeaders() },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`PUT ${path} failed`);
	return res.json();
}



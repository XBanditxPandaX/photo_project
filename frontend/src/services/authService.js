const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion.');
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authEmail', data.email);
    return data;
}

export async function register(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription.");
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authEmail', data.email);
    return data;
}

export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
}

export function getToken() {
    return localStorage.getItem('authToken');
}

export function getEmail() {
    return localStorage.getItem('authEmail');
}

export function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

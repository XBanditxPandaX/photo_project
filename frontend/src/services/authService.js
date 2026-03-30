const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function saveSession(data) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authEmail', data.email);
    localStorage.setItem('authIsAdmin', String(Boolean(data.isAdmin)));
}

export async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion.');
    saveSession(data);
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
    saveSession(data);
    return data;
}

export async function syncCurrentUser() {
    const token = getToken();
    if (!token) {
        logout();
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        logout();
        throw new Error('Session invalide.');
    }

    const data = await res.json();
    localStorage.setItem('authEmail', data.email);
    localStorage.setItem('authIsAdmin', String(Boolean(data.isAdmin)));
    return data;
}

export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authIsAdmin');
}

export function getToken() {
    return localStorage.getItem('authToken');
}

export function getEmail() {
    return localStorage.getItem('authEmail');
}

export function isAdmin() {
    return localStorage.getItem('authIsAdmin') === 'true';
}

export function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

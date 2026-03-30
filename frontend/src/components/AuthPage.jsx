import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login, register } from '../services/authService.js';

export default function AuthPage() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await login(email, password);
            } else {
                await register(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">
                    {tab === 'login' ? 'Connexion' : 'Inscription'}
                </h1>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
                        onClick={() => { setTab('login'); setError(''); }}
                        type="button"
                    >
                        Se connecter
                    </button>
                    <button
                        className={`auth-tab ${tab === 'register' ? 'auth-tab--active' : ''}`}
                        onClick={() => { setTab('register'); setError(''); }}
                        type="button"
                    >
                        S'inscrire
                    </button>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="auth-email">Email</label>
                        <input
                            id="auth-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="auth-password">Mot de passe</label>
                        <input
                            id="auth-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button className="btn-submit auth-submit" type="submit" disabled={loading}>
                        {loading
                            ? 'Chargement...'
                            : tab === 'login' ? 'Se connecter' : "S'inscrire"
                        }
                    </button>
                </form>

                <p className="auth-back">
                    <a href="/">← Retour à la galerie</a>
                </p>
            </div>
        </div>
    );
}

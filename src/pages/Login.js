import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const css = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .login-wrap {
      min-height: 100vh;
      background: linear-gradient(135deg, #fff7ed 0%, #f2f2f2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Open Sans','Segoe UI',sans-serif;
    }

    .login-left {
      display: none;
      flex: 1;
      max-width: 480px;
      padding: 40px;
    }

    .login-card {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      animation: fadeIn 0.4s ease;
    }

    .login-logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-logo-icon {
      width: 68px; height: 68px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin: 0 auto 14px;
      box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    }
    .login-logo h1 {
      font-size: 24px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 6px;
    }
    .login-logo p {
      font-size: 13px;
      color: #999;
      margin: 0;
    }

    .login-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #555;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .login-input-wrap {
      position: relative;
    }

    .login-input {
      width: 100%;
      padding: 13px 14px;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      background: #fafafa;
      color: #1a1a1a;
    }
    .login-input:focus {
      border-color: #f97316;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
    }

    .login-eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #aaa;
      padding: 0;
    }
    .login-eye-btn:hover { color: #f97316; }

    .login-field { margin-bottom: 18px; }

    .login-error {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #dc2626;
      padding: 12px 14px;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      background: #f97316;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      margin-top: 4px;
    }
    .login-btn:hover:not(:disabled) {
      background: #ea580c;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(249,115,22,0.35);
    }
    .login-btn:disabled {
      background: #fdba74;
      cursor: not-allowed;
      transform: none;
    }

    .login-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
    }
    .login-divider-line {
      flex: 1;
      height: 1px;
      background: #e8e8e8;
    }
    .login-divider-text {
      font-size: 12px;
      color: #bbb;
      font-weight: 600;
    }

    .login-features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .login-feature {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 10px 12px;
    }
    .login-feature-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #888;
    }
    .login-footer a {
      color: #f97316;
      font-weight: 700;
      text-decoration: none;
    }
    .login-footer a:hover { text-decoration: underline; }

    .login-terms {
      text-align: center;
      font-size: 11px;
      color: #bbb;
      margin-top: 16px;
      line-height: 1.6;
    }
    .login-terms a { color: #f97316; text-decoration: none; }

    @media (min-width: 900px) {
      .login-left { display: flex; flex-direction: column; justify-content: center; }
      .login-wrap { gap: 40px; }
    }

    @media (max-width: 480px) {
      .login-card { padding: 28px 18px; }
      .login-features { grid-template-columns: 1fr; }
    }
  `;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const profileRes = await fetch('http://127.0.0.1:8000/api/users/profile/', {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const profile = await profileRes.json();
        localStorage.setItem('user_role', profile.role);
        localStorage.setItem('username', profile.username);
        window.location.href = '/';
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <style>{css}</style>

      {/* COLONNE GAUCHE (visible sur grand écran) */}
      <div className="login-left">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.2 }}>
            Bienvenue sur<br />
            <span style={{ color: '#f97316' }}>Mini Marketplace</span>
          </h2>
          <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, margin: 0 }}>
            La plateforme locale pour acheter et vendre facilement au Sénégal.
          </p>
        </div>

        {[
          { icon: '🚀', title: 'Rapide & Facile', desc: 'Publiez en moins de 2 minutes' },
          { icon: '🔒', title: '100% Sécurisé', desc: 'Vos données sont protégées' },
          { icon: '📍', title: 'Local', desc: 'Près de chez vous à Dakar' },
          { icon: '💰', title: 'Gratuit', desc: 'Aucun frais de publication' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, padding: '14px 18px' }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CARTE LOGIN */}
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🛒</div>
          <h1>Mini Marketplace</h1>
          <p>Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="login-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Nom d'utilisateur</label>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Mot de passe</label>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                style={{ paddingRight: 40 }}
                required
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ Connexion en cours...' : '🔐 Se connecter'}
          </button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">ou</span>
          <div className="login-divider-line" />
        </div>

        <div className="login-features">
          {[
            { icon: '🚀', text: 'Publication rapide' },
            { icon: '🔒', text: 'Compte sécurisé' },
            { icon: '💬', text: 'Messagerie incluse' },
            { icon: '📍', text: 'Vendeurs locaux' },
          ].map(({ icon, text }) => (
            <div key={text} className="login-feature">
              <span className="login-feature-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="login-footer">
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte gratuitement</Link>
        </div>

        <div className="login-terms">
          En vous connectant, vous acceptez nos{' '}
          <a href="#">Conditions d'utilisation</a> et notre{' '}
          <a href="#">Politique de confidentialité</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
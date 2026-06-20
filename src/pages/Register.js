import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: '', telephone: '', ville: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const css = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reg-wrap {
      min-height: 100vh;
      background: linear-gradient(135deg, #fff7ed 0%, #f2f2f2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Open Sans','Segoe UI',sans-serif;
    }
    .reg-card {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      animation: fadeIn 0.4s ease;
    }
    .reg-logo {
      text-align: center;
      margin-bottom: 28px;
    }
    .reg-logo-icon {
      width: 64px; height: 64px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      margin: 0 auto 12px;
    }
    .reg-logo h1 {
      font-size: 22px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 4px;
    }
    .reg-logo p {
      font-size: 13px;
      color: #999;
      margin: 0;
    }
    .reg-step-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 28px;
    }
    .reg-step-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #e8e8e8;
      transition: all 0.3s;
    }
    .reg-step-dot.active {
      background: #f97316;
      transform: scale(1.3);
    }
    .reg-step-line {
      width: 40px; height: 2px;
      background: #e8e8e8;
    }
    .reg-role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 24px;
    }
    .reg-role-card {
      border: 2px solid #e8e8e8;
      border-radius: 8px;
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fff;
      font-family: inherit;
    }
    .reg-role-card:hover {
      border-color: #f97316;
      background: #fff7ed;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(249,115,22,0.15);
    }
    .reg-role-icon { font-size: 40px; margin-bottom: 10px; }
    .reg-role-name { font-size: 16px; font-weight: 700; color: #1a1a1a; }
    .reg-role-desc { font-size: 12px; color: #999; margin-top: 4px; }

    .reg-selected-role {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 4px;
      padding: 12px 16px;
      margin-bottom: 22px;
      font-size: 14px;
      font-weight: 600;
      color: #f97316;
    }
    .reg-change-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: #999;
      font-size: 13px;
      cursor: pointer;
      font-family: inherit;
      padding: 0;
    }
    .reg-change-btn:hover { color: #f97316; }

    .reg-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #555;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .reg-input {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      background: #fafafa;
    }
    .reg-input:focus {
      border-color: #f97316;
      background: #fff;
    }
    .reg-field { margin-bottom: 16px; }
    .reg-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .reg-error {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #dc2626;
      padding: 12px 14px;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .reg-btn {
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
    .reg-btn:hover:not(:disabled) {
      background: #ea580c;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    }
    .reg-btn:disabled { background: #fdba74; cursor: not-allowed; }
    .reg-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #888;
    }
    .reg-footer a {
      color: #f97316;
      font-weight: 700;
      text-decoration: none;
    }
    .reg-footer a:hover { text-decoration: underline; }

    @media (max-width: 480px) {
      .reg-card { padding: 24px 16px; }
      .reg-grid-2 { grid-template-columns: 1fr; }
      .reg-role-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    }
  `;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        const loginRes = await fetch('http://127.0.0.1:8000/api/users/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          localStorage.setItem('access_token', loginData.access);
          localStorage.setItem('refresh_token', loginData.refresh);
          localStorage.setItem('user_role', formData.role);
          localStorage.setItem('username', formData.username);
          window.location.href = '/';
        }
      } else {
        setError(JSON.stringify(data));
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrap">
      <style>{css}</style>
      <div className="reg-card">

        {/* Logo */}
        <div className="reg-logo">
          <div className="reg-logo-icon">🛒</div>
          <h1>Mini Marketplace</h1>
          <p>Créez votre compte gratuitement</p>
        </div>

        {/* Indicateur étapes */}
        <div className="reg-step-indicator">
          <div className={`reg-step-dot ${step >= 1 ? 'active' : ''}`} />
          <div className="reg-step-line" />
          <div className={`reg-step-dot ${step >= 2 ? 'active' : ''}`} />
        </div>

        {/* ÉTAPE 1 : Choix rôle */}
        {step === 1 && (
          <div>
            <p style={{ textAlign: 'center', fontWeight: 700, color: '#1a1a1a', marginBottom: 20, fontSize: 15 }}>
              Vous êtes ?
            </p>
            <div className="reg-role-grid">
              <button className="reg-role-card" onClick={() => handleRoleSelect('acheteur')}>
                <div className="reg-role-icon">🛍️</div>
                <div className="reg-role-name">Acheteur</div>
                <div className="reg-role-desc">Je cherche des produits</div>
              </button>
              <button className="reg-role-card" onClick={() => handleRoleSelect('vendeur')}>
                <div className="reg-role-icon">🏪</div>
                <div className="reg-role-name">Vendeur</div>
                <div className="reg-role-desc">Je veux vendre</div>
              </button>
            </div>
            <div className="reg-footer">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Formulaire */}
        {step === 2 && (
          <div>
            <div className="reg-selected-role">
              <span style={{ fontSize: 20 }}>{formData.role === 'vendeur' ? '🏪' : '🛍️'}</span>
              <span>Inscription en tant que <strong>{formData.role}</strong></span>
              <button className="reg-change-btn" onClick={() => setStep(1)}>Changer</button>
            </div>

            {error && <div className="reg-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="reg-field">
                <label className="reg-label">Nom d'utilisateur *</label>
                <input className="reg-input" type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="Choisissez un nom" required />
              </div>

              <div className="reg-field">
                <label className="reg-label">Email *</label>
                <input className="reg-input" type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="votre@email.com" required />
              </div>

              <div className="reg-field">
                <label className="reg-label">Mot de passe *</label>
                <input className="reg-input" type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="Minimum 8 caractères" required />
              </div>

              <div className="reg-grid-2">
                <div className="reg-field">
                  <label className="reg-label">Téléphone</label>
                  <input className="reg-input" type="text" name="telephone" value={formData.telephone}
                    onChange={handleChange} placeholder="7X XXX XX XX" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Ville</label>
                  <input className="reg-input" type="text" name="ville" value={formData.ville}
                    onChange={handleChange} placeholder="Dakar" />
                </div>
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? '⏳ Création du compte...' : '🚀 Créer mon compte'}
              </button>
            </form>

            <div className="reg-footer">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
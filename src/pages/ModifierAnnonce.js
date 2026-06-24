import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function ModifierAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
    localisation: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${API_URL}/api/annonces/${id}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          titre: data.titre,
          description: data.description,
          prix: data.prix,
          categorie: data.categorie,
          localisation: data.localisation,
        });
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/annonces/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('✅ Annonce modifiée avec succès !');
        navigate('/mon-compte');
      } else {
        const err = await response.json();
        alert('Erreur : ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const css = `
    .ma-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .ma-container { max-width: 700px; margin: 0 auto; }
    .ma-card {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      padding: 32px;
    }
    .ma-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #555;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .ma-input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      background: #fafafa;
      color: #1a1a1a;
    }
    .ma-input:focus { border-color: #f97316; background: #fff; }
    .ma-field { margin-bottom: 20px; }
    .ma-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ma-btn {
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
      margin-top: 8px;
    }
    .ma-btn:hover:not(:disabled) { background: #ea580c; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
    .ma-btn:disabled { background: #fdba74; cursor: not-allowed; }
    .ma-btn-back {
      background: none;
      border: none;
      color: #f97316;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 600;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ma-btn-back:hover { text-decoration: underline; }
    .ma-divider { border: none; border-top: 1px solid #f0f0f0; margin: 24px 0; }
    .ma-section-title {
      font-size: 13px;
      font-weight: 700;
      color: #f97316;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg) } }
    .ma-spinner {
      width: 44px; height: 44px;
      border: 4px solid #fed7aa;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 16px;
    }
    @media (max-width: 600px) {
      .ma-card { padding: 20px 16px; }
      .ma-grid { grid-template-columns: 1fr !important; }
      .ma-wrap { padding: 12px 8px; }
    }
  `;

  if (loadingData) return (
    <div style={{ textAlign: 'center', padding: 80, fontFamily: 'inherit' }}>
      <style>{css}</style>
      <div className="ma-spinner" />
      <p style={{ color: '#aaa', fontSize: 14 }}>Chargement de l'annonce...</p>
    </div>
  );

  return (
    <div className="ma-wrap">
      <style>{css}</style>
      <div className="ma-container">

        <button className="ma-btn-back" onClick={() => navigate('/mon-compte')}>
          ← Retour à mon compte
        </button>

        <div className="ma-card">
          {/* En-tête */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              ✏️
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Modifier l'annonce</h1>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Mettez à jour les informations de votre annonce</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="ma-section-title">📋 Informations générales</div>

            <div className="ma-field">
              <label className="ma-label">Titre de l'annonce *</label>
              <input type="text" name="titre" value={formData.titre} onChange={handleChange} placeholder="Ex: iPhone 14 Pro Max 256Go" className="ma-input" required />
            </div>

            <div className="ma-field">
              <label className="ma-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez votre produit..." className="ma-input" style={{ height: 120, resize: 'vertical' }} required />
            </div>

            <hr className="ma-divider" />

            <div className="ma-section-title">💰 Prix & Catégorie</div>

            <div className="ma-grid">
              <div className="ma-field">
                <label className="ma-label">Prix (FCFA) *</label>
                <input type="number" name="prix" value={formData.prix} onChange={handleChange} placeholder="Ex: 150000" className="ma-input" min="0" required />
              </div>
              <div className="ma-field">
                <label className="ma-label">Catégorie</label>
                <select name="categorie" value={formData.categorie} onChange={handleChange} className="ma-input" required>
                  <option value="">Choisir...</option>
                  <option value="1">📱 Électronique</option>
                  <option value="2">👗 Habillement</option>
                  <option value="3">🛠️ Services</option>
                  <option value="4">🏠 Immobilier</option>
                </select>
              </div>
            </div>

            <hr className="ma-divider" />

            <div className="ma-section-title">📍 Localisation</div>

            <div className="ma-field">
              <label className="ma-label">Ville / Quartier *</label>
              <input type="text" name="localisation" value={formData.localisation} onChange={handleChange} placeholder="Ex: Dakar - Plateau" className="ma-input" required />
            </div>

            {/* Récap prix */}
            {formData.prix && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>Prix de votre annonce</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>{Number(formData.prix).toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}

            <button type="submit" className="ma-btn" disabled={loading}>
              {loading ? '⏳ Modification en cours...' : '✏️ Enregistrer les modifications'}
            </button>

            <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 12 }}>
              Les modifications seront visibles immédiatement.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModifierAnnonce;
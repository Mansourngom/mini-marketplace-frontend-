import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NouvelleAnnonce() {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
    localisation: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const css = `
    .na-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .na-container {
      max-width: 700px;
      margin: 0 auto;
    }
    .na-card {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      padding: 32px;
    }
    .na-title {
      font-size: 20px;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 4px;
    }
    .na-subtitle {
      font-size: 13px;
      color: #999;
      margin: 0 0 28px;
    }
    .na-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #333;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .na-input {
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
    .na-input:focus {
      border-color: #f97316;
      background: #fff;
    }
    .na-field {
      margin-bottom: 20px;
    }
    .na-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .na-btn {
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
    .na-btn:hover:not(:disabled) {
      background: #ea580c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249,115,22,0.3);
    }
    .na-btn:disabled {
      background: #fdba74;
      cursor: not-allowed;
    }
    .na-btn-back {
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
    .na-btn-back:hover { text-decoration: underline; }

    .na-upload-zone {
      border: 2px dashed #e0e0e0;
      border-radius: 4px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
    }
    .na-upload-zone:hover {
      border-color: #f97316;
      background: #fff7ed;
    }
    .na-upload-zone input[type=file] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
    .na-preview {
      width: 100%;
      max-height: 220px;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      margin-top: 12px;
    }
    .na-badge {
      display: inline-block;
      background: #fff7ed;
      color: #f97316;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 2px;
      margin-left: 6px;
      vertical-align: middle;
    }
    .na-tip {
      font-size: 12px;
      color: #aaa;
      margin-top: 5px;
    }
    .na-divider {
      border: none;
      border-top: 1px solid #f0f0f0;
      margin: 24px 0;
    }
    .na-section-title {
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

    @media (max-width: 600px) {
      .na-card { padding: 20px 16px; }
      .na-grid { grid-template-columns: 1fr !important; }
      .na-wrap { padding: 12px 8px; }
    }
  `;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour publier une annonce !');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('prix', formData.prix);
      data.append('categorie', formData.categorie);
      data.append('localisation', formData.localisation);
      if (image) data.append('image', image);

      const response = await fetch('http://127.0.0.1:8000/api/annonces/creer/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        alert('✅ Annonce publiée avec succès !');
        navigate('/');
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

  return (
    <div className="na-wrap">
      <style>{css}</style>
      <div className="na-container">

        {/* Bouton retour */}
        <button className="na-btn-back" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="na-card">
          {/* En-tête */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              📢
            </div>
            <div>
              <h1 className="na-title">Publier une annonce</h1>
              <p className="na-subtitle">Remplissez les informations de votre produit ou service</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Section 1 : Informations */}
            <div className="na-section-title">
              📋 Informations générales
            </div>

            <div className="na-field">
              <label className="na-label">
                Titre de l'annonce <span className="na-badge">Requis</span>
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Ex: iPhone 14 Pro Max 256Go"
                className="na-input"
                required
              />
              <p className="na-tip">Soyez précis et descriptif pour attirer plus d'acheteurs.</p>
            </div>

            <div className="na-field">
              <label className="na-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre produit : état, caractéristiques, raison de la vente..."
                className="na-input"
                style={{ height: 120, resize: 'vertical' }}
                required
              />
            </div>

            <hr className="na-divider" />

            {/* Section 2 : Prix & Catégorie */}
            <div className="na-section-title">
              💰 Prix & Catégorie
            </div>

            <div className="na-grid">
              <div className="na-field">
                <label className="na-label">
                  Prix (FCFA) <span className="na-badge">Requis</span>
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="Ex: 150000"
                  className="na-input"
                  min="0"
                  required
                />
              </div>

              <div className="na-field">
                <label className="na-label">Catégorie</label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="na-input"
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="1">📱 Électronique</option>
                  <option value="2">👗 Habillement</option>
                  <option value="3">🛠️ Services</option>
                  <option value="4">🏠 Immobilier</option>
                </select>
              </div>
            </div>

            <hr className="na-divider" />

            {/* Section 3 : Localisation */}
            <div className="na-section-title">
              📍 Localisation
            </div>

            <div className="na-field">
              <label className="na-label">
                Ville / Quartier <span className="na-badge">Requis</span>
              </label>
              <input
                type="text"
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                placeholder="Ex: Dakar - Plateau"
                className="na-input"
                required
              />
            </div>

            <hr className="na-divider" />

            {/* Section 4 : Image */}
            <div className="na-section-title">
              🖼️ Photo du produit
            </div>

            <div className="na-field">
              <label className="na-label">Ajouter une image</label>
              <div className="na-upload-zone">
                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                />
                {!preview ? (
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                    <p style={{ fontSize: 14, color: '#888', margin: '0 0 4px' }}>
                      Cliquez ou glissez une image ici
                    </p>
                    <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
                      JPG, PNG, WEBP — Max 5 Mo
                    </p>
                  </div>
                ) : (
                  <div>
                    <img src={preview} alt="Aperçu" className="na-preview" />
                    <p style={{ fontSize: 12, color: '#f97316', marginTop: 8 }}>
                      ✅ {image?.name}
                    </p>
                  </div>
                )}
              </div>
              <p className="na-tip">Une belle photo augmente vos chances de vente de 70%.</p>
            </div>

            {/* Récapitulatif prix */}
            {formData.prix && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>Prix de votre annonce</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>
                  {Number(formData.prix).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            )}

            {/* Bouton soumettre */}
            <button type="submit" className="na-btn" disabled={loading}>
              {loading ? '⏳ Publication en cours...' : '📢 Publier mon annonce'}
            </button>

            <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 12 }}>
              En publiant, vous acceptez nos conditions d'utilisation.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NouvelleAnnonce;
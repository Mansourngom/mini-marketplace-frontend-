import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';

const CATEGORIES = [
  { label: 'Tout', value: '', icon: '🏪' },
  { label: 'Électronique', value: 'electronique', icon: '📱' },
  { label: 'Habillement', value: 'habillement', icon: '👗' },
  { label: 'Services', value: 'services', icon: '🛠️' },
  { label: 'Immobilier', value: 'immobilier', icon: '🏠' },
];

function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAnnonces(); }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch(`${API_URL}/api/annonces/`);
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecherche = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/annonces/?search=${recherche}&categorie=${categorie}`);
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const clean = image.trim();
    return clean.startsWith('http') ? clean : `${API_URL}${clean}`;
  };

  const css = `
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    * { box-sizing: border-box; }

    .acc-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
    }

    /* ── HERO ── */
    .acc-hero {
      background: linear-gradient(135deg, #f97316 0%, #c2410c 60%, #7c2d12 100%);
      padding: 56px 20px 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .acc-hero::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 300px; height: 300px;
      background: rgba(255,255,255,0.06);
      border-radius: 50%;
    }
    .acc-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; left: -40px;
      width: 240px; height: 240px;
      background: rgba(255,255,255,0.04);
      border-radius: 50%;
    }
    .acc-hero-title {
      font-size: 38px;
      font-weight: 900;
      color: #fff;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
    }
    .acc-hero-sub {
      font-size: 16px;
      color: rgba(255,255,255,0.8);
      margin: 0 0 32px;
      position: relative;
      z-index: 1;
    }

    /* ── BARRE RECHERCHE ── */
    .acc-search-box {
      max-width: 780px;
      margin: 0 auto;
      display: flex;
      gap: 0;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      overflow: hidden;
      position: relative;
      z-index: 1;
    }
    .acc-search-input {
      flex: 1;
      border: none;
      padding: 16px 20px;
      font-size: 15px;
      outline: none;
      font-family: inherit;
      color: #1a1a1a;
      min-width: 0;
    }
    .acc-search-select {
      border: none;
      border-left: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
      padding: 16px 16px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      color: #555;
      background: #fff;
      cursor: pointer;
    }
    .acc-search-btn {
      background: #f97316;
      color: #fff;
      border: none;
      padding: 16px 28px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .acc-search-btn:hover { background: #ea580c; }

    /* ── STATS BAR ── */
    .acc-stats-bar {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
    }
    .acc-stats-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 14px 20px;
      display: flex;
      gap: 32px;
      align-items: center;
      flex-wrap: wrap;
    }
    .acc-stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
    }
    .acc-stat-item strong { color: #f97316; font-size: 15px; }

    /* ── CATEGORIES PILLS ── */
    .acc-cats {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      position: sticky;
      top: 70px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .acc-cats-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 20px;
      display: flex;
      gap: 10px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .acc-cats-inner::-webkit-scrollbar { display: none; }
    .acc-cat-pill {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border-radius: 25px;
      border: 1.5px solid #e0e0e0;
      background: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      white-space: nowrap;
      color: #555;
    }
    .acc-cat-pill:hover {
      border-color: #f97316;
      color: #f97316;
      transform: translateY(-1px);
    }
    .acc-cat-pill.active {
      background: #f97316;
      border-color: #f97316;
      color: #fff;
      box-shadow: 0 4px 12px rgba(249,115,22,0.3);
    }

    /* ── BODY ── */
    .acc-body {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 20px;
    }

    /* ── SECTION HEADER ── */
    .acc-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .acc-section-title {
      font-size: 20px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .acc-section-title::after {
      content: '';
      display: block;
      width: 4px;
      height: 22px;
      background: #f97316;
      border-radius: 2px;
      order: -1;
    }
    .acc-count-badge {
      background: #fff7ed;
      color: #f97316;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid #fed7aa;
    }

    /* ── GRID ── */
    .acc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    /* ── CARD ── */
    .acc-card {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      cursor: pointer;
      transition: all 0.25s;
      overflow: hidden;
      animation: fadeUp 0.4s ease both;
      position: relative;
    }
    .acc-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      border-color: #f97316;
    }
    .acc-card-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      background: #f5f5f5;
    }
    .acc-card-img-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f5f5, #ebebeb);
      font-size: 52px;
    }
    .acc-card-body {
      padding: 14px;
    }
    .acc-card-cat {
      font-size: 11px;
      font-weight: 700;
      color: #f97316;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .acc-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }
    .acc-card-price {
      font-size: 18px;
      font-weight: 800;
      color: #f97316;
      margin: 0 0 10px;
    }
    .acc-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #999;
      padding-top: 10px;
      border-top: 1px solid #f5f5f5;
    }
    .acc-card-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #f97316;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 2px;
      text-transform: uppercase;
    }

    /* ── EMPTY / LOADING ── */
    .acc-empty {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
    }
    .acc-empty-icon { font-size: 60px; margin-bottom: 16px; }
    .acc-empty-title { font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px; }
    .acc-empty-sub { font-size: 14px; color: #999; margin: 0; }

    .acc-spinner {
      width: 44px; height: 44px;
      border: 4px solid #fed7aa;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 16px;
    }

    /* ── BANNIERE PROMO ── */
    .acc-promo {
      background: linear-gradient(135deg, #1a1a1a, #292929);
      border-radius: 4px;
      padding: 28px 32px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .acc-promo-text h3 {
      color: #f97316;
      font-size: 18px;
      font-weight: 800;
      margin: 0 0 6px;
    }
    .acc-promo-text p {
      color: #aaa;
      font-size: 13px;
      margin: 0;
    }
    .acc-promo-btn {
      background: #f97316;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      white-space: nowrap;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .acc-promo-btn:hover {
      background: #ea580c;
      transform: translateY(-1px);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .acc-hero-title { font-size: 26px; }
      .acc-hero { padding: 36px 16px 32px; }
      .acc-search-box { border-radius: 6px; flex-wrap: wrap; }
      .acc-search-select { display: none; }
      .acc-search-input { padding: 14px 16px; }
      .acc-search-btn { width: 100%; padding: 14px; border-radius: 0; }
      .acc-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
      .acc-body { padding: 0 12px; margin: 16px auto; }
      .acc-stats-inner { gap: 16px; padding: 10px 12px; }
      .acc-promo { padding: 20px 16px; }
      .acc-promo-text h3 { font-size: 15px; }
      .acc-section-title { font-size: 17px; }
    }

    @media (max-width: 400px) {
      .acc-grid { grid-template-columns: 1fr !important; }
      .acc-hero-title { font-size: 22px; }
      .acc-card-img { height: 160px; }
      .acc-card-img-placeholder { height: 160px; }
    }
  `;

  return (
    <div className="acc-wrap">
      <style>{css}</style>

      {/* ── HERO ── */}
      <div className="acc-hero">
        <h1 className="acc-hero-title">🛒 Trouvez ce que vous cherchez</h1>
        <p className="acc-hero-sub">Des milliers d'annonces près de chez vous au Sénégal</p>

        <div className="acc-search-box">
          <input
            type="text"
            className="acc-search-input"
            placeholder="🔍 Rechercher un produit, une marque..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRecherche()}
          />
          <select
            className="acc-search-select"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            <option value="electronique">📱 Électronique</option>
            <option value="habillement">👗 Habillement</option>
            <option value="services">🛠️ Services</option>
            <option value="immobilier">🏠 Immobilier</option>
          </select>
          <button className="acc-search-btn" onClick={handleRecherche}>
            Rechercher
          </button>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="acc-stats-bar">
        <div className="acc-stats-inner">
          <div className="acc-stat-item">🏪 <strong>{annonces.length}</strong> annonces disponibles</div>
          <div className="acc-stat-item">📍 <strong>Dakar</strong> & partout au Sénégal</div>
          <div className="acc-stat-item">✅ <strong>100%</strong> gratuit</div>
          <div className="acc-stat-item">🔒 <strong>Vendeurs</strong> vérifiés</div>
        </div>
      </div>

      {/* ── CATEGORIES PILLS ── */}
      <div className="acc-cats">
        <div className="acc-cats-inner">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`acc-cat-pill ${categorie === cat.value ? 'active' : ''}`}
              onClick={() => {
                setCategorie(cat.value);
                setLoading(true);
                fetch(`${API_URL}/api/annonces/?categorie=${cat.value}&search=${recherche}`)
                  .then(r => r.json())
                  .then(d => { setAnnonces(d); setLoading(false); })
                  .catch(() => setLoading(false));
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="acc-body">

        {/* Bannière promo */}
        <div className="acc-promo">
          <div className="acc-promo-text">
            <h3>🚀 Vendez vos produits gratuitement !</h3>
            <p>Publiez votre annonce en moins de 2 minutes et touchez des milliers d'acheteurs.</p>
          </div>
          <button className="acc-promo-btn" onClick={() => window.location.href = '/nouvelle-annonce'}>
            Publier maintenant →
          </button>
        </div>

        {/* Header section */}
        <div className="acc-section-header">
          <h2 className="acc-section-title">Dernières annonces</h2>
          <span className="acc-count-badge">{annonces.length} résultat{annonces.length > 1 ? 's' : ''}</span>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="acc-empty">
            <div className="acc-spinner" />
            <p style={{ color: '#aaa', fontSize: 14 }}>Chargement des annonces...</p>
          </div>
        ) : annonces.length === 0 ? (
          <div className="acc-empty">
            <div className="acc-empty-icon">📭</div>
            <p className="acc-empty-title">Aucune annonce trouvée</p>
            <p className="acc-empty-sub">Essayez d'autres mots-clés ou catégories.</p>
          </div>
        ) : (
          <div className="acc-grid">
            {annonces.map((annonce, idx) => (
              <div
                key={annonce.id}
                className="acc-card"
                onClick={() => navigate(`/annonce/${annonce.id}`)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Badge Nouveau */}
                {idx < 3 && <div className="acc-card-badge">Nouveau</div>}

                {/* Image */}
                {annonce.image ? (
                  <img
                    src={getImageUrl(annonce.image)}
                    alt={annonce.titre}
                    className="acc-card-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="acc-card-img-placeholder" style={{ display: annonce.image ? 'none' : 'flex' }}>
                  🖼️
                </div>

                {/* Infos */}
                <div className="acc-card-body">
                  <div className="acc-card-cat">{annonce.categorie_nom || 'Autre'}</div>
                  <h3 className="acc-card-title">{annonce.titre}</h3>
                  <p className="acc-card-price">{Number(annonce.prix).toLocaleString('fr-FR')} FCFA</p>
                  <div className="acc-card-footer">
                    <span>📍 {annonce.localisation}</span>
                    <span>👤 {annonce.vendeur_nom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accueil;
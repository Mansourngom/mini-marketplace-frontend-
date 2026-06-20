import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MonCompte() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('annonces');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('user_role');

  useEffect(() => { fetchMesAnnonces(); }, []);

  const fetchMesAnnonces = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/annonces/mes-annonces/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerAnnonce = async (id) => {
    const token = localStorage.getItem('access_token');
    if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      try {
        await fetch(`http://127.0.0.1:8000/api/annonces/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAnnonces(annonces.filter(a => a.id !== id));
      } catch (error) { console.error('Erreur:', error); }
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const clean = image.trim();
    return clean.startsWith('http') ? clean : `http://127.0.0.1:8000${clean}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const css = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg) } }

    .mc-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .mc-container { max-width: 1100px; margin: 0 auto; }

    /* ── PROFILE BANNER ── */
    .mc-banner {
      background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
      border-radius: 4px;
      padding: 32px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      position: relative;
      overflow: hidden;
    }
    .mc-banner::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 180px; height: 180px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
    }
    .mc-banner::after {
      content: '';
      position: absolute;
      bottom: -60px; left: 30%;
      width: 140px; height: 140px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }
    .mc-avatar {
      width: 72px; height: 72px;
      background: rgba(255,255,255,0.2);
      border: 3px solid rgba(255,255,255,0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #fff;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .mc-user-info { flex: 1; position: relative; z-index: 1; }
    .mc-username {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px;
    }
    .mc-role-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.2);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .mc-banner-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }
    .mc-btn-white {
      background: #fff;
      color: #f97316;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .mc-btn-white:hover {
      background: #fff7ed;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .mc-btn-dark {
      background: rgba(0,0,0,0.3);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .mc-btn-dark:hover { background: rgba(0,0,0,0.5); }

    /* ── STATS ── */
    .mc-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .mc-stat-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      transition: all 0.2s;
    }
    .mc-stat-card:hover {
      border-color: #f97316;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249,115,22,0.1);
    }
    .mc-stat-num {
      font-size: 28px;
      font-weight: 800;
      color: #f97316;
      display: block;
    }
    .mc-stat-label {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* ── TABS ── */
    .mc-tabs {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      margin-bottom: 16px;
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .mc-tabs::-webkit-scrollbar { display: none; }
    .mc-tab {
      flex: 1;
      min-width: 120px;
      padding: 16px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      color: #888;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .mc-tab.active {
      color: #f97316;
      border-bottom-color: #f97316;
    }
    .mc-tab:hover:not(.active) { color: #555; background: #fafafa; }

    /* ── SECTION HEADER ── */
    .mc-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .mc-section-title {
      font-size: 16px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* ── GRID ANNONCES ── */
    .mc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    /* ── CARD ── */
    .mc-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      overflow: hidden;
      transition: all 0.25s;
      animation: fadeUp 0.4s ease both;
    }
    .mc-card:hover {
      border-color: #f97316;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      transform: translateY(-3px);
    }
    .mc-card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
      cursor: pointer;
    }
    .mc-card-placeholder {
      height: 180px;
      background: linear-gradient(135deg, #f5f5f5, #ebebeb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      cursor: pointer;
    }
    .mc-card-body { padding: 14px; }
    .mc-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 6px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .mc-card-price {
      font-size: 18px;
      font-weight: 800;
      color: #f97316;
      margin: 0 0 6px;
    }
    .mc-card-loc {
      font-size: 12px;
      color: #999;
      margin: 0 0 12px;
    }
    .mc-card-actions { display: flex; gap: 8px; }
    .mc-btn-edit {
      flex: 1;
      padding: 9px 0;
      background: #1a1a1a;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .mc-btn-edit:hover { background: #333; }
    .mc-btn-delete {
      flex: 1;
      padding: 9px 0;
      background: #fff;
      color: #ef4444;
      border: 1.5px solid #ef4444;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .mc-btn-delete:hover { background: #fef2f2; }

    /* ── EMPTY ── */
    .mc-empty {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
    }

    /* ── SPINNER ── */
    .mc-spinner {
      width: 44px; height: 44px;
      border: 4px solid #fed7aa;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 16px;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .mc-stats { grid-template-columns: repeat(2, 1fr); }
      .mc-banner { padding: 20px 16px; }
      .mc-username { font-size: 18px; }
      .mc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .mc-wrap { padding: 12px 8px; }
    }
    @media (max-width: 480px) {
      .mc-stats { grid-template-columns: repeat(2, 1fr); }
      .mc-grid { grid-template-columns: 1fr; }
      .mc-banner-actions { width: 100%; }
      .mc-btn-white, .mc-btn-dark { flex: 1; text-align: center; }
    }
  `;

  return (
    <div className="mc-wrap">
      <style>{css}</style>
      <div className="mc-container">

        {/* BANNER PROFIL */}
        <div className="mc-banner">
          <div className="mc-avatar">{username?.[0]?.toUpperCase() || '?'}</div>
          <div className="mc-user-info">
            <h2 className="mc-username">{username}</h2>
            <span className="mc-role-badge">
              {role === 'vendeur' ? '🏪 Vendeur' : '🛍️ Acheteur'}
            </span>
          </div>
          <div className="mc-banner-actions">
            {role === 'vendeur' && (
              <button className="mc-btn-white" onClick={() => navigate('/nouvelle-annonce')}>
                📢 Nouvelle annonce
              </button>
            )}
            <button className="mc-btn-dark" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mc-stats">
          <div className="mc-stat-card">
            <span className="mc-stat-num">{annonces.length}</span>
            <div className="mc-stat-label">📢 Annonces</div>
          </div>
          <div className="mc-stat-card">
            <span className="mc-stat-num">0</span>
            <div className="mc-stat-label">💬 Messages</div>
          </div>
          <div className="mc-stat-card">
            <span className="mc-stat-num">0</span>
            <div className="mc-stat-label">❤️ Favoris</div>
          </div>
          <div className="mc-stat-card">
            <span className="mc-stat-num">4.5</span>
            <div className="mc-stat-label">⭐ Note</div>
          </div>
        </div>

        {/* TABS */}
        <div className="mc-tabs">
          <button className={`mc-tab ${onglet === 'annonces' ? 'active' : ''}`} onClick={() => setOnglet('annonces')}>
            📢 Mes annonces ({annonces.length})
          </button>
          <button className={`mc-tab ${onglet === 'messages' ? 'active' : ''}`} onClick={() => setOnglet('messages')}>
            💬 Messages
          </button>
          <button className={`mc-tab ${onglet === 'profil' ? 'active' : ''}`} onClick={() => setOnglet('profil')}>
            👤 Mon profil
          </button>
        </div>

        {/* CONTENU ONGLET ANNONCES */}
        {onglet === 'annonces' && (
          <div>
            <div className="mc-section-header">
              <h3 className="mc-section-title">📢 Mes annonces publiées</h3>
              {role === 'vendeur' && (
                <button className="mc-btn-white" onClick={() => navigate('/nouvelle-annonce')}
                  style={{ background: '#f97316', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  + Publier
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8' }}>
                <div className="mc-spinner" />
                <p style={{ color: '#aaa', fontSize: 14 }}>Chargement...</p>
              </div>
            ) : annonces.length === 0 ? (
              <div className="mc-empty">
                <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                  Aucune annonce publiée
                </h3>
                <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 24px' }}>
                  Commencez à vendre vos produits dès maintenant !
                </p>
                {role === 'vendeur' && (
                  <button onClick={() => navigate('/nouvelle-annonce')}
                    style={{ background: '#f97316', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    📢 Publier ma première annonce
                  </button>
                )}
              </div>
            ) : (
              <div className="mc-grid">
                {annonces.map((annonce, idx) => (
                  <div key={annonce.id} className="mc-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                    {annonce.image ? (
                      <img src={getImageUrl(annonce.image)} alt={annonce.titre} className="mc-card-img"
                        onClick={() => navigate(`/annonce/${annonce.id}`)}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="mc-card-placeholder" onClick={() => navigate(`/annonce/${annonce.id}`)}>🖼️</div>
                    )}
                    <div className="mc-card-body">
                      <h3 className="mc-card-title">{annonce.titre}</h3>
                      <p className="mc-card-price">{Number(annonce.prix).toLocaleString('fr-FR')} FCFA</p>
                      <p className="mc-card-loc">📍 {annonce.localisation}</p>
                      <div className="mc-card-actions">
                        <button className="mc-btn-edit" onClick={() => navigate(`/modifier-annonce/${annonce.id}`)}>
                          ✏️ Modifier
                        </button>
                        <button className="mc-btn-delete" onClick={() => supprimerAnnonce(annonce.id)}>
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET MESSAGES */}
        {onglet === 'messages' && (
          <div className="mc-empty">
            <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Vos messages</h3>
            <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 24px' }}>Consultez vos messages dans la section dédiée.</p>
            <button onClick={() => navigate('/messages')}
              style={{ background: '#f97316', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Voir mes messages
            </button>
          </div>
        )}

        {/* ONGLET PROFIL */}
        {onglet === 'profil' && (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, padding: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
              👤 Informations du compte
            </h3>
            {[
              ['Nom d\'utilisateur', username],
              ['Rôle', role === 'vendeur' ? '🏪 Vendeur' : '🛍️ Acheteur'],
              ['Statut', '✅ Actif'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                <span style={{ color: '#888' }}>{label}</span>
                <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonCompte;
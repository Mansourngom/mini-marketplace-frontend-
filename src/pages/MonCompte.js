import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Compteur animé
function CountUp({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

function MonCompte() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('annonces');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('user_role');

  useEffect(() => {
    fetchMesAnnonces();
    setTimeout(() => setBannerLoaded(true), 100);
  }, []);

  const fetchMesAnnonces = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch(`${API_URL}/api/annonces/mes-annonces/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnnonces(data);
    } catch (error) { console.error('Erreur:', error); }
    finally { setLoading(false); }
  };

  const supprimerAnnonce = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${API_URL}/api/annonces/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAnnonces(prev => prev.filter(a => a.id !== id));
      setConfirmDelete(null);
      showToast('✅ Annonce supprimée avec succès !');
    } catch (error) { console.error('Erreur:', error); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const clean = image.trim();
    return clean.startsWith('http') ? clean : `${API_URL}${clean}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const css = `
    @keyframes spin { to { transform: rotate(360deg) } }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeLeft {
      from { opacity: 0; transform: translateX(-24px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes bannerReveal {
      from { opacity: 0; transform: translateY(-20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes avatarPop {
      0% { transform: scale(0) rotate(-180deg); }
      70% { transform: scale(1.15) rotate(5deg); }
      100% { transform: scale(1) rotate(0); }
    }

    @keyframes statSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes toastSlide {
      0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
      15%, 85% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }

    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes cardHover {
      from { transform: translateY(0) scale(1); }
      to { transform: translateY(-8px) scale(1.02); }
    }

    @keyframes deleteShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px) rotate(-1deg); }
      75% { transform: translateX(4px) rotate(1deg); }
    }

    @keyframes tabIndicator {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(249,115,22,0); }
    }

    @keyframes ripple {
      0% { transform: scale(0); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes progressFill {
      from { width: 0; }
      to { width: var(--w); }
    }

    * { box-sizing: border-box; }

    .mc-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: linear-gradient(135deg, #f8f8f8, #f2f2f2);
      min-height: 100vh;
      padding: 24px 16px;
    }
    .mc-container { max-width: 1100px; margin: 0 auto; }

    /* TOAST */
    .mc-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: #fff;
      padding: 12px 28px;
      border-radius: 99px;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      animation: toastSlide 3s ease forwards;
      white-space: nowrap;
    }

    /* CONFIRM MODAL */
    .mc-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      animation: fadeUp 0.2s ease;
    }
    .mc-modal {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      max-width: 380px;
      width: 90%;
      text-align: center;
      animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    }

    /* BANNER */
    .mc-banner {
      background: linear-gradient(-45deg, #f97316, #ea580c, #c2410c, #f97316);
      background-size: 300% 300%;
      animation: gradientMove 6s ease infinite, bannerReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      border-radius: 16px;
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
      top: -60px; right: -60px;
      width: 220px; height: 220px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    .mc-banner::after {
      content: '';
      position: absolute;
      bottom: -80px; left: 25%;
      width: 180px; height: 180px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite reverse;
    }

    /* BANNER SHIMMER */
    .mc-banner-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      background-size: 200% 100%;
      animation: shimmer 3s ease-in-out infinite;
      pointer-events: none;
    }

    /* AVATAR */
    .mc-avatar {
      width: 80px; height: 80px;
      background: rgba(255,255,255,0.25);
      border: 3px solid rgba(255,255,255,0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      animation: avatarPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
      cursor: pointer;
      transition: all 0.3s;
    }
    .mc-avatar:hover {
      transform: scale(1.1) rotate(10deg);
      border-color: #fff;
      box-shadow: 0 0 0 4px rgba(255,255,255,0.2);
    }

    /* ONLINE INDICATOR */
    .mc-avatar-online {
      position: absolute;
      bottom: 4px; right: 4px;
      width: 14px; height: 14px;
      background: #22c55e;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: glowPulse 2s ease-in-out infinite;
    }

    .mc-user-info { flex: 1; position: relative; z-index: 1; }
    .mc-username {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      margin: 0 0 8px;
      animation: fadeLeft 0.5s ease 0.3s both;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .mc-role-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.3);
      animation: fadeLeft 0.5s ease 0.4s both;
    }

    .mc-banner-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      animation: fadeUp 0.5s ease 0.5s both;
    }
    .mc-btn-white {
      background: rgba(255,255,255,0.95);
      color: #f97316;
      border: none;
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }
    .mc-btn-white::before {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      width: 0; height: 0;
      background: rgba(249,115,22,0.1);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s, height 0.4s;
    }
    .mc-btn-white:hover::before { width: 200px; height: 200px; }
    .mc-btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }

    .mc-btn-dark {
      background: rgba(0,0,0,0.25);
      color: #fff;
      border: 1.5px solid rgba(255,255,255,0.3);
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
    }
    .mc-btn-dark:hover { background: rgba(0,0,0,0.5); transform: translateY(-2px); }

    /* STATS */
    .mc-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .mc-stat-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      padding: 22px 16px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: statSlideUp 0.5s ease both;
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    .mc-stat-card::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    .mc-stat-card:hover::before { transform: scaleX(1); }
    .mc-stat-card:hover {
      border-color: #f97316;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(249,115,22,0.12);
    }
    .mc-stat-card:nth-child(1) { animation-delay: 0.1s; }
    .mc-stat-card:nth-child(2) { animation-delay: 0.2s; }
    .mc-stat-card:nth-child(3) { animation-delay: 0.3s; }
    .mc-stat-card:nth-child(4) { animation-delay: 0.4s; }

    .mc-stat-icon { font-size: 28px; margin-bottom: 8px; animation: float 3s ease-in-out infinite; }
    .mc-stat-num {
      font-size: 30px;
      font-weight: 900;
      color: #f97316;
      display: block;
      background: linear-gradient(135deg, #f97316, #ea580c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .mc-stat-label {
      font-size: 11px;
      color: #aaa;
      margin-top: 4px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* TABS */
    .mc-tabs {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
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
      transition: all 0.3s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }
    .mc-tab::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      height: 3px;
      width: 0;
      background: linear-gradient(135deg, #f97316, #ea580c);
      transition: width 0.3s;
    }
    .mc-tab.active { color: #f97316; }
    .mc-tab.active::before { width: 100%; }
    .mc-tab:hover:not(.active) { color: #f97316; background: #fff7ed; }

    /* SECTION HEADER */
    .mc-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      animation: fadeLeft 0.4s ease;
    }
    .mc-section-title {
      font-size: 18px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* GRID */
    .mc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    /* CARD */
    .mc-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeUp 0.5s ease both;
      position: relative;
    }
    .mc-card:hover {
      border-color: #f97316;
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      transform: translateY(-8px);
    }

    .mc-card-img-wrap { overflow: hidden; height: 180px; position: relative; }
    .mc-card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
      cursor: pointer;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mc-card:hover .mc-card-img { transform: scale(1.1); }

    .mc-card-placeholder {
      height: 180px;
      background: linear-gradient(135deg, #f5f5f5, #ebebeb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 52px;
      cursor: pointer;
      transition: transform 0.4s;
    }
    .mc-card:hover .mc-card-placeholder { transform: scale(1.08) rotate(3deg); }

    /* STATUS BADGE */
    .mc-card-status {
      position: absolute;
      top: 10px; left: 10px;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      z-index: 5;
      animation: scaleIn 0.3s ease;
    }

    .mc-card-body { padding: 16px; }
    .mc-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 6px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.4;
    }
    .mc-card-price {
      font-size: 20px;
      font-weight: 900;
      color: #f97316;
      margin: 0 0 4px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .mc-card-loc { font-size: 12px; color: #aaa; margin: 0 0 14px; }

    .mc-card-actions { display: flex; gap: 8px; }
    .mc-btn-edit {
      flex: 1;
      padding: 10px 0;
      background: linear-gradient(135deg, #1a1a1a, #333);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.25s;
    }
    .mc-btn-edit:hover { background: linear-gradient(135deg, #333, #555); transform: translateY(-1px); }

    .mc-btn-delete {
      flex: 1;
      padding: 10px 0;
      background: #fff;
      color: #ef4444;
      border: 1.5px solid #fca5a5;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.25s;
    }
    .mc-btn-delete:hover { background: #fef2f2; border-color: #ef4444; transform: translateY(-1px); animation: deleteShake 0.3s ease; }

    /* EMPTY */
    .mc-empty {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      animation: scaleIn 0.4s ease;
    }

    /* SPINNER */
    .mc-spinner-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e8e8e8;
    }
    .mc-spinner {
      width: 48px; height: 48px;
      border: 4px solid #fed7aa;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    .mc-spinner-inner {
      position: absolute;
      width: 32px; height: 32px;
      border: 3px solid #fef3c7;
      border-top-color: #ea580c;
      border-radius: 50%;
      animation: spin 1s linear infinite reverse;
    }

    /* PROFIL */
    .mc-profil-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
      transition: all 0.2s;
      animation: fadeLeft 0.4s ease both;
    }
    .mc-profil-item:hover { padding-left: 8px; }
    .mc-profil-item:last-child { border-bottom: none; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .mc-stats { grid-template-columns: repeat(2, 1fr); }
      .mc-banner { padding: 20px 16px; border-radius: 12px; }
      .mc-username { font-size: 20px; }
      .mc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .mc-wrap { padding: 12px 8px; }
    }
    @media (max-width: 480px) {
      .mc-grid { grid-template-columns: 1fr; }
      .mc-banner-actions { width: 100%; }
      .mc-btn-white, .mc-btn-dark { flex: 1; text-align: center; }
      .mc-avatar { width: 64px; height: 64px; font-size: 26px; }
    }
  `;

  return (
    <div className="mc-wrap">
      <style>{css}</style>

      {/* TOAST */}
      {toast && <div className="mc-toast">{toast}</div>}

      {/* MODAL CONFIRMATION SUPPRESSION */}
      {confirmDelete && (
        <div className="mc-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px' }}>
              Supprimer l'annonce ?
            </h3>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
              Cette action est irréversible. L'annonce sera définitivement supprimée.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: '12px 0', background: '#f5f5f5', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Annuler
              </button>
              <button
                onClick={() => supprimerAnnonce(confirmDelete)}
                style={{ flex: 1, padding: '12px 0', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mc-container">

        {/* BANNER PROFIL */}
        <div className="mc-banner">
          <div className="mc-banner-shimmer" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="mc-avatar">
              {username?.[0]?.toUpperCase() || '?'}
              <div className="mc-avatar-online" />
            </div>
          </div>
          <div className="mc-user-info">
            <h2 className="mc-username">👋 {username}</h2>
            <span className="mc-role-badge">
              {role === 'vendeur' ? '🏪 Vendeur certifié' : '🛍️ Acheteur vérifié'}
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
          {[
            { icon: '📢', num: annonces.length, label: 'Annonces', delay: '0.1s' },
            { icon: '💬', num: 0, label: 'Messages', delay: '0.2s' },
            { icon: '❤️', num: 0, label: 'Favoris', delay: '0.3s' },
            { icon: '⭐', num: 4.5, label: 'Note', delay: '0.4s', float: true },
          ].map(({ icon, num, label, delay, float: isFloat }) => (
            <div key={label} className="mc-stat-card" style={{ animationDelay: delay }}>
              <div className="mc-stat-icon">{icon}</div>
              <span className="mc-stat-num">
                {isFloat ? num : <CountUp target={num} />}
              </span>
              <div className="mc-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="mc-tabs">
          {[
            { id: 'annonces', label: `📢 Mes annonces (${annonces.length})` },
            { id: 'messages', label: '💬 Messages' },
            { id: 'profil', label: '👤 Mon profil' },
          ].map(({ id, label }) => (
            <button key={id} className={`mc-tab ${onglet === id ? 'active' : ''}`} onClick={() => setOnglet(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* ONGLET ANNONCES */}
        {onglet === 'annonces' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div className="mc-section-header">
              <h3 className="mc-section-title">📢 Mes annonces publiées</h3>
              {role === 'vendeur' && (
                <button
                  onClick={() => navigate('/nouvelle-annonce')}
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(249,115,22,0.4)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                >
                  ✨ Publier une annonce
                </button>
              )}
            </div>

            {loading ? (
              <div className="mc-spinner-wrap">
                <div style={{ position: 'relative', width: 48, height: 48 }}>
                  <div className="mc-spinner" />
                  <div className="mc-spinner-inner" />
                </div>
              </div>
            ) : annonces.length === 0 ? (
              <div className="mc-empty">
                <div style={{ fontSize: 64, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📭</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px' }}>Aucune annonce publiée</h3>
                <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 28px', lineHeight: 1.7 }}>Commencez à vendre vos produits dès maintenant !</p>
                {role === 'vendeur' && (
                  <button
                    onClick={() => navigate('/nouvelle-annonce')}
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}
                  >
                    📢 Publier ma première annonce
                  </button>
                )}
              </div>
            ) : (
              <div className="mc-grid">
                {annonces.map((annonce, idx) => (
                  <div
                    key={annonce.id}
                    className="mc-card"
                    style={{ animationDelay: `${idx * 0.06}s` }}
                    onMouseEnter={() => setHoveredCard(annonce.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="mc-card-status">✅ Active</div>
                    <div className="mc-card-img-wrap">
                      {annonce.image ? (
                        <img
                          src={getImageUrl(annonce.image)}
                          alt={annonce.titre}
                          className="mc-card-img"
                          onClick={() => navigate(`/annonce/${annonce.id}`)}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="mc-card-placeholder" onClick={() => navigate(`/annonce/${annonce.id}`)}>🖼️</div>
                      )}
                    </div>
                    <div className="mc-card-body">
                      <h3 className="mc-card-title">{annonce.titre}</h3>
                      <p className="mc-card-price">{Number(annonce.prix).toLocaleString('fr-FR')} FCFA</p>
                      <p className="mc-card-loc">📍 {annonce.localisation}</p>
                      <div className="mc-card-actions">
                        <button className="mc-btn-edit" onClick={() => navigate(`/modifier-annonce/${annonce.id}`)}>
                          ✏️ Modifier
                        </button>
                        <button className="mc-btn-delete" onClick={() => setConfirmDelete(annonce.id)}>
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
          <div className="mc-empty" style={{ animation: 'scaleIn 0.4s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>💬</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px' }}>Vos messages</h3>
            <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 28px', lineHeight: 1.7 }}>
              Consultez vos conversations avec les acheteurs.
            </p>
            <button
              onClick={() => navigate('/messages')}
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(249,115,22,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; }}
            >
              💬 Voir mes messages
            </button>
          </div>
        )}

        {/* ONGLET PROFIL */}
        {onglet === 'profil' && (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 32, animation: 'fadeUp 0.4s ease' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 24, paddingBottom: 16, borderBottom: '3px solid #f97316', display: 'flex', alignItems: 'center', gap: 8 }}>
              👤 Informations du compte
            </h3>

            {/* Avatar grand */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(249,115,22,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                {username?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{username}</div>
              <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>✓ Compte vérifié</div>
            </div>

            {[
              ['👤 Nom d\'utilisateur', username, '0.1s'],
              ['🎭 Rôle', role === 'vendeur' ? '🏪 Vendeur' : '🛍️ Acheteur', '0.2s'],
              ['✅ Statut', 'Actif', '0.3s'],
              ['📢 Annonces publiées', `${annonces.length} annonce${annonces.length > 1 ? 's' : ''}`, '0.4s'],
            ].map(([label, value, delay], i) => (
              <div key={label} className="mc-profil-item" style={{ animationDelay: delay }}>
                <span style={{ color: '#888', fontSize: 13 }}>{label}</span>
                <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: 24, padding: '16px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>💡</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Astuce</div>
                <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>
                  Complétez votre profil pour augmenter la confiance des acheteurs.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonCompte;
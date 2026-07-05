import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function DetailAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [favori, setFavori] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [section, setSection] = useState('details');
  const [imgZoom, setImgZoom] = useState(false);
  const [imgPos, setImgPos] = useState({ x: 50, y: 50 });
  const [priceVisible, setPriceVisible] = useState(false);
  const [priceCount, setPriceCount] = useState(0);
  const [shareToast, setShareToast] = useState('');
  const [btnPulse, setBtnPulse] = useState(false);
  const [similarAnnonces, setSimilarAnnonces] = useState([]);
  const priceRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/annonces/${id}/`)
      .then(res => res.json())
      .then(data => {
        setAnnonce(data);
        setLoading(false);
        // Charger annonces similaires
        if (data.categorie) {
          fetch(`${API_URL}/api/annonces/?categorie=${data.categorie_nom}`)
            .then(r => r.json())
            .then(d => setSimilarAnnonces(d.filter(a => a.id !== data.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Compteur animé du prix
  useEffect(() => {
    if (!annonce || !priceVisible) return;
    const target = Number(annonce.prix);
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setPriceCount(target); clearInterval(timer); }
      else setPriceCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [annonce, priceVisible]);

  // Observer pour animer le prix
  useEffect(() => {
    if (!priceRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setPriceVisible(true); }, { threshold: 0.5 });
    obs.observe(priceRef.current);
    return () => obs.disconnect();
  }, [annonce]);

  const handleContact = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch(`${API_URL}/api/messages/envoyer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ annonce: id, destinataire: annonce.vendeur, contenu: message })
      });
      if (response.ok) { setSent(true); setMessage(''); setShowForm(false); }
    } catch (err) { console.error(err); }
  };

  const handleShare = (platform) => {
    setShareToast(`Partagé sur ${platform} !`);
    setTimeout(() => setShareToast(''), 2000);
  };

  const handleImageMove = (e) => {
    if (!imgZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImgPos({ x, y });
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const t = img.trim();
    return t.startsWith('http') ? t : `${API_URL}${t}`;
  };

  const images = annonce
    ? [annonce.image, ...(annonce.images || [])].filter(Boolean).map(getImageUrl)
    : [];

  const fmt = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const css = `
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes priceCount { from { opacity: 0; transform: scale(0.8) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.3)} 70%{transform:scale(1)} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes toastSlide { 0%{opacity:0;transform:translateY(20px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-10px)} }
    @keyframes tabUnderline { from{width:0} to{width:100%} }
    @keyframes deliverySlide { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
    @keyframes starPop { 0%{transform:scale(0) rotate(-30deg)} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
    @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.3)} 50%{box-shadow:0 0 0 8px rgba(249,115,22,0)} }
    @keyframes imgSlide { from{opacity:0;transform:scale(1.05)} to{opacity:1;transform:scale(1)} }
    @keyframes similarCard { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes progressBar { from{width:0} to{width:var(--w)} }

    * { box-sizing: border-box; }

    .detail-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 340px 1fr 270px;
      gap: 12px;
      align-items: start;
    }

    .col3 { display: flex; flex-direction: column; gap: 10px; }

    .card {
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
      transition: box-shadow 0.3s;
    }
    .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

    /* BREADCRUMB */
    .detail-breadcrumb {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      animation: fadeUp 0.4s ease;
    }
    .detail-breadcrumb a {
      color: #555;
      text-decoration: none;
      transition: color 0.2s;
    }
    .detail-breadcrumb a:hover { color: #f97316; }

    /* IMAGE PRINCIPALE */
    .detail-img-wrap {
      position: relative;
      background: #fafafa;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 10px;
      cursor: zoom-in;
    }
    .detail-img-wrap.zoomed { cursor: zoom-out; }
    .detail-main-img {
      width: 100%;
      height: 320px;
      object-fit: contain;
      display: block;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: imgSlide 0.4s ease;
    }
    .detail-img-wrap:hover .detail-main-img:not(.zoomed-img) { transform: scale(1.03); }
    .detail-main-img.zoomed-img {
      transform-origin: var(--ox, 50%) var(--oy, 50%);
      transform: scale(2.5);
      transition: transform-origin 0s;
    }

    /* THUMBNAILS */
    .detail-thumb {
      width: 56px; height: 56px;
      object-fit: contain;
      border-radius: 4px;
      cursor: pointer;
      background: #fafafa;
      padding: 2px;
      transition: all 0.25s;
    }
    .detail-thumb:hover { transform: scale(1.1) translateY(-2px); box-shadow: 0 4px 12px rgba(249,115,22,0.2); }
    .detail-thumb.active { border: 2px solid #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }

    /* ARROWS */
    .detail-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.95);
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 34px; height: 34px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
      z-index: 5;
    }
    .detail-arrow:hover {
      background: #f97316;
      color: #fff;
      border-color: #f97316;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(249,115,22,0.3);
    }

    /* FAV BTN */
    .detail-fav-btn {
      position: absolute;
      top: 10px; right: 10px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 50%;
      width: 40px; height: 40px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      transition: all 0.3s;
      z-index: 5;
    }
    .detail-fav-btn:hover { transform: scale(1.2); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    .detail-fav-btn.active { animation: heartbeat 0.8s ease; border-color: #ef4444; }

    /* SHARE BUTTONS */
    .detail-share-btn {
      background: #f5f5f5;
      border: 1px solid #e8e8e8;
      border-radius: 50%;
      width: 36px; height: 36px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
    }
    .detail-share-btn:hover { background: #f97316; border-color: #f97316; transform: scale(1.15) rotate(10deg); }

    /* TOAST */
    .detail-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: #fff;
      padding: 12px 24px;
      border-radius: 99px;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      animation: toastSlide 2s ease forwards;
    }

    /* CATEGORIE BADGE */
    .detail-cat-badge {
      display: inline-block;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    /* PRIX */
    .detail-price-box {
      background: linear-gradient(135deg, #f9f9f9, #fff);
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .detail-price-box::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(249,115,22,0.05), transparent);
      animation: shimmer 3s ease infinite;
    }
    .detail-price-box:hover { border-color: #f97316; box-shadow: 0 4px 16px rgba(249,115,22,0.1); }
    .detail-price {
      font-size: 32px;
      font-weight: 900;
      color: #1a1a1a;
      animation: priceCount 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    /* BOUTON CONTACT */
    .detail-contact-btn {
      width: 100%;
      padding: 14px 0;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      animation: glowPulse 2s ease-in-out infinite;
    }
    .detail-contact-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.4s;
    }
    .detail-contact-btn:hover::before { left: 100%; }
    .detail-contact-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.4); }
    .detail-contact-btn:active { transform: translateY(0) scale(0.98); }

    /* TABS */
    .tab-btn {
      flex: 1;
      padding: 14px 8px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
      position: relative;
    }
    .tab-btn.active {
      font-weight: 700;
      color: #f97316;
      border-bottom-color: #f97316;
    }
    .tab-btn:not(.active) { color: #666; }
    .tab-btn:hover:not(.active) { color: #f97316; background: #fff7ed; }

    /* TAB CONTENT */
    .tab-content {
      animation: fadeUp 0.3s ease;
    }

    /* INFO GRID */
    .detail-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .detail-info-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 14px;
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      font-size: 13px;
      transition: all 0.25s;
    }
    .detail-info-item:hover { border-color: #f97316; background: #fff7ed; transform: translateY(-1px); }

    /* SPEC ROWS */
    .spec-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
      transition: background 0.2s;
    }
    .spec-row:hover { background: #fff7ed; padding-left: 8px; border-radius: 4px; }

    /* STARS */
    .detail-star {
      display: inline-block;
      animation: starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    .detail-star:nth-child(1) { animation-delay: 0s; }
    .detail-star:nth-child(2) { animation-delay: 0.1s; }
    .detail-star:nth-child(3) { animation-delay: 0.2s; }
    .detail-star:nth-child(4) { animation-delay: 0.3s; }
    .detail-star:nth-child(5) { animation-delay: 0.4s; }

    /* RATING BAR */
    .rating-bar-fill {
      height: 100%;
      border-radius: 99px;
      background: #f59e0b;
      animation: progressBar 1s ease both;
    }

    /* DELIVERY ITEMS */
    .delivery-item {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
      align-items: flex-start;
      padding: 10px;
      border-radius: 6px;
      transition: all 0.25s;
      animation: deliverySlide 0.4s ease both;
    }
    .delivery-item:hover { background: #fff7ed; transform: translateX(4px); }
    .delivery-item:nth-child(1) { animation-delay: 0.1s; }
    .delivery-item:nth-child(2) { animation-delay: 0.2s; }
    .delivery-item:nth-child(3) { animation-delay: 0.3s; }
    .delivery-item:nth-child(4) { animation-delay: 0.4s; }

    /* VENDEUR CARD */
    .detail-vendeur-avatar {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
      flex-shrink: 0;
      transition: all 0.3s;
      animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    .detail-vendeur-avatar:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 4px 16px rgba(249,115,22,0.4); }

    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid #f5f5f5;
      transition: all 0.2s;
    }
    .stat-row:last-child { border-bottom: none; }
    .stat-row:hover { padding-left: 6px; color: #f97316; }

    /* BOUTONS */
    .btn-orange {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.25s;
    }
    .btn-orange:hover { background: linear-gradient(135deg, #ea580c, #c2410c); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
    .btn-orange:active { transform: translateY(0) scale(0.98); }

    .btn-outline {
      background: #fff;
      color: #f97316;
      border: 2px solid #f97316;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.25s;
    }
    .btn-outline:hover { background: #fff7ed; transform: translateY(-1px); }

    /* FICHE FAV */
    .detail-save-btn {
      width: 100%;
      padding: 12px 0;
      font-size: 14px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
    }

    /* SIMILAR CARDS */
    .similar-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
      animation: similarCard 0.5s ease both;
    }
    .similar-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); border-color: #f97316; }
    .similar-card:nth-child(1) { animation-delay: 0.1s; }
    .similar-card:nth-child(2) { animation-delay: 0.2s; }
    .similar-card:nth-child(3) { animation-delay: 0.3s; }
    .similar-card:nth-child(4) { animation-delay: 0.4s; }
    .similar-card-img { width: 100%; height: 140px; object-fit: cover; transition: transform 0.4s; }
    .similar-card:hover .similar-card-img { transform: scale(1.08); }

    /* TEXTAREA */
    .detail-textarea {
      width: 100%;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 13px;
      resize: none;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      transition: all 0.25s;
    }
    .detail-textarea:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }

    /* RESPONSIVE */
    @media (max-width: 1100px) {
      .detail-grid { grid-template-columns: 320px 1fr !important; }
      .col3 { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; }
      .col3 > * { flex: 1; min-width: 260px; }
    }
    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr !important; }
      .col3 { flex-direction: column; }
      .col3 > * { min-width: unset; }
      .detail-info-grid { grid-template-columns: 1fr !important; }
      .detail-main-pad { padding: 0 10px !important; }
    }
    @media (max-width: 480px) {
      .detail-info-grid { grid-template-columns: 1fr !important; }
    }
  `;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 20 }}>
      <style>{css}</style>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{ width: 64, height: 64, border: '4px solid #fed7aa', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 8, border: '3px solid #fef3c7', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 1s linear infinite reverse' }} />
      </div>
      <p style={{ color: '#aaa', fontSize: 14, fontFamily: 'inherit' }}>Chargement de l'annonce...</p>
    </div>
  );

  if (!annonce) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <style>{css}</style>
      <div style={{ fontSize: 64, animation: 'scaleIn 0.4s ease' }}>😕</div>
      <h2 style={{ marginTop: 16, color: '#1a1a1a' }}>Annonce introuvable</h2>
      <Link to="/" style={{ color: '#f97316', fontWeight: 700 }}>← Retour à l'accueil</Link>
    </div>
  );

  return (
    <div className="detail-wrap">
      <style>{css}</style>

      {/* TOAST */}
      {shareToast && <div className="detail-toast">✅ {shareToast}</div>}

      {/* BREADCRUMB */}
      <div className="detail-breadcrumb">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Link to="/">🏠 Accueil</Link>
          <span>›</span>
          {annonce.categorie_nom && <><Link to={`/?categorie=${annonce.categorie_nom}`} style={{ color: '#555', textDecoration: 'none' }}>{annonce.categorie_nom}</Link><span>›</span></>}
          <span style={{ color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{annonce.titre}</span>
        </div>
      </div>

      <div className="detail-main-pad" style={{ maxWidth: 1200, margin: '16px auto', padding: '0 16px' }}>
        <div className="detail-grid">

          {/* COL 1 — GALERIE */}
          <div style={{ animation: 'fadeLeft 0.5s ease' }}>
            <div className="card" style={{ padding: 14 }}>

              {/* Image principale avec zoom */}
              <div
                className={`detail-img-wrap ${imgZoom ? 'zoomed' : ''}`}
                onClick={() => setImgZoom(!imgZoom)}
                onMouseMove={handleImageMove}
                onMouseLeave={() => setImgZoom(false)}
              >
                {images.length > 0 ? (
                  <img
                    key={imgIdx}
                    src={images[imgIdx]}
                    alt={annonce.titre}
                    className={`detail-main-img ${imgZoom ? 'zoomed-img' : ''}`}
                    style={imgZoom ? { '--ox': `${imgPos.x}%`, '--oy': `${imgPos.y}%` } : {}}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, color: '#ddd' }}>🖼️</div>
                )}

                <button className={`detail-fav-btn ${favori ? 'active' : ''}`} onClick={e => { e.stopPropagation(); setFavori(!favori); }}>
                  {favori ? '❤️' : '🤍'}
                </button>

                {!imgZoom && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                    🔍 Survolez pour zoomer
                  </div>
                )}

                {images.length > 1 && !imgZoom && (
                  <>
                    <button className="detail-arrow" style={{ left: 8 }} onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}>‹</button>
                    <button className="detail-arrow" style={{ right: 8 }} onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}>›</button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" className={`detail-thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                  ))}
                </div>
              )}

              {/* Partager */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Partager</span>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {[['📘', 'Facebook'], ['🐦', 'Twitter'], ['💬', 'WhatsApp']].map(([icon, name]) => (
                    <button key={name} className="detail-share-btn" title={name} onClick={() => handleShare(name)}>{icon}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COL 2 — INFOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 0.5s ease 0.1s both' }}>

            <div className="card" style={{ padding: '22px 26px' }}>
              {annonce.categorie_nom && <span className="detail-cat-badge">{annonce.categorie_nom}</span>}

              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.4 }}>
                {annonce.titre}
              </h1>

              <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>
                Vendu par <span style={{ color: '#f97316', fontWeight: 700, cursor: 'pointer' }}>{annonce.vendeur_nom}</span>
              </div>

              {/* PRIX ANIMÉ */}
              <div className="detail-price-box" ref={priceRef}>
                <div className="detail-price">
                  {priceVisible ? priceCount.toLocaleString('fr-FR') : '0'} FCFA
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 6, display: 'flex', gap: 12 }}>
                  <span>📍 {annonce.localisation}</span>
                  <span>📅 {new Date(annonce.date_publication).toLocaleDateString('fr-SN')}</span>
                </div>
              </div>

              {/* ÉTOILES ANIMÉES */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <div>
                  {'★★★★☆'.split('').map((s, i) => (
                    <span key={i} className="detail-star" style={{ color: '#f59e0b', fontSize: 16 }}>{s}</span>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#f97316', cursor: 'pointer', fontWeight: 600 }}>(Voir les avis)</span>
              </div>

              {/* SUCCESS */}
              {sent && (
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #fff)', border: '1px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, animation: 'scaleIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✅ Message envoyé au vendeur avec succès !
                </div>
              )}

              {/* BOUTON CONTACT */}
              <button className="detail-contact-btn" onClick={() => { setShowForm(!showForm); setBtnPulse(true); setTimeout(() => setBtnPulse(false), 300); }}>
                💬 {showForm ? 'Fermer le formulaire' : 'Contacter le vendeur'}
              </button>

              {/* FORMULAIRE */}
              {showForm && (
                <div style={{ marginTop: 14, background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, padding: 18, animation: 'fadeUp 0.3s ease' }}>
                  <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>✉️ Envoyer un message</p>
                  <textarea
                    className="detail-textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required rows={4}
                    placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button type="button" className="btn-orange" style={{ flex: 2, padding: '11px 0', fontSize: 14 }} onClick={handleContact}>📤 Envoyer</button>
                    <button type="button" className="btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px 0', fontSize: 14 }}>Annuler</button>
                  </div>
                </div>
              )}

              {/* SAUVEGARDER */}
              <button
                className="detail-save-btn"
                onClick={() => setFavori(!favori)}
                style={{ border: `2px solid ${favori ? '#ef4444' : '#f97316'}`, color: favori ? '#ef4444' : '#f97316', background: '#fff' }}
              >
                {favori ? '❤️ Sauvegardé dans vos favoris' : '🤍 Sauvegarder cette annonce'}
              </button>
            </div>

            {/* ONGLETS */}
            <div className="card">
              <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
                {[
                  { id: 'details', label: '📋 Détails' },
                  { id: 'fiche', label: '📊 Fiche technique' },
                  { id: 'avis', label: '⭐ Avis clients' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setSection(id)} className={`tab-btn ${section === id ? 'active' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ padding: '22px 26px' }} className="tab-content" key={section}>
                {section === 'details' && (
                  <div>
                    <p style={{ fontSize: 14, color: '#555', lineHeight: 1.9, margin: '0 0 20px' }}>
                      {annonce.description || 'Aucune description fournie.'}
                    </p>
                    <div className="detail-info-grid">
                      {[
                        ['📁 Catégorie', annonce.categorie_nom || '—'],
                        ['📍 Localisation', annonce.localisation || '—'],
                        ['📅 Date', new Date(annonce.date_publication).toLocaleDateString('fr-SN')],
                        ['✅ État', annonce.etat || 'Bon état'],
                      ].map(([k, v]) => (
                        <div key={k} className="detail-info-item">
                          <span style={{ color: '#888', fontSize: 12 }}>{k}</span>
                          <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'fiche' && (
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5, color: '#f97316' }}>
                      PRINCIPALES CARACTÉRISTIQUES
                    </div>
                    {[
                      ['Catégorie', annonce.categorie_nom || '—'],
                      ['Vendeur', annonce.vendeur_nom || '—'],
                      ['Localisation', annonce.localisation || '—'],
                      ['Date de publication', new Date(annonce.date_publication).toLocaleDateString('fr-SN')],
                      ['État', annonce.etat || 'Occasion / Bon état'],
                    ].map(([k, v], i) => (
                      <div key={k} className="spec-row" style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <span style={{ width: 200, color: '#666', flexShrink: 0 }}>• {k}</span>
                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section === 'avis' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 44, fontWeight: 900, color: '#1a1a1a', animation: 'priceCount 0.5s ease' }}>4.5</div>
                        <div style={{ color: '#f59e0b', fontSize: 18 }}>★★★★½</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>12 avis vérifiés</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[[5, '70%'], [4, '20%'], [3, '5%'], [2, '3%'], [1, '2%']].map(([n, w]) => (
                          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: '#666', width: 12 }}>{n}</span>
                            <span style={{ color: '#f59e0b', fontSize: 10 }}>★</span>
                            <div style={{ flex: 1, background: '#e8e8e8', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                              <div className="rating-bar-fill" style={{ '--w': w, width: w }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#aaa', width: 30 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>Les avis seront affichés ici.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COL 3 — LIVRAISON & VENDEUR */}
          <div className="col3" style={{ animation: 'fadeRight 0.5s ease 0.2s both' }}>

            {/* Livraison */}
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#1a1a1a', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #f97316', display: 'flex', alignItems: 'center', gap: 8 }}>
                🚚 LIVRAISON & RETOURS
              </div>
              {[
                { icon: '🚀', titre: 'Livraison Express', desc: '24–48h', prix: '1 000 FCFA', couleur: '#8b5cf6' },
                { icon: '🏪', titre: 'Point relais', desc: 'Retrait sur place', prix: '250 FCFA', couleur: null },
                { icon: '🏠', titre: 'Domicile', desc: 'Selon accord', prix: 'À négocier', couleur: null },
                { icon: '🤝', titre: 'Main propre', desc: 'Rencontre directe', prix: 'Gratuit', couleur: '#16a34a' },
              ].map(({ icon, titre, desc, prix, couleur }) => (
                <div key={titre} className="delivery-item">
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: couleur || '#1a1a1a' }}>{titre}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', flexShrink: 0 }}>{prix}</div>
                </div>
              ))}
            </div>

            {/* Vendeur */}
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: '#999', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f0f0f0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                INFORMATIONS VENDEUR
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div className="detail-vendeur-avatar">
                  {annonce.vendeur_nom?.[0]?.toUpperCase() || 'V'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#1a1a1a' }}>{annonce.vendeur_nom}</div>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 3 }}>✓ Vendeur vérifié</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14, background: '#fafafa', borderRadius: 6, padding: '4px 8px' }}>
                {[['⭐', 'Note', '4.5 / 5'], ['🚀', 'Vitesse', 'Excellente'], ['✅', 'Qualité', 'Excellente'], ['↩️', 'Annulations', 'Très faible']].map(([icon, label, val]) => (
                  <div key={label} className="stat-row">
                    <span style={{ color: '#888', fontSize: 12 }}>{icon} {label}</span>
                    <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 12 }}>{val}</span>
                  </div>
                ))}
              </div>
              <button className="btn-outline" style={{ width: '100%', padding: '10px 0', fontSize: 13 }}>
                👤 Voir le profil
              </button>
            </div>

            {/* Retour */}
            <div className="card" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>↩️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Politique de retour</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4, lineHeight: 1.6 }}>
                    Retour possible sous 7 jours. <span style={{ color: '#f97316', cursor: 'pointer', fontWeight: 600 }}>Détails →</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#ccc'}
              >
                🚩 Signaler cette annonce
              </button>
            </div>
          </div>
        </div>

        {/* ANNONCES SIMILAIRES */}
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', padding: '22px 26px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 20px', paddingBottom: 14, borderBottom: '2px solid #f97316', display: 'flex', alignItems: 'center', gap: 8 }}>
            🔍 Annonces similaires
          </h2>
          {similarAnnonces.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {similarAnnonces.map(a => (
                <div key={a.id} className="similar-card" onClick={() => { navigate(`/annonce/${a.id}`); window.scrollTo(0, 0); }}>
                  {a.image ? (
                    <img src={getImageUrl(a.image)} alt={a.titre} className="similar-card-img" onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div style={{ height: 140, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🖼️</div>
                  )}
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.titre}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f97316' }}>{Number(a.prix).toLocaleString('fr-FR')} FCFA</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>📍 {a.localisation}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#bbb', flexDirection: 'column', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <Link to="/" className="btn-orange" style={{ padding: '10px 24px', fontSize: 13, borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}>
                Voir toutes les annonces
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailAnnonce;
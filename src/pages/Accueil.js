import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const CATEGORIES = [
  { label: 'Tout', value: '', icon: '🏪' },
  { label: 'Électronique', value: 'Électronique', icon: '📱' },
  { label: 'Habillement', value: 'Habillement', icon: '👗' },
  { label: 'Services', value: 'Services', icon: '🛠️' },
  { label: 'Immobilier', value: 'Immobilier', icon: '🏠' },
];

// Compteur animé
function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
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

// Shimmer card pendant le chargement
function ShimmerCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 8, overflow: 'hidden',
      border: '1px solid #e8e8e8', animation: 'shimmer-move 1.5s infinite'
    }}>
      <div style={{ height: 200, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer-move 1.5s infinite' }} />
      <div style={{ padding: 14 }}>
        <div style={{ height: 12, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer-move 1.5s infinite', borderRadius: 4, marginBottom: 8, width: '60%' }} />
        <div style={{ height: 18, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer-move 1.5s infinite', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 14, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer-move 1.5s infinite', borderRadius: 4, width: '40%' }} />
      </div>
    </div>
  );
}

function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');
  const [loading, setLoading] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [pubIdx, setPubIdx] = useState(0);
  const [visibleCards, setVisibleCards] = useState({});
  const [ripples, setRipples] = useState({});
  const [searchFocused, setSearchFocused] = useState(false);
  const cardRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => { fetchAnnonces(); }, []);

  useEffect(() => {
    if (annonces.length === 0) return;
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % annonces.length), 3000);
    return () => clearInterval(timer);
  }, [annonces]);

  useEffect(() => {
    const timer = setInterval(() => setPubIdx(i => (i + 1) % CATEGORIES.length), 2000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer pour animer les cartes au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => ({ ...prev, [entry.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(cardRefs.current).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [annonces]);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch(`${API_URL}/api/annonces/`);
      const data = await response.json();
      setAnnonces(data);
    } catch (error) { console.error('Erreur:', error); }
    finally { setLoading(false); }
  };

  const handleRecherche = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/annonces/?search=${recherche}&categorie=${categorie}`);
      const data = await response.json();
      setAnnonces(data);
    } catch (error) { console.error('Erreur:', error); }
    finally { setLoading(false); }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const clean = image.trim();
    return clean.startsWith('http') ? clean : `${API_URL}${clean}`;
  };

  // Effet ripple sur les cartes
  const handleRipple = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples(prev => ({ ...prev, [id]: { x, y, key: Date.now() } }));
    setTimeout(() => setRipples(prev => { const n = { ...prev }; delete n[id]; return n; }), 600);
  };

  const css = `
    @keyframes spin { to { transform: rotate(360deg) } }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes float1 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes float2 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    @keyframes float3 {
      0%, 100% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-12px) rotate(3deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
      50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(249,115,22,0); }
    }

    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 8px 32px rgba(249,115,22,0.2); }
      50% { box-shadow: 0 8px 48px rgba(249,115,22,0.6); }
    }

    @keyframes shimmer-move {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes ripple-anim {
      0% { transform: scale(0); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes rotate360 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    * { box-sizing: border-box; }

    .acc-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── TICKER ── */
    .acc-ticker {
      background: linear-gradient(90deg, #1a1a1a, #2d2d2d, #1a1a1a);
      background-size: 200% 100%;
      animation: gradientShift 4s ease infinite;
      color: #fff;
      padding: 9px 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .acc-ticker-track {
      display: inline-flex;
      animation: ticker 25s linear infinite;
    }
    .acc-ticker-item {
      display: inline-block;
      padding: 0 40px;
      font-size: 13px;
      font-weight: 600;
      transition: color 0.3s;
    }
    .acc-ticker-item:hover { color: #f97316; }

    /* ── HERO ── */
    .acc-hero {
      position: relative;
      height: 500px;
      overflow: hidden;
      background: #1a1a1a;
    }

    .acc-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .acc-slide.active { opacity: 1; }

    .acc-slide-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 6s ease;
    }
    .acc-slide.active .acc-slide-img { transform: scale(1.06); }

    .acc-slide-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }

    .acc-slide-cat {
      background: #f97316;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 16px;
      border-radius: 20px;
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      animation: popIn 0.5s ease both;
      animation-delay: 0.2s;
    }

    .acc-slide-title {
      font-size: 36px;
      font-weight: 900;
      color: #fff;
      margin: 0 0 10px;
      text-shadow: 0 2px 16px rgba(0,0,0,0.5);
      max-width: 600px;
      line-height: 1.2;
      animation: fadeUp 0.6s ease both;
      animation-delay: 0.3s;
    }

    .acc-slide-price {
      font-size: 28px;
      font-weight: 800;
      color: #f97316;
      margin: 0 0 8px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: fadeUp 0.6s ease both;
      animation-delay: 0.4s;
    }

    .acc-slide-loc {
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      margin: 0 0 22px;
      animation: fadeUp 0.6s ease both;
      animation-delay: 0.5s;
    }

    .acc-slide-btn {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      padding: 13px 32px;
      border-radius: 4px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
      animation: fadeUp 0.6s ease both;
      animation-delay: 0.6s;
      position: relative;
      overflow: hidden;
    }
    .acc-slide-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.2);
      transform: translateX(-100%);
      transition: transform 0.3s;
    }
    .acc-slide-btn:hover::after { transform: translateX(0); }
    .acc-slide-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(249,115,22,0.5); }

    .acc-slide-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
    }

    .acc-slider-dots {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .acc-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: none; padding: 0;
    }
    .acc-dot.active { background: #f97316; width: 28px; border-radius: 4px; }
    .acc-dot:hover:not(.active) { background: rgba(255,255,255,0.7); transform: scale(1.2); }

    .acc-arrow {
      position: absolute;
      top: 45%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      width: 48px; height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s;
    }
    .acc-arrow:hover {
      background: rgba(249,115,22,0.8);
      border-color: #f97316;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 20px rgba(249,115,22,0.4);
    }
    .acc-arrow.left { left: 20px; }
    .acc-arrow.right { right: 20px; }

    /* SEARCH */
    .acc-search-area {
      position: absolute;
      bottom: 0;
      left: 0; right: 0;
      padding: 16px 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
      z-index: 10;
    }
    .acc-search-box {
      max-width: 780px;
      margin: 0 auto;
      display: flex;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      overflow: hidden;
      transition: all 0.3s;
    }
    .acc-search-box.focused {
      box-shadow: 0 8px 48px rgba(249,115,22,0.5);
      transform: translateY(-2px);
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
      padding: 16px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      color: #555;
      background: #fff;
      cursor: pointer;
    }
    .acc-search-btn {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      padding: 16px 28px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }
    .acc-search-btn::before {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      width: 0; height: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s, height 0.4s;
    }
    .acc-search-btn:hover::before { width: 200px; height: 200px; }
    .acc-search-btn:hover { background: linear-gradient(135deg, #ea580c, #c2410c); }

    /* STATS BAR */
    .acc-stats-bar {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      animation: slideDown 0.5s ease;
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
      transition: transform 0.2s;
    }
    .acc-stat-item:hover { transform: translateY(-2px); }
    .acc-stat-item strong { color: #f97316; font-size: 16px; font-weight: 800; }

    /* PUB BAR */
    .acc-pub-bar {
      padding: 12px 20px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      border-top: 3px solid #f97316;
      border-bottom: 1px solid #fed7aa;
      background: linear-gradient(90deg, #fff7ed, #fff, #fff7ed);
      background-size: 200% 100%;
      animation: gradientShift 3s ease infinite;
      cursor: pointer;
      transition: all 0.3s;
    }
    .acc-pub-bar:hover { background: #fff7ed; transform: none; letter-spacing: 0.3px; }

    /* CATEGORIES */
    .acc-cats {
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      position: sticky;
      top: 70px;
      z-index: 100;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
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
      padding: 9px 20px;
      border-radius: 25px;
      border: 1.5px solid #e0e0e0;
      background: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      white-space: nowrap;
      color: #555;
      position: relative;
      overflow: hidden;
    }
    .acc-cat-pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #f97316, #ea580c);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .acc-cat-pill:hover {
      border-color: #f97316;
      color: #f97316;
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(249,115,22,0.2);
    }
    .acc-cat-pill.active {
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-color: #f97316;
      color: #fff;
      box-shadow: 0 6px 20px rgba(249,115,22,0.45);
      transform: translateY(-3px);
    }

    /* BODY */
    .acc-body {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 20px;
    }

    /* PROMO GRID */
    .acc-promo-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
      animation: fadeUp 0.6s ease both;
    }
    .acc-promo-main {
      background: linear-gradient(135deg, #1a1a1a, #292929);
      border-radius: 8px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      min-height: 160px;
      transition: transform 0.3s;
    }
    .acc-promo-main:hover { transform: translateY(-4px); }
    .acc-promo-main::before {
      content: '🛒';
      position: absolute;
      right: -10px; bottom: -10px;
      font-size: 100px;
      opacity: 0.08;
      animation: float1 4s ease-in-out infinite;
    }
    .acc-promo-main h3 { color: #f97316; font-size: 20px; font-weight: 900; margin: 0 0 8px; }
    .acc-promo-main p { color: #aaa; font-size: 13px; margin: 0 0 16px; }
    .acc-promo-btn {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      width: fit-content;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .acc-promo-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249,115,22,0.5); }

    .acc-promo-small {
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      min-height: 160px;
    }
    .acc-promo-small:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
    .acc-promo-small-icon { font-size: 40px; margin-bottom: 10px; animation: float2 3s ease-in-out infinite; }
    .acc-promo-small-title { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
    .acc-promo-small-sub { font-size: 12px; opacity: 0.8; }

    /* SECTION HEADER */
    .acc-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      animation: fadeLeft 0.5s ease both;
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
      background: linear-gradient(to bottom, #f97316, #ea580c);
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
      animation: popIn 0.4s ease both;
    }

    /* GRID */
    .acc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    /* CARD */
    .acc-card {
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      opacity: 0;
      transform: translateY(40px);
      transition:
        opacity 0.5s ease,
        transform 0.5s ease,
        box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        border-color 0.35s ease;
    }
    .acc-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .acc-card:hover {
      transform: translateY(-10px) scale(1.02) perspective(1000px) rotateX(2deg);
      box-shadow: 0 24px 56px rgba(0,0,0,0.18);
      border-color: #f97316;
      z-index: 10;
    }

    /* RIPPLE */
    .acc-card-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(249,115,22,0.25);
      width: 60px; height: 60px;
      margin-left: -30px; margin-top: -30px;
      animation: ripple-anim 0.6s linear;
      pointer-events: none;
      z-index: 20;
    }

    .acc-card-img-wrap {
      overflow: hidden;
      height: 200px;
      position: relative;
      background: linear-gradient(135deg, #f5f5f5, #ebebeb);
    }
    .acc-card-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .acc-card:hover .acc-card-img { transform: scale(1.15); }
    .acc-card-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 52px;
      transition: transform 0.5s ease;
    }
    .acc-card:hover .acc-card-placeholder { transform: scale(1.12) rotate(5deg); }

    .acc-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: flex-end;
      padding: 14px;
    }
    .acc-card:hover .acc-card-overlay { opacity: 1; }
    .acc-card-overlay-btn {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      padding: 9px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      font-family: inherit;
      transition: transform 0.2s;
    }
    .acc-card-overlay-btn:hover { transform: translateY(-1px); }

    .acc-card-body { padding: 14px; }
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
      top: 10px; left: 10px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 2px;
      text-transform: uppercase;
      z-index: 5;
      animation: bounce 2s ease-in-out infinite;
    }

    .acc-card-fav {
      position: absolute;
      top: 10px; right: 10px;
      background: rgba(255,255,255,0.95);
      border: none;
      border-radius: 50%;
      width: 34px; height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      z-index: 5;
      opacity: 0;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .acc-card:hover .acc-card-fav { opacity: 1; }
    .acc-card-fav:hover { transform: scale(1.2); animation: heartbeat 0.8s ease; }

    /* SHIMMER */
    .shimmer-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e8e8e8;
    }
    .shimmer-img {
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer-move 1.5s infinite;
    }
    .shimmer-line {
      height: 12px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer-move 1.5s infinite;
      margin-bottom: 8px;
    }

    /* EMPTY */
    .acc-empty {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
      animation: scaleIn 0.4s ease;
    }

    /* SCROLL TO TOP */
    .acc-scroll-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #fff;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(249,115,22,0.4);
      transition: all 0.3s;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: popIn 0.3s ease;
    }
    .acc-scroll-top:hover { transform: translateY(-4px) scale(1.1); box-shadow: 0 8px 24px rgba(249,115,22,0.5); }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .acc-promo-grid { grid-template-columns: 1fr 1fr; }
      .acc-promo-main { grid-column: 1 / -1; }
    }
    @media (max-width: 768px) {
      .acc-hero { height: 420px; }
      .acc-slide-title { font-size: 22px; }
      .acc-slide-price { font-size: 20px; }
      .acc-search-select { display: none; }
      .acc-search-btn { padding: 16px 16px; font-size: 14px; }
      .acc-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
      .acc-body { padding: 0 12px; margin: 16px auto; }
      .acc-promo-grid { grid-template-columns: 1fr; }
      .acc-promo-main { grid-column: auto; }
      .acc-stats-inner { gap: 16px; padding: 10px 12px; }
    }
    @media (max-width: 400px) {
      .acc-grid { grid-template-columns: 1fr !important; }
      .acc-hero { height: 360px; }
    }
  `;

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="acc-wrap">
      <style>{css}</style>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button className="acc-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}

      {/* TICKER */}
      <div className="acc-ticker">
        <div className="acc-ticker-track">
          {[...annonces, ...annonces].map((a, i) => (
            <span key={i} className="acc-ticker-item">
              🔥 {a.titre} — {Number(a.prix).toLocaleString('fr-FR')} FCFA &nbsp;⚡&nbsp;
            </span>
          ))}
          {annonces.length === 0 && (
            <span className="acc-ticker-item">🛒 Bienvenue sur Mini Marketplace — Achetez et vendez facilement au Sénégal ⚡ 100% gratuit 🌟 Vendeurs vérifiés</span>
          )}
        </div>
      </div>

      {/* HERO SLIDER */}
      <div className="acc-hero">
        {annonces.length > 0 ? annonces.map((annonce, i) => (
          <div key={annonce.id} className={`acc-slide ${i === slideIdx ? 'active' : ''}`}>
            {annonce.image ? (
              <img src={getImageUrl(annonce.image)} alt={annonce.titre} className="acc-slide-img" onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="acc-slide-placeholder" style={{ background: `hsl(${i * 40}, 70%, 35%)` }}>🖼️</div>
            )}
            <div className="acc-slide-overlay">
              <div className="acc-slide-cat">{annonce.categorie_nom || 'Annonce'}</div>
              <h2 className="acc-slide-title">{annonce.titre}</h2>
              <p className="acc-slide-price">{Number(annonce.prix).toLocaleString('fr-FR')} FCFA</p>
              <p className="acc-slide-loc">📍 {annonce.localisation} · 👤 {annonce.vendeur_nom}</p>
              <button className="acc-slide-btn" onClick={() => navigate(`/annonce/${annonce.id}`)}>
                Voir l'annonce →
              </button>
            </div>
          </div>
        )) : (
          <div className="acc-slide active" style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)' }}>
            <div className="acc-slide-overlay">
              <div className="acc-slide-cat">Bienvenue</div>
              <h2 className="acc-slide-title">Mini Marketplace Sénégal</h2>
              <p className="acc-slide-loc">Achetez et vendez facilement près de chez vous</p>
              <button className="acc-slide-btn" onClick={() => navigate('/nouvelle-annonce')}>Publier une annonce →</button>
            </div>
          </div>
        )}

        {annonces.length > 1 && (
          <>
            <button className="acc-arrow left" onClick={() => setSlideIdx(i => (i - 1 + annonces.length) % annonces.length)}>‹</button>
            <button className="acc-arrow right" onClick={() => setSlideIdx(i => (i + 1) % annonces.length)}>›</button>
          </>
        )}

        {annonces.length > 1 && (
          <div className="acc-slider-dots">
            {annonces.slice(0, 8).map((_, i) => (
              <button key={i} className={`acc-dot ${i === slideIdx ? 'active' : ''}`} onClick={() => setSlideIdx(i)} />
            ))}
          </div>
        )}

        <div className="acc-search-area">
          <div className={`acc-search-box ${searchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              className="acc-search-input"
              placeholder="🔍 Rechercher un produit, une marque..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRecherche()}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <select className="acc-search-select" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              <option value="">Toutes catégories</option>
              <option value="Électronique">📱 Électronique</option>
              <option value="Habillement">👗 Habillement</option>
              <option value="Services">🛠️ Services</option>
              <option value="Immobilier">🏠 Immobilier</option>
            </select>
            <button className="acc-search-btn" onClick={handleRecherche}>Rechercher</button>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="acc-stats-bar">
        <div className="acc-stats-inner">
          <div className="acc-stat-item">🏪 <strong><CountUp target={annonces.length} /></strong> annonces disponibles</div>
          <div className="acc-stat-item">📍 <strong>Dakar</strong> & partout au Sénégal</div>
          <div className="acc-stat-item">✅ <strong>100%</strong> gratuit</div>
          <div className="acc-stat-item">🔒 <strong>Vendeurs</strong> vérifiés</div>
        </div>
      </div>

      {/* PUB ROTATIVE */}
      <div className="acc-pub-bar" style={{ color: '#f97316' }}
        onClick={() => {
          setCategorie(CATEGORIES[pubIdx]?.value || '');
          setLoading(true);
          fetch(`${API_URL}/api/annonces/?categorie=${CATEGORIES[pubIdx]?.value || ''}`)
            .then(r => r.json())
            .then(d => { setAnnonces(d); setLoading(false); })
            .catch(() => setLoading(false));
        }}
      >
        {CATEGORIES[pubIdx]?.icon} Découvrez nos annonces <strong>{CATEGORIES[pubIdx]?.label}</strong> — Cliquez ici !
      </div>

      {/* CATEGORIES */}
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

      {/* BODY */}
      <div className="acc-body">

        {/* PROMO */}
        <div className="acc-promo-grid">
          <div className="acc-promo-main">
            <h3>🚀 Vendez vos produits gratuitement !</h3>
            <p>Publiez votre annonce en moins de 2 minutes et touchez des milliers d'acheteurs au Sénégal.</p>
            <button className="acc-promo-btn" onClick={() => window.location.href = '/nouvelle-annonce'}>Publier maintenant →</button>
          </div>
          <div className="acc-promo-small" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#1d4ed8' }}>
            <div className="acc-promo-small-icon">🛡️</div>
            <div className="acc-promo-small-title">Achat Sécurisé</div>
            <div className="acc-promo-small-sub">Vendeurs vérifiés</div>
          </div>
          <div className="acc-promo-small" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#16a34a' }}>
            <div className="acc-promo-small-icon">⚡</div>
            <div className="acc-promo-small-title">Réponse Rapide</div>
            <div className="acc-promo-small-sub">En moins de 24h</div>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="acc-section-header">
          <h2 className="acc-section-title">Dernières annonces</h2>
          <span className="acc-count-badge">{annonces.length} résultat{annonces.length > 1 ? 's' : ''}</span>
        </div>

        {/* CONTENU */}
        {loading ? (
          <div className="acc-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="shimmer-card">
                <div className="shimmer-img" />
                <div style={{ padding: 14 }}>
                  <div className="shimmer-line" style={{ width: '50%' }} />
                  <div className="shimmer-line" />
                  <div className="shimmer-line" style={{ width: '70%' }} />
                  <div className="shimmer-line" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : annonces.length === 0 ? (
          <div className="acc-empty">
            <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Aucune annonce trouvée</p>
            <p style={{ fontSize: 14, color: '#aaa', margin: 0 }}>Essayez d'autres mots-clés ou catégories.</p>
          </div>
        ) : (
          <div className="acc-grid">
            {annonces.map((annonce, idx) => (
              <div
                key={annonce.id}
                ref={el => cardRefs.current[annonce.id] = el}
                data-id={annonce.id}
                className={`acc-card ${visibleCards[annonce.id] ? 'visible' : ''}`}
                style={{ transitionDelay: `${(idx % 4) * 0.08}s` }}
                onClick={(e) => { handleRipple(e, annonce.id); navigate(`/annonce/${annonce.id}`); }}
              >
                {/* Ripple effect */}
                {ripples[annonce.id] && (
                  <span
                    key={ripples[annonce.id].key}
                    className="acc-card-ripple"
                    style={{ left: ripples[annonce.id].x, top: ripples[annonce.id].y }}
                  />
                )}

                {idx < 3 && <div className="acc-card-badge">🔥 Nouveau</div>}
                <button className="acc-card-fav" onClick={e => e.stopPropagation()}>🤍</button>

                <div className="acc-card-img-wrap">
                  {annonce.image ? (
                    <img src={getImageUrl(annonce.image)} alt={annonce.titre} className="acc-card-img" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="acc-card-placeholder">🖼️</div>
                  )}
                  <div className="acc-card-overlay">
                    <button className="acc-card-overlay-btn">Voir l'annonce →</button>
                  </div>
                </div>

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
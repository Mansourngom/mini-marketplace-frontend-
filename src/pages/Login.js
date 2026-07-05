import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Particules flottantes
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.4 + 0.1,
    emoji: ['🛒', '📱', '👗', '🏠', '💰', '⭐', '🔥', '✨'][Math.floor(Math.random() * 8)]
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          bottom: '-20px',
          fontSize: `${p.size + 10}px`,
          opacity: p.opacity,
          animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// Compteur de stats animé
function StatCount({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [success, setSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typingUser, setTypingUser] = useState(false);
  const [typingPass, setTypingPass] = useState(false);
  const [shake, setShake] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Effet parallaxe sur la carte
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setCardTilt({ x: y * 6, y: x * -6 });
    }
  };

  const handleMouseLeave = () => setCardTilt({ x: 0, y: 0 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'username') setTypingUser(true);
    if (e.target.name === 'password') setTypingPass(e.target.value.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShake(false);
    try {
      const response = await fetch(`${API_URL}/api/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const profileRes = await fetch(`${API_URL}/api/users/profile/`, {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const profile = await profileRes.json();
        localStorage.setItem('user_role', profile.role);
        localStorage.setItem('username', profile.username);
        setTimeout(() => { window.location.href = '/'; }, 1500);
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError('Erreur de connexion au serveur.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const css = `
    @keyframes particleFloat {
      0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.5; }
      100% { transform: translateY(-110vh) rotate(720deg) scale(0.5); opacity: 0; }
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes logoFloat {
      0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
      25% { transform: translateY(-8px) rotate(3deg) scale(1.05); }
      75% { transform: translateY(-4px) rotate(-2deg) scale(1.02); }
    }

    @keyframes logoPulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(249,115,22,0.3); }
      50% { box-shadow: 0 8px 40px rgba(249,115,22,0.7), 0 0 0 12px rgba(249,115,22,0.1); }
    }

    @keyframes gradientBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15% { transform: translateX(-8px) rotate(-1deg); }
      30% { transform: translateX(8px) rotate(1deg); }
      45% { transform: translateX(-6px) rotate(-0.5deg); }
      60% { transform: translateX(6px) rotate(0.5deg); }
      75% { transform: translateX(-3px); }
      90% { transform: translateX(3px); }
    }

    @keyframes successPop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes checkDraw {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }

    @keyframes shimmerSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes featureSlideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes typeIndicator {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes inputGlow {
      0%, 100% { box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }
      50% { box-shadow: 0 0 0 6px rgba(249,115,22,0.25), 0 0 20px rgba(249,115,22,0.1); }
    }

    @keyframes btnShimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes errorSlide {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes successWave {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(3); opacity: 0; }
    }

    @keyframes statPop {
      from { opacity: 0; transform: scale(0.8) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes borderFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    * { box-sizing: border-box; }

    .login-wrap {
      min-height: 100vh;
      background: linear-gradient(-45deg, #fff7ed, #fef3c7, #ffe4d6, #fff7ed, #f2f2f2);
      background-size: 400% 400%;
      animation: gradientBg 8s ease infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Open Sans','Segoe UI',sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* ORB décoratifs flottants */
    .login-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      animation: orbFloat 8s ease-in-out infinite;
      z-index: 0;
    }

    /* COLONNE GAUCHE */
    .login-left {
      display: none;
      flex: 1;
      max-width: 480px;
      padding: 40px;
      position: relative;
      z-index: 1;
    }

    .login-left-title {
      font-size: 36px;
      font-weight: 900;
      color: #1a1a1a;
      margin: 0 0 12px;
      line-height: 1.15;
      animation: fadeSlideRight 0.7s ease both;
    }

    .login-left-sub {
      font-size: 16px;
      color: #666;
      line-height: 1.7;
      margin: 0 0 32px;
      animation: fadeSlideRight 0.7s ease 0.15s both;
    }

    .login-feature-item {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(249,115,22,0.15);
      border-radius: 12px;
      padding: 14px 18px;
      transition: all 0.3s;
      cursor: default;
      animation: featureSlideIn 0.6s ease both;
    }
    .login-feature-item:hover {
      transform: translateX(8px) scale(1.02);
      border-color: #f97316;
      box-shadow: 0 4px 20px rgba(249,115,22,0.15);
    }
    .login-feature-item:nth-child(1) { animation-delay: 0.3s; }
    .login-feature-item:nth-child(2) { animation-delay: 0.45s; }
    .login-feature-item:nth-child(3) { animation-delay: 0.6s; }
    .login-feature-item:nth-child(4) { animation-delay: 0.75s; }

    .login-feature-icon {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #fff7ed, #fed7aa);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
      transition: transform 0.3s;
    }
    .login-feature-item:hover .login-feature-icon { transform: rotate(10deg) scale(1.1); }

    /* STATS */
    .login-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-top: 24px;
    }
    .login-stat {
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(249,115,22,0.1);
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      animation: statPop 0.5s ease both;
      transition: all 0.3s;
    }
    .login-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(249,115,22,0.15); }
    .login-stat:nth-child(1) { animation-delay: 0.9s; }
    .login-stat:nth-child(2) { animation-delay: 1.0s; }
    .login-stat:nth-child(3) { animation-delay: 1.1s; }
    .login-stat-num { font-size: 22px; font-weight: 900; color: #f97316; display: block; }
    .login-stat-label { font-size: 11px; color: #888; margin-top: 2px; }

    /* CARD */
    .login-card {
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.8);
      padding: 44px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(249,115,22,0.05);
      animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      position: relative;
      z-index: 1;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      transform-style: preserve-3d;
    }

    /* Bordure animée */
    .login-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 22px;
      background: linear-gradient(90deg, #f97316, #ea580c, #f59e0b, #f97316);
      background-size: 200% 100%;
      animation: borderFlow 3s linear infinite;
      z-index: -1;
      opacity: 0.6;
    }
    .login-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: rgba(255,255,255,0.92);
      z-index: -1;
    }

    /* LOGO */
    .login-logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-logo-icon {
      width: 76px; height: 76px;
      background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 16px;
      animation: logoFloat 4s ease-in-out infinite, logoPulse 2s ease-in-out infinite;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .login-logo-icon:hover { transform: scale(1.1) rotate(10deg); }
    .login-logo-icon::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
      pointer-events: none;
    }
    .login-logo h1 {
      font-size: 26px;
      font-weight: 900;
      color: #1a1a1a;
      margin: 0 0 6px;
      animation: fadeSlideUp 0.5s ease 0.2s both;
    }
    .login-logo p {
      font-size: 13px;
      color: #999;
      margin: 0;
      animation: fadeSlideUp 0.5s ease 0.3s both;
    }

    /* LABEL */
    .login-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #555;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: color 0.2s;
    }
    .login-label.focused { color: #f97316; }

    /* INPUT WRAP */
    .login-input-wrap { position: relative; }

    .login-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      background: #fafafa;
      color: #1a1a1a;
    }
    .login-input:focus {
      border-color: #f97316;
      background: #fff;
      animation: inputGlow 2s ease-in-out infinite;
      transform: translateY(-1px);
    }
    .login-input.has-value { border-color: #fed7aa; background: #fff; }

    /* Indicateur de saisie */
    .login-type-indicator {
      position: absolute;
      right: 44px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #f97316;
      font-weight: 700;
      animation: typeIndicator 0.8s ease-in-out infinite;
    }

    .login-eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #aaa;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .login-eye-btn:hover { color: #f97316; background: #fff7ed; transform: translateY(-50%) scale(1.2); }

    /* Barre de force du mot de passe */
    .login-pass-strength {
      display: flex;
      gap: 4px;
      margin-top: 6px;
    }
    .login-pass-bar {
      height: 3px;
      border-radius: 99px;
      flex: 1;
      background: #e8e8e8;
      transition: background 0.3s;
    }

    .login-field {
      margin-bottom: 20px;
      animation: fadeSlideUp 0.5s ease both;
    }
    .login-field:nth-child(1) { animation-delay: 0.4s; }
    .login-field:nth-child(2) { animation-delay: 0.5s; }

    /* ERREUR */
    .login-error {
      background: linear-gradient(135deg, #fef2f2, #fff);
      border: 1.5px solid #fca5a5;
      color: #dc2626;
      padding: 13px 16px;
      border-radius: 10px;
      font-size: 13px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: errorSlide 0.3s ease, shake 0.5s ease;
    }

    /* BOUTON */
    .login-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #f97316 100%);
      background-size: 200% 100%;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s;
      margin-top: 4px;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.3px;
      animation: fadeSlideUp 0.5s ease 0.6s both;
    }
    .login-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.4s;
    }
    .login-btn:hover:not(:disabled)::before { left: 100%; }
    .login-btn:hover:not(:disabled) {
      background-size: 200% 100%;
      animation: btnShimmer 1.5s linear infinite;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(249,115,22,0.5);
    }
    .login-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .login-btn:disabled { background: #fdba74; cursor: not-allowed; }

    /* LOADING DOTS */
    .login-loading-dot {
      display: inline-block;
      width: 6px; height: 6px;
      background: #fff;
      border-radius: 50%;
      margin: 0 2px;
      animation: loadingBounce 0.8s ease-in-out infinite;
    }
    .login-loading-dot:nth-child(2) { animation-delay: 0.15s; }
    .login-loading-dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes loadingBounce {
      0%, 100% { transform: translateY(0); opacity: 0.5; }
      50% { transform: translateY(-6px); opacity: 1; }
    }

    /* SUCCÈS */
    .login-success-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeSlideUp 0.3s ease;
    }
    .login-success-circle {
      width: 100px; height: 100px;
      background: linear-gradient(135deg, #16a34a, #15803d);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin-bottom: 20px;
      animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      box-shadow: 0 0 0 20px rgba(22,163,74,0.1), 0 0 0 40px rgba(22,163,74,0.05);
    }
    .login-success-wave {
      position: absolute;
      width: 100px; height: 100px;
      border: 3px solid #16a34a;
      border-radius: 50%;
      animation: successWave 1s ease-out infinite;
    }

    /* DIVIDER */
    .login-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 22px 0;
      animation: fadeSlideUp 0.5s ease 0.7s both;
    }
    .login-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #e8e8e8, transparent); }
    .login-divider-text { font-size: 12px; color: #bbb; font-weight: 600; }

    /* FEATURES GRID */
    .login-features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 20px;
      animation: fadeSlideUp 0.5s ease 0.8s both;
    }
    .login-feature {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
      background: #fafafa;
      border: 1.5px solid #f0f0f0;
      border-radius: 8px;
      padding: 10px 12px;
      transition: all 0.25s;
      cursor: default;
    }
    .login-feature:hover {
      border-color: #f97316;
      background: #fff7ed;
      color: #f97316;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249,115,22,0.1);
    }
    .login-feature-icon { font-size: 16px; flex-shrink: 0; transition: transform 0.3s; }
    .login-feature:hover .login-feature-icon { transform: rotate(15deg) scale(1.2); }

    /* FOOTER */
    .login-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #888;
      animation: fadeSlideUp 0.5s ease 0.9s both;
    }
    .login-footer a {
      color: #f97316;
      font-weight: 700;
      text-decoration: none;
      position: relative;
    }
    .login-footer a::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0; right: 0;
      height: 2px;
      background: #f97316;
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    .login-footer a:hover::after { transform: scaleX(1); }

    .login-terms {
      text-align: center;
      font-size: 11px;
      color: #ccc;
      margin-top: 14px;
      line-height: 1.6;
      animation: fadeSlideUp 0.5s ease 1s both;
    }
    .login-terms a { color: #f97316; text-decoration: none; }

    @media (min-width: 900px) {
      .login-left { display: flex; flex-direction: column; justify-content: center; }
      .login-wrap { gap: 48px; }
    }
    @media (max-width: 480px) {
      .login-card { padding: 28px 20px; border-radius: 16px; }
      .login-features { grid-template-columns: 1fr; }
    }
  `;

  // Force du mot de passe
  const getPassStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    return Math.min(strength, 4);
  };
  const passStrength = getPassStrength(formData.password);
  const strengthColors = ['#e8e8e8', '#ef4444', '#f97316', '#f59e0b', '#16a34a'];

  return (
    <>
      <style>{css}</style>

      {/* Overlay de succès */}
      {success && (
        <div className="login-success-overlay">
          <div style={{ position: 'relative' }}>
            <div className="login-success-wave" />
            <div className="login-success-wave" style={{ animationDelay: '0.3s' }} />
            <div className="login-success-circle">✅</div>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', margin: '0 0 8px', textAlign: 'center' }}>
            Connexion réussie !
          </h2>
          <p style={{ color: '#888', fontSize: 14 }}>Redirection en cours...</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%', animation: `loadingBounce 0.8s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ORBs décoratifs */}
      <div className="login-orb" style={{ width: 400, height: 400, background: 'rgba(249,115,22,0.08)', top: '-100px', right: '-100px', animationDuration: '10s' }} />
      <div className="login-orb" style={{ width: 300, height: 300, background: 'rgba(234,88,12,0.06)', bottom: '-80px', left: '-80px', animationDuration: '12s', animationDelay: '2s' }} />
      <div className="login-orb" style={{ width: 200, height: 200, background: 'rgba(249,115,22,0.05)', top: '40%', left: '20%', animationDuration: '8s', animationDelay: '1s' }} />

      {/* Particules */}
      <Particles />

      <div className="login-wrap" onMouseMove={handleMouseMove}>

        {/* COLONNE GAUCHE */}
        <div className="login-left">
          <div style={{ marginBottom: 8, fontSize: 52, animation: 'logoFloat 4s ease-in-out infinite' }}>🛒</div>
          <h2 className="login-left-title">
            Bienvenue sur<br />
            <span style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Mini Marketplace
            </span>
          </h2>
          <p className="login-left-sub">
            La plateforme locale pour acheter et vendre facilement au Sénégal. 🇸🇳
          </p>

          {[
            { icon: '🚀', title: 'Rapide & Facile', desc: 'Publiez en moins de 2 minutes' },
            { icon: '🔒', title: '100% Sécurisé', desc: 'Vos données sont protégées' },
            { icon: '📍', title: 'Local & Proche', desc: 'Vendeurs près de chez vous' },
            { icon: '💰', title: 'Gratuit', desc: 'Aucun frais de publication' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="login-feature-item">
              <div className="login-feature-icon">{icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}

          {/* Stats animées */}
          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-num"><StatCount target={500} />+</span>
              <div className="login-stat-label">Vendeurs</div>
            </div>
            <div className="login-stat">
              <span className="login-stat-num"><StatCount target={1200} />+</span>
              <div className="login-stat-label">Annonces</div>
            </div>
            <div className="login-stat">
              <span className="login-num"><StatCount target={98} />%</span>
              <div className="login-stat-label">Satisfaits</div>
            </div>
          </div>
        </div>

        {/* CARTE LOGIN avec effet 3D */}
        <div
          ref={cardRef}
          className={`login-card ${shake ? 'shake-card' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
          }}
        >
          {/* Logo animé */}
          <div className="login-logo">
            <div className="login-logo-icon">🛒</div>
            <h1>Mini Marketplace</h1>
            <p>Connectez-vous à votre compte</p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="login-error">
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="login-field">
              <label className={`login-label ${focusedField === 'username' ? 'focused' : ''}`}>
                👤 Nom d'utilisateur
                {typingUser && focusedField === 'username' && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#f97316', animation: 'typeIndicator 0.8s infinite' }}>✍️ Saisie...</span>
                )}
              </label>
              <div className="login-input-wrap">
                <input
                  className={`login-input ${formData.username ? 'has-value' : ''}`}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Votre nom d'utilisateur"
                  required
                />
                {formData.username && (
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#16a34a', fontSize: 16 }}>✓</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className={`login-label ${focusedField === 'password' ? 'focused' : ''}`}>
                🔑 Mot de passe
              </label>
              <div className="login-input-wrap">
                <input
                  className={`login-input ${formData.password ? 'has-value' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Votre mot de passe"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button type="button" className="login-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Barre de force du mot de passe */}
              {formData.password && (
                <div className="login-pass-strength">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="login-pass-bar" style={{ background: i <= passStrength ? strengthColors[passStrength] : '#e8e8e8' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <span className="login-loading-dot" />
                  <span className="login-loading-dot" />
                  <span className="login-loading-dot" />
                </span>
              ) : (
                `${btnHover ? '🚀' : '🔐'} Se connecter`
              )}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">● ● ●</span>
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
    </>
  );
}

export default Login;
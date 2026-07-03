import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Accueil from './pages/Accueil';
import DetailAnnonce from './pages/DetailAnnonce';
import MonCompte from './pages/MonCompte';
import NouvelleAnnonce from './pages/NouvelleAnnonce';
import Messages from './pages/Messages';
import ModifierAnnonce from './pages/ModifierAnnonce';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nbMessages, setNbMessages] = useState(0);
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const username = localStorage.getItem('username');
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Vérifie les messages toutes les 30 secondes
  useEffect(() => {
    if (!token) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages/recus/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setNbMessages(Array.isArray(data) ? data.length : 0);
      } catch (e) {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Remet à 0 quand on est sur la page messages
  useEffect(() => {
    if (location.pathname === '/messages') setNbMessages(0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const navStyle = `
    @keyframes pulse-badge {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: inline-block;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .nav-btn-dark {
      background: #1C1917;
      color: white;
      border: none;
      padding: 9px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .nav-btn-dark:hover {
      background: #292524;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .nav-btn-white {
      background: white;
      color: #F97316;
      border: none;
      padding: 9px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }
    .nav-btn-white:hover {
      background: #FFF7ED;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .nav-msg-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .nav-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #3B82F6;
      color: white;
      font-size: 10px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid #F97316;
      animation: pulse-badge 1.5s ease-in-out infinite;
      z-index: 10;
    }
    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 8px;
    }
    .burger span {
      display: block;
      width: 26px;
      height: 3px;
      background: white;
      border-radius: 3px;
      transition: all 0.3s;
    }
    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .mobile-menu { display: none; }
    .mobile-badge {
      background: #3B82F6;
      color: white;
      font-size: 10px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 99px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      margin-left: 8px;
      vertical-align: middle;
    }
    @media (max-width: 768px) {
      .burger { display: flex !important; }
      .nav-menu { display: none !important; }
      .mobile-menu {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px 20px;
        background: #EA580C;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        z-index: 999;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      }
      .mobile-menu.closed { display: none; }
      .mobile-link {
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: 600;
        padding: 12px 16px;
        border-radius: 8px;
        transition: background 0.2s;
        display: flex;
        align-items: center;
      }
      .mobile-link:hover { background: rgba(255,255,255,0.15); }
    }
  `;

  return (
    <>
      <style>{navStyle}</style>
      <nav style={{ backgroundColor: '#F97316', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 3px 12px rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

          {/* Logo */}
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛒 <span>Mini Marketplace</span>
          </Link>

          {/* Menu Desktop */}
          <div className="nav-menu">
            {token ? (
              <>
                <Link to="/" className="nav-link">Accueil</Link>
                {role === 'vendeur' && (
                  <Link to="/nouvelle-annonce" className="nav-link">📢 Publier</Link>
                )}
                <Link to="/mon-compte" className="nav-link">👤 {username}</Link>

                {/* Bouton Messages avec badge */}
                <div className="nav-msg-wrap">
                  <Link to="/messages" className="nav-link">
                    💬 Messages
                  </Link>
                  {nbMessages > 0 && (
                    <span className="nav-badge">
                      {nbMessages > 99 ? '99+' : nbMessages}
                    </span>
                  )}
                </div>

                <button onClick={handleLogout} className="nav-btn-dark">Déconnexion</button>
              </>
            ) : (
              <>
                {!isAuthPage && (
                  <Link to="/" className="nav-link">Accueil</Link>
                )}
                <Link to="/login" className="nav-link">Connexion</Link>
                <Link to="/register" className="nav-btn-white">S'inscrire</Link>
              </>
            )}
          </div>

          {/* Burger Mobile */}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none' }} />
          </button>
        </div>

        {/* Menu Mobile */}
        <div className={`mobile-menu ${menuOpen ? '' : 'closed'}`}>
          {token ? (
            <>
              <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>🏠 Accueil</Link>
              {role === 'vendeur' && (
                <Link to="/nouvelle-annonce" className="mobile-link" onClick={() => setMenuOpen(false)}>📢 Publier une annonce</Link>
              )}
              <Link to="/mon-compte" className="mobile-link" onClick={() => setMenuOpen(false)}>👤 {username}</Link>
              <Link to="/messages" className="mobile-link" onClick={() => setMenuOpen(false)}>
                💬 Messages
                {nbMessages > 0 && (
                  <span className="mobile-badge">{nbMessages > 99 ? '99+' : nbMessages}</span>
                )}
              </Link>
              <button onClick={handleLogout} className="nav-btn-dark" style={{ textAlign: 'left', borderRadius: '8px', width: '100%' }}>🚪 Déconnexion</button>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>🏠 Accueil</Link>
              )}
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>🔐 Connexion</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>📝 S'inscrire</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

function AppContent() {
  const token = localStorage.getItem('access_token');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Accueil /> : <Login />} />
        <Route path="/login" element={token ? <Accueil /> : <Login />} />
        <Route path="/register" element={token ? <Accueil /> : <Register />} />
        <Route path="/annonce/:id" element={<DetailAnnonce />} />
        <Route path="/mon-compte" element={<MonCompte />} />
        <Route path="/nouvelle-annonce" element={<NouvelleAnnonce />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/modifier-annonce/:id" element={<ModifierAnnonce />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
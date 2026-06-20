import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [reponses, setReponses] = useState({});
  const [showForm, setShowForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('recus');
  const [sent, setSent] = useState({});
  const navigate = useNavigate();

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages/recus/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReponse = async (msg) => {
    const token = localStorage.getItem('access_token');
    const contenu = reponses[msg.id];
    if (!contenu) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages/envoyer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ destinataire: msg.expediteur, annonce: msg.annonce, contenu })
      });
      if (response.ok) {
        setSent({ ...sent, [msg.id]: true });
        setReponses({ ...reponses, [msg.id]: '' });
        setShowForm({ ...showForm, [msg.id]: false });
        setTimeout(() => setSent(s => ({ ...s, [msg.id]: false })), 3000);
      }
    } catch (error) { console.error('Erreur:', error); }
  };

  const css = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes slideIn {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 300px; }
    }

    .msg-wrap {
      font-family: 'Open Sans','Segoe UI',sans-serif;
      background: #f2f2f2;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .msg-container { max-width: 860px; margin: 0 auto; }

    /* HEADER */
    .msg-header {
      background: linear-gradient(135deg, #f97316, #c2410c);
      border-radius: 4px;
      padding: 28px 32px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }
    .msg-header::before {
      content: '';
      position: absolute;
      top: -30px; right: -30px;
      width: 140px; height: 140px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
    }
    .msg-header-left { position: relative; z-index: 1; }
    .msg-header-title {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 4px;
    }
    .msg-header-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      margin: 0;
    }
    .msg-header-badge {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 20px;
      position: relative;
      z-index: 1;
    }

    /* TABS */
    .msg-tabs {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .msg-tab {
      flex: 1;
      padding: 14px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      color: #888;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }
    .msg-tab.active {
      color: #f97316;
      border-bottom-color: #f97316;
      background: #fff7ed;
    }
    .msg-tab:hover:not(.active) { background: #fafafa; color: #555; }

    /* CARD */
    .msg-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      border-left: 4px solid #f97316;
      margin-bottom: 12px;
      overflow: hidden;
      animation: fadeUp 0.4s ease both;
      transition: box-shadow 0.2s;
    }
    .msg-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .msg-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px 12px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .msg-sender {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .msg-avatar {
      width: 42px; height: 42px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      flex-shrink: 0;
    }
    .msg-sender-name {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 2px;
    }
    .msg-sender-role {
      font-size: 11px;
      color: #f97316;
      font-weight: 600;
      background: #fff7ed;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .msg-date {
      font-size: 12px;
      color: #bbb;
      white-space: nowrap;
    }

    /* BUBBLE */
    .msg-bubble {
      margin: 0 20px 16px;
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 0 12px 12px 12px;
      padding: 14px 16px;
      font-size: 14px;
      color: #1a1a1a;
      line-height: 1.7;
      position: relative;
    }
    .msg-bubble::before {
      content: '';
      position: absolute;
      top: 0; left: -10px;
      border: 5px solid transparent;
      border-right-color: #fed7aa;
    }

    /* ACTIONS */
    .msg-actions {
      padding: 0 20px 16px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .msg-btn-reply {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      background: #f97316;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .msg-btn-reply:hover { background: #ea580c; transform: translateY(-1px); }
    .msg-btn-view {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      background: #fff;
      color: #555;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .msg-btn-view:hover { border-color: #f97316; color: #f97316; }

    /* SUCCESS */
    .msg-success {
      margin: 0 20px 14px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #16a34a;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
    }

    /* FORM REPLY */
    .msg-reply-form {
      margin: 0 20px 16px;
      background: #fafafa;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 16px;
      animation: fadeUp 0.3s ease;
    }
    .msg-reply-label {
      font-size: 12px;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 8px;
      display: block;
    }
    .msg-reply-textarea {
      width: 100%;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
      background: #fff;
    }
    .msg-reply-textarea:focus { border-color: #f97316; }
    .msg-reply-btns {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .msg-reply-send {
      flex: 2;
      padding: 10px 0;
      background: #f97316;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .msg-reply-send:hover { background: #ea580c; }
    .msg-reply-cancel {
      flex: 1;
      padding: 10px 0;
      background: #fff;
      color: #888;
      border: 1.5px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .msg-reply-cancel:hover { border-color: #f97316; color: #f97316; }

    /* EMPTY */
    .msg-empty {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
    }

    /* SPINNER */
    .msg-spinner {
      width: 44px; height: 44px;
      border: 4px solid #fed7aa;
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 16px;
    }

    /* RESPONSIVE */
    @media (max-width: 600px) {
      .msg-wrap { padding: 12px 8px; }
      .msg-header { padding: 20px 16px; }
      .msg-header-title { font-size: 18px; }
      .msg-card-header { padding: 12px 14px 10px; }
      .msg-bubble { margin: 0 14px 12px; }
      .msg-actions { padding: 0 14px 12px; }
      .msg-reply-form { margin: 0 14px 12px; }
      .msg-btn-reply, .msg-btn-view { padding: 8px 14px; font-size: 12px; }
    }
  `;

  return (
    <div className="msg-wrap">
      <style>{css}</style>
      <div className="msg-container">

        {/* HEADER */}
        <div className="msg-header">
          <div className="msg-header-left">
            <h2 className="msg-header-title">💬 Messagerie</h2>
            <p className="msg-header-sub">Gérez vos conversations avec vos clients</p>
          </div>
          <div className="msg-header-badge">
            {messages.length} message{messages.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* TABS */}
        <div className="msg-tabs">
          <button className={`msg-tab ${onglet === 'recus' ? 'active' : ''}`} onClick={() => setOnglet('recus')}>
            📥 Messages reçus ({messages.length})
          </button>
          <button className={`msg-tab ${onglet === 'envoyes' ? 'active' : ''}`} onClick={() => setOnglet('envoyes')}>
            📤 Messages envoyés
          </button>
        </div>

        {/* CONTENU */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8' }}>
            <div className="msg-spinner" />
            <p style={{ color: '#aaa', fontSize: 14 }}>Chargement des messages...</p>
          </div>
        ) : onglet === 'recus' ? (
          messages.length === 0 ? (
            <div className="msg-empty">
              <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                Aucun message reçu
              </h3>
              <p style={{ color: '#aaa', fontSize: 14, margin: 0 }}>
                Vos messages apparaîtront ici quand des acheteurs vous contacteront.
              </p>
            </div>
          ) : (
            <div>
              {messages.map((msg, idx) => (
                <div key={msg.id} className="msg-card" style={{ animationDelay: `${idx * 0.06}s` }}>

                  {/* Header */}
                  <div className="msg-card-header">
                    <div className="msg-sender">
                      <div className="msg-avatar">
                        {msg.expediteur_nom?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="msg-sender-name">{msg.expediteur_nom}</p>
                        <span className="msg-sender-role">Acheteur</span>
                      </div>
                    </div>
                    <span className="msg-date">
                      📅 {new Date(msg.date_envoi).toLocaleDateString('fr-SN')} à {new Date(msg.date_envoi).toLocaleTimeString('fr-SN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bulle message */}
                  <div className="msg-bubble">
                    {msg.contenu}
                  </div>

                  {/* Succès */}
                  {sent[msg.id] && (
                    <div className="msg-success">
                      ✅ Réponse envoyée avec succès !
                    </div>
                  )}

                  {/* Actions */}
                  {!showForm[msg.id] && (
                    <div className="msg-actions">
                      <button className="msg-btn-reply" onClick={() => setShowForm({ ...showForm, [msg.id]: true })}>
                        ↩️ Répondre
                      </button>
                      <button className="msg-btn-view" onClick={() => navigate(`/annonce/${msg.annonce}`)}>
                        🔍 Voir l'annonce
                      </button>
                    </div>
                  )}

                  {/* Formulaire réponse */}
                  {showForm[msg.id] && (
                    <div className="msg-reply-form">
                      <label className="msg-reply-label">✉️ Votre réponse à {msg.expediteur_nom}</label>
                      <textarea
                        className="msg-reply-textarea"
                        value={reponses[msg.id] || ''}
                        onChange={(e) => setReponses({ ...reponses, [msg.id]: e.target.value })}
                        placeholder="Bonjour, merci pour votre message..."
                        rows={4}
                      />
                      <div className="msg-reply-btns">
                        <button className="msg-reply-send" onClick={() => handleReponse(msg)}>
                          📤 Envoyer la réponse
                        </button>
                        <button className="msg-reply-cancel" onClick={() => setShowForm({ ...showForm, [msg.id]: false })}>
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="msg-empty">
            <div style={{ fontSize: 56, marginBottom: 16 }}>📤</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
              Messages envoyés
            </h3>
            <p style={{ color: '#aaa', fontSize: 14, margin: 0 }}>
              Connectez l'endpoint <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>/api/messages/envoyes/</code> pour afficher vos messages envoyés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
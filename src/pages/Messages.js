import React, { useState, useEffect } from 'react';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [reponses, setReponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour voir vos messages !');
      return;
    }
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destinataire: msg.expediteur,
          annonce: msg.annonce,
          contenu: contenu
        })
      });
      if (response.ok) {
        alert('Réponse envoyée !');
        setReponses({ ...reponses, [msg.id]: '' });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '40px' }}>⏳</div>
      <p>Chargement...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1C1917', marginBottom: '24px' }}>
        💬 Mes messages reçus
      </h2>

      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
          <p style={{ color: '#78716C' }}>Aucun message reçu pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #F97316' }}>
              
              {/* Header message */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#FFF7ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#F97316' }}>
                    {msg.expediteur_nom?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1C1917', margin: 0 }}>{msg.expediteur_nom}</p>
                    <p style={{ fontSize: '12px', color: '#78716C', margin: 0 }}>Acheteur</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#78716C' }}>
                  {new Date(msg.date_envoi).toLocaleDateString('fr-SN')}
                </span>
              </div>

              {/* Contenu message */}
              <div style={{ backgroundColor: '#FFF7ED', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ color: '#1C1917', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{msg.contenu}</p>
              </div>

              {/* Formulaire réponse */}
              <div>
                <textarea
                  value={reponses[msg.id] || ''}
                  onChange={(e) => setReponses({ ...reponses, [msg.id]: e.target.value })}
                  placeholder="Écrire une réponse..."
                  rows={3}
                  style={{ width: '100%', border: '1.5px solid #E7E5E4', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button
                  onClick={() => handleReponse(msg)}
                  style={{ padding: '10px 20px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  ↩️ Répondre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;
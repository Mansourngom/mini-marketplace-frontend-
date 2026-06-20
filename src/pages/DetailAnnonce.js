import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/annonces/${id}/`)
      .then(res => res.json())
      .then(data => { setAnnonce(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { alert('Connectez-vous pour contacter le vendeur !'); navigate('/login'); return; }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages/envoyer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ annonce: id, destinataire: annonce.vendeur, contenu: message })
      });
      if (response.ok) { setSent(true); setMessage(''); setShowForm(false); }
    } catch (err) { console.error(err); }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const t = img.trim();
    return t.startsWith('http') ? t : `http://127.0.0.1:8000${t}`;
  };

  const images = annonce
    ? [annonce.image, ...(annonce.images || [])].filter(Boolean).map(getImageUrl)
    : [];

  const fmt = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const css = `
    @keyframes spin { to { transform: rotate(360deg) } }

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
      border-radius: 4px;
      border: 1px solid #e8e8e8;
    }

    .tab-btn {
      flex: 1;
      padding: 14px 8px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .tab-btn.active {
      font-weight: 700;
      color: #f97316;
      border-bottom-color: #f97316;
    }
    .tab-btn:not(.active) { color: #666; }
    .tab-btn:hover { color: #f97316; }

    .btn-orange {
      background: #f97316;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .btn-orange:hover { background: #ea580c; transform: translateY(-1px); }

    .btn-outline {
      background: #fff;
      color: #f97316;
      border: 2px solid #f97316;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: #fff7ed; }

    .fav-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .fav-btn:hover { transform: scale(1.1); }

    .share-btn {
      background: #f5f5f5;
      border: 1px solid #e8e8e8;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .share-btn:hover { background: #e8e8e8; transform: scale(1.1); }

    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      align-items: center;
      padding: 4px 0;
    }

    .delivery-item {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      align-items: flex-start;
    }

    .spec-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
    }

    .detail-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    @media (max-width: 1100px) {
      .detail-grid {
        grid-template-columns: 320px 1fr !important;
      }
      .col3 { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; }
      .col3 > * { flex: 1; min-width: 260px; }
    }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr !important;
      }
      .col3 { flex-direction: column; }
      .col3 > * { min-width: unset; }
      .detail-info-grid { grid-template-columns: 1fr !important; }
      .breadcrumb-wrap { font-size: 11px !important; padding: 6px 12px !important; }
      .detail-main-pad { padding: 0 10px !important; }
    }

    @media (max-width: 480px) {
      .detail-info-grid { grid-template-columns: 1fr !important; }
    }
  `;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 48, height: 48, border: '4px solid #fed7aa', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <p style={{ color: '#aaa', fontSize: 14 }}>Chargement...</p>
    </div>
  );

  if (!annonce) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 56 }}>😕</div>
      <h2 style={{ marginTop: 16 }}>Annonce introuvable</h2>
      <Link to="/" style={{ color: '#f97316' }}>Retour à l'accueil</Link>
    </div>
  );

  return (
    <div className="detail-wrap">
      <style>{css}</style>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div className="breadcrumb-wrap" style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 16px', fontSize: 12, color: '#999' }}>
          <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Accueil</Link>
          {annonce.categorie_nom && (
            <> &gt; <span style={{ color: '#333' }}>{annonce.categorie_nom}</span></>
          )}
          {' > '}
          <span style={{ color: '#666' }}>{annonce.titre}</span>
        </div>
      </div>

      {/* CORPS PRINCIPAL */}
      <div className="detail-main-pad" style={{ maxWidth: 1200, margin: '12px auto', padding: '0 16px' }}>
        <div className="detail-grid">

          {/* COL 1 : GALERIE */}
          <div>
            <div className="card" style={{ padding: 12 }}>
              {/* Image principale */}
              <div style={{ position: 'relative', background: '#fafafa', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                {images.length > 0 ? (
                  <img
                    src={images[imgIdx]}
                    alt={annonce.titre}
                    onError={e => { e.target.style.display = 'none'; }}
                    style={{ width: '100%', height: 320, objectFit: 'contain', display: 'block' }}
                  />
                ) : (
                  <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#ddd' }}>🖼️</div>
                )}

                {/* Bouton favori */}
                <button
                  className="fav-btn"
                  onClick={() => setFavori(!favori)}
                  style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #e8e8e8', borderRadius: '50%', width: 36, height: 36, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.12)' }}
                >
                  {favori ? '❤️' : '🤍'}
                </button>

                {/* Flèches */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.9)', border: '1px solid #ddd', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                    <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.9)', border: '1px solid #ddd', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                      style={{ width: 56, height: 56, objectFit: 'contain', border: i === imgIdx ? '2px solid #f97316' : '1px solid #ddd', borderRadius: 3, cursor: 'pointer', background: '#fafafa', padding: 2 }}
                    />
                  ))}
                </div>
              )}

              {/* Partager */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: .5 }}>PARTAGER CE PRODUIT</span>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {['📘', '🐦', '💬'].map((icon, i) => (
                    <button key={i} className="share-btn">{icon}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COL 2 : INFOS PRODUIT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Carte titre + prix */}
            <div className="card" style={{ padding: '20px 24px' }}>
              {annonce.categorie_nom && (
                <span style={{ background: '#f97316', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 2, display: 'inline-block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>
                  {annonce.categorie_nom}
                </span>
              )}

              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', lineHeight: 1.4 }}>
                {annonce.titre}
              </h1>

              <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                Vendu par <span style={{ color: '#f97316', fontWeight: 600 }}>{annonce.vendeur_nom}</span>
              </div>

              {/* Bloc prix */}
              <div style={{ background: '#f9f9f9', border: '1px solid #e8e8e8', borderRadius: 4, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{fmt(annonce.prix)}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  📍 {annonce.localisation} &nbsp;·&nbsp; 📅 {new Date(annonce.date_publication).toLocaleDateString('fr-SN')}
                </div>
              </div>

              {/* Note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ color: '#f59e0b', fontSize: 15 }}>★★★★☆</span>
                <span style={{ fontSize: 13, color: '#f97316', cursor: 'pointer' }}>(Voir les avis)</span>
              </div>

              {sent && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 14 }}>
                  ✅ Message envoyé au vendeur avec succès !
                </div>
              )}

              {/* Bouton contacter */}
              <button
                className="btn-orange"
                onClick={() => setShowForm(!showForm)}
                style={{ width: '100%', padding: '13px 0', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                💬 {showForm ? 'Fermer le formulaire' : 'Contacter le vendeur'}
              </button>

              {/* Formulaire message */}
              {showForm && (
                <form onSubmit={handleContact} style={{ marginTop: 14, background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 4, padding: 16 }}>
                  <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14 }}>✉️ Envoyer un message</p>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required rows={4}
                    placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '9px 11px', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button type="submit" className="btn-orange" style={{ flex: 2, padding: '10px 0', fontSize: 14 }}>Envoyer</button>
                    <button type="button" className="btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px 0', fontSize: 14 }}>Annuler</button>
                  </div>
                </form>
              )}

              {/* Sauvegarder */}
              <button
                className="fav-btn"
                onClick={() => setFavori(!favori)}
                style={{ width: '100%', padding: '11px 0', fontSize: 14, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: `2px solid ${favori ? '#ef4444' : '#f97316'}`, borderRadius: 4, color: favori ? '#ef4444' : '#f97316', background: '#fff' }}
              >
                {favori ? '❤️ Sauvegardé' : '🤍 Sauvegarder'}
              </button>
            </div>

            {/* Onglets */}
            <div className="card">
              <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
                {[
                  { id: 'details', label: 'Détails' },
                  { id: 'fiche', label: 'Fiche technique' },
                  { id: 'avis', label: 'Avis clients' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setSection(id)}
                    className={`tab-btn ${section === id ? 'active' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ padding: '20px 24px' }}>
                {section === 'details' && (
                  <div>
                    <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, margin: '0 0 20px' }}>
                      {annonce.description || 'Aucune description fournie.'}
                    </p>
                    <div className="detail-info-grid">
                      {[
                        ['Catégorie', annonce.categorie_nom || '—'],
                        ['Localisation', annonce.localisation || '—'],
                        ['Date', new Date(annonce.date_publication).toLocaleDateString('fr-SN')],
                        ['État', annonce.etat || 'Bon état'],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 3, fontSize: 13 }}>
                          <span style={{ color: '#888' }}>{k}</span>
                          <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'fiche' && (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, textTransform: 'uppercase', letterSpacing: .5, color: '#333' }}>
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
                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section === 'avis' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px', background: '#fafafa', borderRadius: 4, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 40, fontWeight: 800, color: '#1a1a1a' }}>4.5</div>
                        <div style={{ color: '#f59e0b', fontSize: 16 }}>★★★★½</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>12 avis vérifiés</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map(n => (
                          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: '#666', width: 16 }}>{n}</span>
                            <span style={{ color: '#f59e0b', fontSize: 10 }}>★</span>
                            <div style={{ flex: 1, background: '#e8e8e8', borderRadius: 99, height: 6 }}>
                              <div style={{ width: n === 5 ? '70%' : n === 4 ? '20%' : '10%', background: '#f59e0b', height: '100%', borderRadius: 99 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>
                      Les avis seront affichés ici.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COL 3 : LIVRAISON & VENDEUR */}
          <div className="col3">

            {/* Livraison */}
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                LIVRAISON &amp; RETOURS
              </div>
              {[
                { icon: '🚀', titre: 'Livraison Express', desc: 'Livraison en 24–48h', prix: '1 000 FCFA', couleur: '#8b5cf6' },
                { icon: '🏪', titre: 'Point relais', desc: 'Retrait en point relais', prix: '250 FCFA', couleur: null },
                { icon: '🏠', titre: 'Livraison domicile', desc: 'Selon accord vendeur', prix: 'À négocier', couleur: null },
                { icon: '🤝', titre: 'Main propre', desc: 'Rencontre directe', prix: 'Gratuit', couleur: null },
              ].map(({ icon, titre, desc, prix, couleur }) => (
                <div key={titre} className="delivery-item">
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: couleur || '#1a1a1a' }}>{titre}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', flexShrink: 0 }}>{prix}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Choisir le lieu</div>
                <select style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, marginBottom: 8, color: '#333', background: '#fff' }}>
                  <option>Dakar</option><option>Thiès</option><option>Saint-Louis</option><option>Ziguinchor</option>
                </select>
                <select style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, color: '#333', background: '#fff' }}>
                  <option>Medina</option><option>Plateau</option><option>Sacré-Cœur</option><option>Almadies</option>
                </select>
              </div>
            </div>

            {/* Infos vendeur */}
            <div className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f0f0f0', textTransform: 'uppercase', letterSpacing: .4 }}>
                INFORMATIONS SUR LE VENDEUR
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                  {annonce.vendeur_nom?.[0]?.toUpperCase() || 'V'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{annonce.vendeur_nom}</div>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>✓ Vendeur vérifié</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {[
                  ['⭐', 'Note', '4.5 / 5'],
                  ['🚀', 'Vitesse', 'Excellente'],
                  ['✅', 'Qualité', 'Excellente'],
                  ['↩️', 'Annulations', 'Très faible'],
                ].map(([icon, label, val]) => (
                  <div key={label} className="stat-row">
                    <span style={{ color: '#888' }}>{icon} {label}</span>
                    <span style={{ fontWeight: 600, color: '#16a34a' }}>{val}</span>
                  </div>
                ))}
              </div>
              <button className="btn-outline" style={{ width: '100%', padding: '9px 0', fontSize: 13 }}>
                Suivre le vendeur
              </button>
            </div>

            {/* Politique retour */}
            <div className="card" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>↩️</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>Politique de retour</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3, lineHeight: 1.5 }}>
                    Retour possible sous 7 jours.&nbsp;
                    <span style={{ color: '#f97316', cursor: 'pointer' }}>Détails</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signaler */}
            <div style={{ textAlign: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#bbb', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                🚩 Signaler cette annonce
              </button>
            </div>
          </div>
        </div>

        {/* ANNONCES SIMILAIRES */}
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8', padding: '20px 24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
            Les clients ayant consulté cet article ont également regardé
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 0', color: '#bbb', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 36 }}>🔍</span>
            <p style={{ fontSize: 13, margin: 0 }}>
              Connectez l'endpoint <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>/api/annonces/?categorie=…</code> pour afficher les produits similaires.
            </p>
            <Link to="/" className="btn-orange" style={{ padding: '9px 20px', fontSize: 13, borderRadius: 4, textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>
              Voir toutes les annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAnnonce;
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

  /* ── SPINNER ──────────────────────────────────────────────────────────── */
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
      <Link to="/" style={{ color: '#f97316' }}>Retour à l&apos;accueil</Link>
    </div>
  );

  /* ── STYLES INLINE RÉUTILISABLES ─────────────────────────────────────── */
  const card = { background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8' };
  const btnOrange = {
    background: '#f97316', color: '#fff', border: 'none', borderRadius: 4,
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
  };
  const btnOrangeOutline = {
    background: '#fff', color: '#f97316', border: '2px solid #f97316',
    borderRadius: 4, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
  };

  return (
    <div style={{ fontFamily: "'Open Sans','Segoe UI',sans-serif", background: '#f2f2f2', minHeight: '100vh' }}>

      {/* ══ TOPBAR style Jumia ═══════════════════════════════════════════ */}
      <div style={{ background: '#f97316' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: -1 }}>Mini marché</span>
          </div>

          {/* Barre de recherche */}
          <div style={{ flex: 1, maxWidth: 560, margin: '0 24px', display: 'flex' }}>
            <input
              placeholder="Cherchez un produit, une marque ou une catégorie"
              style={{ flex: 1, border: 'none', padding: '9px 14px', fontSize: 13, outline: 'none', borderRadius: '4px 0 0 4px' }}
            />
            <button style={{ ...btnOrange, padding: '9px 20px', borderRadius: '0 4px 4px 0', fontSize: 13 }}>
              Rechercher
            </button>
          </div>

          {/* Actions nav */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['Se connecter', 'Aide', 'Panier'].map(l => (
              <a key={l} href="#" style={{ color: '#fff', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BREADCRUMB ═══════════════════════════════════════════════════ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 16px', fontSize: 12, color: '#999' }}>
          <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Accueil</Link>
          {annonce.categorie_nom && (
            <> &gt; <span style={{ color: '#333' }}>{annonce.categorie_nom}</span></>
          )}
          {' > '}
          <span style={{ color: '#666' }}>{annonce.titre}</span>
        </div>
      </div>

      {/* ══ CORPS PRINCIPAL ══════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1200, margin: '12px auto', padding: '0 16px' }}>

        {/* Layout 3 colonnes comme Jumia */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr 280px', gap: 12, alignItems: 'start' }}>

          {/* ── COL 1 : GALERIE ─────────────────────────────────────── */}
          <div>
            <div style={{ ...card, padding: 12 }}>
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

                {/* Bouton favori style Jumia */}
                <button
                  onClick={() => setFavori(!favori)}
                  title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #e8e8e8', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.12)' }}
                >
                  {favori ? '❤️' : '🤍'}
                </button>

                {/* Flèches si plusieurs images */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.9)', border: '1px solid #ddd', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ‹
                    </button>
                    <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.9)', border: '1px solid #ddd', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <img
                      key={i} src={img} alt=""
                      onClick={() => setImgIdx(i)}
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
                    <button key={i} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── COL 2 : INFOS PRODUIT ───────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Carte titre + prix */}
            <div style={{ ...card, padding: '20px 24px' }}>
              {/* Badge catégorie style "Mega Vente Flash" */}
              {annonce.categorie_nom && (
                <span style={{ background: '#f97316', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 2, display: 'inline-block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>
                  {annonce.categorie_nom}
                </span>
              )}

              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', lineHeight: 1.4 }}>
                {annonce.titre}
              </h1>

              {/* Vendeur en petit */}
              <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                Vendu par&nbsp;
                <span style={{ color: '#f97316', fontWeight: 600, cursor: 'pointer' }}>{annonce.vendeur_nom}</span>
              </div>

              {/* Bloc prix style Jumia */}
              <div style={{ background: '#f9f9f9', border: '1px solid #e8e8e8', borderRadius: 4, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>
                  {fmt(annonce.prix)}
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  📍 {annonce.localisation} &nbsp;·&nbsp; 📅 {new Date(annonce.date_publication).toLocaleDateString('fr-SN')}
                </div>
              </div>

              {/* Note vendeur fictive */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ color: '#f59e0b', fontSize: 15 }}>★★★★☆</span>
                <span style={{ fontSize: 13, color: '#f97316', cursor: 'pointer' }}>(Voir les avis)</span>
              </div>

              {/* Succès envoi message */}
              {sent && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 14 }}>
                  ✅ Message envoyé au vendeur avec succès !
                </div>
              )}

              {/* Bouton contacter */}
              <button
                onClick={() => setShowForm(!showForm)}
                style={{ ...btnOrange, width: '100%', padding: '13px 0', fontSize: 15, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
                onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
              >
                💬 {showForm ? 'Fermer le formulaire' : 'Contacter le vendeur'}
              </button>

              {/* Formulaire message inline */}
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
                    <button type="submit" style={{ ...btnOrange, flex: 2, padding: '10px 0', fontSize: 14 }}>Envoyer</button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ ...btnOrangeOutline, flex: 1, padding: '10px 0', fontSize: 14 }}>Annuler</button>
                  </div>
                </form>
              )}

              {/* Sauvegarder */}
              <button
                onClick={() => setFavori(!favori)}
                style={{ ...btnOrangeOutline, width: '100%', padding: '11px 0', fontSize: 14, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderColor: favori ? '#ef4444' : '#f97316', color: favori ? '#ef4444' : '#f97316' }}
              >
                {favori ? '❤️ Sauvegardé' : '🤍 Sauvegarder'}
              </button>
            </div>

            {/* ── Onglets Détails / Fiche / Avis style Jumia ─────────── */}
            <div style={card}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
                {[
                  { id: 'details', label: 'Détails' },
                  { id: 'fiche',   label: 'Fiche technique' },
                  { id: 'avis',    label: 'Avis clients' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setSection(id)} style={{
                    flex: 1, padding: '14px 8px', border: 'none', background: 'none', cursor: 'pointer',
                    fontWeight: section === id ? 700 : 400, fontSize: 13,
                    color: section === id ? '#f97316' : '#666',
                    borderBottom: section === id ? '3px solid #f97316' : '3px solid transparent',
                    marginBottom: -2, fontFamily: 'inherit'
                  }}>{label}</button>
                ))}
              </div>

              <div style={{ padding: '20px 24px' }}>
                {section === 'details' && (
                  <div>
                    <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, margin: '0 0 20px' }}>
                      {annonce.description || 'Aucune description fournie.'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {[
                        ['Catégorie', annonce.categorie_nom || '—'],
                        ['Vendeur', annonce.vendeur_nom || '—'],
                        ['Localisation', annonce.localisation || '—'],
                        ['Date de publication', new Date(annonce.date_publication).toLocaleDateString('fr-SN')],
                        ['État', annonce.etat || 'Occasion / Bon état'],
                      ].map(([k, v], i) => (
                        <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <span style={{ width: 200, color: '#666', flexShrink: 0 }}>• {k}</span>
                          <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
                        </div>
                      ))}
                    </div>
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
                      Les avis seront affichés ici.<br />Connectez l&apos;API pour les charger.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── COL 3 : LIVRAISON & VENDEUR (droite, style Jumia) ───── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Livraison */}
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                LIVRAISON &amp; RETOURS
              </div>

              {[
                { icon: '🚀', titre: 'Livraison Express', desc: 'Livraison en 24–48h', prix: '1 000 FCFA', couleur: '#8b5cf6' },
                { icon: '🏪', titre: 'Point relais',      desc: 'Retrait en point relais', prix: '250 FCFA', couleur: null },
                { icon: '🏠', titre: 'Livraison domicile',desc: 'Selon accord vendeur', prix: 'À négocier', couleur: null },
                { icon: '🤝', titre: 'Main propre',       desc: 'Rencontre directe', prix: 'Gratuit', couleur: null },
              ].map(({ icon, titre, desc, prix, couleur }) => (
                <div key={titre} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: couleur || '#1a1a1a' }}>{titre}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', flexShrink: 0 }}>{prix}</div>
                </div>
              ))}

              {/* Choisir lieu */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14, marginTop: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Choisir le lieu</div>
                <select style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, marginBottom: 8, color: '#333', background: '#fff' }}>
                  <option>Dakar</option>
                  <option>Thiès</option>
                  <option>Saint-Louis</option>
                  <option>Ziguinchor</option>
                </select>
                <select style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, color: '#333', background: '#fff' }}>
                  <option>Medina</option>
                  <option>Plateau</option>
                  <option>Sacré-Cœur</option>
                  <option>Almadies</option>
                </select>
              </div>
            </div>

            {/* Infos vendeur (colonne droite) */}
            <div style={{ ...card, padding: '16px 18px' }}>
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

              {/* Stats vendeur */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {[
                  ['⭐', 'Note', '4.5 / 5'],
                  ['🚀', 'Vitesse', 'Excellente'],
                  ['✅', 'Qualité', 'Excellente'],
                  ['↩️', 'Annulations', 'Très faible'],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>{icon} {label}</span>
                    <span style={{ fontWeight: 600, color: '#16a34a' }}>{val}</span>
                  </div>
                ))}
              </div>

              <button style={{ ...btnOrangeOutline, width: '100%', padding: '9px 0', fontSize: 13 }}>
                Suivre le vendeur
              </button>
            </div>

            {/* Politique retour */}
            <div style={{ ...card, padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>↩️</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>Politique de retour</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3, lineHeight: 1.5 }}>
                    Retour possible sous 7 jours selon accord avec le vendeur.&nbsp;
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

        {/* ══ ANNONCES SIMILAIRES ══════════════════════════════════════════ */}
        <div style={{ marginTop: 20, ...card, padding: '20px 24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
            Les clients ayant consulté cet article ont également regardé
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 0', color: '#bbb', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 36 }}>🔍</span>
            <p style={{ fontSize: 13, margin: 0 }}>
              Connectez l&apos;endpoint <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>/api/annonces/?categorie=…</code> pour afficher les produits similaires.
            </p>
            <Link to="/" style={{ ...btnOrange, padding: '9px 20px', fontSize: 13, borderRadius: 4, textDecoration: 'none', marginTop: 6 }}>
              Voir toutes les annonces
            </Link>
          </div>
        </div>
      </div>

      {/* ══ FOOTER style Jumia ═══════════════════════════════════════════ */}
      <footer style={{ background: '#1a1a1a', marginTop: 24 }}>
        {/* Bande newsletter */}
        <div style={{ background: '#252525', padding: '28px 16px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>NOUVEAU SUR MINI MARCHÉ ?</div>
              <div style={{ color: '#aaa', fontSize: 13 }}>Abonnez-vous pour recevoir les meilleures offres.</div>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              <input placeholder="Entrez votre adresse e-mail" style={{ padding: '10px 14px', border: 'none', fontSize: 13, width: 260, borderRadius: '4px 0 0 4px', outline: 'none' }} />
              <button style={{ ...btnOrange, padding: '10px 18px', borderRadius: '0 4px 4px 0', fontSize: 13 }}>S&apos;abonner</button>
            </div>
          </div>
        </div>

        {/* Liens footer */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {[
            { titre: 'BESOIN D\'AIDE ?', liens: ['Discuter avec nous', "Centre d'assistance", 'Contactez-nous'] },
            { titre: 'À PROPOS',         liens: ['Qui sommes-nous', "Conditions d'utilisation", 'Confidentialité'] },
            { titre: 'VENDRE',           liens: ['Vendre sur Mini Marché', 'FAQ vendeurs', 'Devenir partenaire'] },
            { titre: 'LIENS UTILES',     liens: ['Comment commander ?', 'Suivre ma commande', 'Politique de retour'] },
          ].map(({ titre, liens }) => (
            <div key={titre}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: .5 }}>{titre}</div>
              {liens.map(l => <div key={l} style={{ color: '#999', fontSize: 12, marginBottom: 8, cursor: 'pointer' }}>{l}</div>)}
            </div>
          ))}
        </div>

        {/* Barre basse */}
        <div style={{ borderTop: '1px solid #333', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 6 }}>
            Nom de l&apos;entreprise : Mini Marché Sénégal &nbsp;|&nbsp; Adresse : Dakar, Sénégal
          </div>
          <div style={{ color: '#666', fontSize: 11 }}>
            Retrouvez-nous sur : 
            {' '}
            {['Facebook', 'Instagram', 'WhatsApp', 'TikTok'].map((s, i) => (
              <span key={s}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>{s}</a>{i < 3 ? ' · ' : ''}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DetailAnnonce;
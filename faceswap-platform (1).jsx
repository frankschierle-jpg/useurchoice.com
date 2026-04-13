import { useState, useEffect } from "react";

var SPORTS = [
  { id: "surf", label: "Surfen", emoji: "🏄", color: "#0891b2" },
  { id: "climb", label: "Klettern", emoji: "🧗", color: "#ea580c" },
  { id: "ski", label: "Skifahren", emoji: "⛷️", color: "#7c3aed" },
  { id: "bike", label: "Mountainbiken", emoji: "🚵", color: "#16a34a" },
  { id: "dive", label: "Tauchen", emoji: "🤿", color: "#0284c7" },
  { id: "skate", label: "Skateboarden", emoji: "🛹", color: "#db2777" },
  { id: "box", label: "Boxen", emoji: "🥊", color: "#dc2626" },
  { id: "yoga", label: "Yoga", emoji: "🧘", color: "#d97706" },
];

var VIDEO_DB = [
  { id: "v1", sport: "surf", title: "Barrel Ride Bali", desc: "Perfekte Tube bei Sonnenuntergang", duration: 32, quality: "4K", img: "https://images.unsplash.com/photo-1502680390548-bdbac40f7154?w=400&q=80", tokens: 8 },
  { id: "v2", sport: "surf", title: "Big Wave Nazare", desc: "Riesenwelle, extremes Surfen", duration: 58, quality: "4K", img: "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400&q=80", tokens: 12 },
  { id: "v3", sport: "surf", title: "Sunset Longboard Hawaii", desc: "Entspanntes Longboarden", duration: 45, quality: "HD", img: "https://images.unsplash.com/photo-1455729552457-5c322b382999?w=400&q=80", tokens: 6 },
  { id: "v4", sport: "climb", title: "El Capitan Free Solo", desc: "Vertikale Felswand, Yosemite", duration: 130, quality: "4K", img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80", tokens: 18 },
  { id: "v5", sport: "climb", title: "Bouldern Fontainebleau", desc: "Technisches Bouldern im Wald", duration: 48, quality: "HD", img: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&q=80", tokens: 7 },
  { id: "v6", sport: "ski", title: "Powder Run Chamonix", desc: "Tiefschnee Mont Blanc Massiv", duration: 80, quality: "4K", img: "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&q=80", tokens: 12 },
  { id: "v7", sport: "ski", title: "Slalom Kitzbuehel", desc: "Rennstrecke, Geschwindigkeit", duration: 55, quality: "HD", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&q=80", tokens: 8 },
  { id: "v8", sport: "bike", title: "Downhill Whistler", desc: "Schneller Trail mit Spruengen", duration: 105, quality: "4K", img: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&q=80", tokens: 15 },
  { id: "v9", sport: "dive", title: "Korallenriff Malediven", desc: "Farbenpraechtige Unterwasserwelt", duration: 150, quality: "4K", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", tokens: 20 },
  { id: "v10", sport: "skate", title: "Venice Beach Halfpipe", desc: "Skatepark bei Sonnenschein", duration: 40, quality: "HD", img: "https://images.unsplash.com/photo-1564296786786-a4dd73e51086?w=400&q=80", tokens: 6 },
  { id: "v11", sport: "box", title: "Heavy Bag Training", desc: "Intensives Boxtraining im Gym", duration: 70, quality: "HD", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80", tokens: 10 },
  { id: "v12", sport: "yoga", title: "Sunrise Flow Bali", desc: "Yoga bei Sonnenaufgang", duration: 180, quality: "4K", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80", tokens: 22 },
  { id: "v13", sport: "box", title: "Ring Sparring Berlin", desc: "Boxer im Ring, dramatisch", duration: 90, quality: "4K", img: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=400&q=80", tokens: 13 },
  { id: "v14", sport: "climb", title: "Alpenklettern Dolomiten", desc: "Hochalpine Route", duration: 95, quality: "4K", img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80", tokens: 14 },
];

var MOCK_MODELS = [
  { id: 1, name: "Alex M.", avatar: "🧑", sports: ["surf", "climb", "ski"], verified: true },
  { id: 2, name: "Sarah K.", avatar: "👩", sports: ["yoga", "surf", "dive"], verified: true },
  { id: 3, name: "Tom B.", avatar: "👨", sports: ["box", "bike", "skate"], verified: true },
  { id: 4, name: "Lena W.", avatar: "👩‍🦰", sports: ["ski", "climb", "yoga"], verified: true },
];

var PLANS = [
  { id: "basic", name: "Basic", price: "9,99", tokens: 50, color: "#6b7280" },
  { id: "pro", name: "Pro", price: "19,99", tokens: 120, popular: true, color: "#22d3ee" },
  { id: "ultra", name: "Ultra", price: "39,99", tokens: 300, color: "#a78bfa" },
];

var MOCK_EARNINGS = [
  { id: "t1", date: "13.04.2026", viewer: "Viewer #4821", sport: "surf", video: "Barrel Ride Bali", paid: 8, earned: 7.2 },
  { id: "t2", date: "12.04.2026", viewer: "Viewer #1093", sport: "ski", video: "Powder Run Chamonix", paid: 12, earned: 10.8 },
  { id: "t3", date: "12.04.2026", viewer: "Viewer #7720", sport: "surf", video: "Sunset Longboard", paid: 6, earned: 5.4 },
  { id: "t4", date: "11.04.2026", viewer: "Viewer #3351", sport: "climb", video: "El Capitan", paid: 18, earned: 16.2 },
  { id: "t5", date: "10.04.2026", viewer: "Viewer #9982", sport: "surf", video: "Big Wave Nazare", paid: 12, earned: 10.8 },
];

function formatTime(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

function findVideos(text, allowedSports) {
  var t = text.toLowerCase();
  var matched = [];
  SPORTS.forEach(function (s) {
    if (allowedSports.indexOf(s.id) === -1) return;
    if (t.indexOf(s.label.toLowerCase()) !== -1 || t.indexOf(s.id) !== -1) {
      VIDEO_DB.forEach(function (v) { if (v.sport === s.id) matched.push(v); });
    }
  });
  if (matched.length === 0) {
    VIDEO_DB.forEach(function (v) { if (allowedSports.indexOf(v.sport) !== -1) matched.push(v); });
  }
  var seen = {};
  var unique = [];
  matched.forEach(function (v) { if (!seen[v.id]) { seen[v.id] = true; unique.push(v); } });
  for (var i = unique.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = unique[i]; unique[i] = unique[j]; unique[j] = tmp;
  }
  return unique.slice(0, 3);
}

var animCSS = "@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}} .card-hover{transition:all .25s ease} .card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.4)} input::placeholder,textarea::placeholder{color:#2e3240}";
var mono = { fontFamily: "'IBM Plex Mono', monospace" };
var basePage = { minHeight: "100vh", background: "#060810", color: "#e8e8ec", fontFamily: "'Syne', sans-serif" };
var fontLink = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
var brd = "1px solid rgba(255,255,255,0.07)";
var surf = "#0c1018";

function NavBar({ user, onLogout, tokens, modelTokens }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(6,8,16,0.88)", backdropFilter: "blur(16px)", borderBottom: brd, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
      <span style={{ fontWeight: 800, fontSize: 15 }}><span style={{ color: "#22d3ee" }}>FACE</span><span style={{ color: "#a78bfa" }}>SWAP</span></span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {tokens !== undefined && (
          <div style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(167,139,250,0.12))", border: "1px solid rgba(34,211,238,0.2)", padding: "4px 12px", borderRadius: 20, ...mono, fontSize: 11, color: "#22d3ee", fontWeight: 600 }}>🪙 {tokens} Tokens</div>
        )}
        {modelTokens !== undefined && (
          <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.12))", border: "1px solid rgba(34,197,94,0.2)", padding: "4px 12px", borderRadius: 20, ...mono, fontSize: 11, color: "#22c55e", fontWeight: 600 }}>💰 {modelTokens.toFixed(1)} Tokens</div>
        )}
        <span style={{ ...mono, fontSize: 10, color: "#5a5e6b" }}>{user.email}</span>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.04)", border: brd, color: "#666", padding: "4px 10px", borderRadius: 8, cursor: "pointer", ...mono, fontSize: 10 }}>Logout</button>
      </div>
    </div>
  );
}

/* ═══════ LOGIN ═══════ */
function LoginScreen({ onLogin }) {
  const [reg, setReg] = useState(false);
  const [role, setRole] = useState("viewer");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  var ok = email.length > 0 && pw.length > 0;
  var inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: brd, background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif", outline: "none" };

  return (
    <div style={basePage}>
      <link href={fontLink} rel="stylesheet" />
      <style>{animCSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp .5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>◐</div>
            <h1 style={{ fontSize: 30, fontWeight: 800 }}><span style={{ color: "#22d3ee" }}>FACE</span><span style={{ color: "#a78bfa" }}>SWAP</span></h1>
            <p style={{ color: "#5a5e6b", ...mono, fontSize: 11, marginTop: 6 }}>Sport Face-Swap Platform</p>
          </div>
          <div style={{ background: surf, border: brd, borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: 3 }}>
              <button onClick={function () { setReg(false); }} style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", background: !reg ? "rgba(255,255,255,0.08)" : "transparent", color: !reg ? "#fff" : "#5a5e6b", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>Login</button>
              <button onClick={function () { setReg(true); }} style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", background: reg ? "rgba(255,255,255,0.08)" : "transparent", color: reg ? "#fff" : "#5a5e6b", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>Registrieren</button>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 1, marginBottom: 7 }}>ROLLE</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={function () { setRole("model"); }} style={{ flex: 1, padding: 11, borderRadius: 9, cursor: "pointer", background: role === "model" ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)", border: role === "model" ? "1px solid #a78bfa" : brd, color: role === "model" ? "#fff" : "#5a5e6b", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>📸 Model</button>
                <button onClick={function () { setRole("viewer"); }} style={{ flex: 1, padding: 11, borderRadius: 9, cursor: "pointer", background: role === "viewer" ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.02)", border: role === "viewer" ? "1px solid #22d3ee" : brd, color: role === "viewer" ? "#fff" : "#5a5e6b", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>🎬 Viewer</button>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 1, marginBottom: 5 }}>E-MAIL</div>
              <input value={email} onChange={function (e) { setEmail(e.target.value); }} placeholder="name@beispiel.de" style={inp} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 1, marginBottom: 5 }}>PASSWORT</div>
              <input type="password" value={pw} onChange={function (e) { setPw(e.target.value); }} placeholder="********" style={inp} />
            </div>
            <button onClick={function () { if (ok) onLogin({ email: email, role: role }); }} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", cursor: ok ? "pointer" : "not-allowed", background: ok ? "linear-gradient(135deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.04)", color: ok ? "#000" : "#444", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif" }}>
              {reg ? "Konto erstellen" : "Einloggen"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ MODEL DASHBOARD ═══════ */
function ModelDash({ user, onLogout }) {
  const [tab, setTab] = useState("profile");
  const [modelName, setModelName] = useState("");
  const [photos, setPhotos] = useState([null, null, null, null, null]);
  const [consent, setConsent] = useState(false);
  const [sports, setSports] = useState([]);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [earnedTokens] = useState(50.4);
  const [totalEarned] = useState(171.0);
  const [totalPaidOut] = useState(120.6);
  const [showPayout, setShowPayout] = useState(false);

  var uploadedCount = photos.filter(Boolean).length;
  var canSubmit = uploadedCount === 5 && consent && sports.length > 0 && verified && modelName.trim().length > 0;

  function toggleSport(id) {
    setSports(function (p) { return p.indexOf(id) !== -1 ? p.filter(function (x) { return x !== id; }) : p.concat([id]); });
  }
  function simulateUpload(i) {
    var urls = ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"];
    setPhotos(function (p) { var c = p.slice(); c[i] = urls[i]; return c; });
  }
  function startVerify() {
    setVerifying(true);
    setTimeout(function () { setVerifying(false); setVerified(true); }, 3000);
  }

  var tabs = [
    { id: "profile", label: "Profil", icon: "👤" },
    { id: "earnings", label: "Einnahmen", icon: "💰" }
  ];

  return (
    <div style={basePage}>
      <link href={fontLink} rel="stylesheet" />
      <style>{animCSS}</style>
      <NavBar user={user} onLogout={onLogout} modelTokens={earnedTokens} />
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3, maxWidth: 280 }}>
          {tabs.map(function (t) {
            return <button key={t.id} onClick={function () { setTab(t.id); }} style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent", color: tab === t.id ? "#fff" : "#5a5e6b", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{t.icon} {t.label}</button>;
          })}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 3, color: "#a78bfa", marginBottom: 4 }}>MODEL PROFIL</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              {profileSaved ? "Einstellungen bearbeiten" : "Profil einrichten"}
            </h2>
            <p style={{ color: "#5a5e6b", fontSize: 13, marginBottom: 28 }}>
              {profileSaved ? "Du kannst alle Einstellungen jederzeit aendern." : "Name, Verifizierung, Fotos, Sportarten, Einwilligung"}
            </p>

            {/* Model Name */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 8 }}>① MODEL-NAME</div>
              <p style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Dieser Name wird Viewern angezeigt, wenn sie dein Gesicht auswaehlen.</p>
              <input value={modelName} onChange={function (e) { setModelName(e.target.value); }} placeholder="z.B. Alex M., SurfQueen, SportyMax..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: brd, background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif", outline: "none" }} />
            </div>

            {/* Verification */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 8 }}>② IDENTITAETS-VERIFIZIERUNG</div>
              <div style={{ background: surf, border: brd, borderRadius: 12, padding: 16 }}>
                {verified ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✅</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>Verifiziert</div>
                      <div style={{ ...mono, fontSize: 10, color: "#5a5e6b" }}>Live-Selfie + KI-Abgleich bestanden</div>
                    </div>
                  </div>
                ) : verifying ? (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#22d3ee", animation: "spin 1s linear infinite", margin: "0 auto 12px" }}></div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Kamera aktiv...</div>
                    <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 4 }}>KI vergleicht Live-Selfie mit Fotos</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                      <div style={{ fontSize: 24, flexShrink: 0 }}>📸</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Warum Verifizierung?</div>
                        <div style={{ fontSize: 11, color: "#777", lineHeight: 1.7 }}>
                          Wir muessen sicherstellen, dass du wirklich die Person auf den Fotos bist. Dazu machst du ein Live-Selfie mit einer zufaelligen Geste. Unsere KI vergleicht es mit deinen hochgeladenen Fotos.
                        </div>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 12, marginBottom: 14 }}>
                      <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginBottom: 6 }}>SO FUNKTIONIERTS</div>
                      <div style={{ fontSize: 11, color: "#999", lineHeight: 1.8 }}>
                        1. Kamera wird aktiviert<br/>
                        2. Du erhaeltst eine zufaellige Anweisung (z.B. "Halte 3 Finger hoch")<br/>
                        3. KI prueft: Stimmt das Gesicht mit deinen Fotos ueberein?<br/>
                        4. Bei Erfolg: Verifizierung abgeschlossen
                      </div>
                    </div>
                    <button onClick={startVerify} disabled={uploadedCount < 1} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", cursor: uploadedCount >= 1 ? "pointer" : "not-allowed", background: uploadedCount >= 1 ? "linear-gradient(135deg,#22d3ee,#06b6d4)" : "rgba(255,255,255,0.03)", color: uploadedCount >= 1 ? "#000" : "#444", fontWeight: 700, fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
                      {uploadedCount >= 1 ? "📷 Live-Selfie starten" : "Erst mindestens 1 Foto hochladen"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Photos */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 8 }}>③ GESICHTSFOTOS ({uploadedCount}/5)</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {photos.map(function (p, i) {
                  return (
                    <div key={i} onClick={function () { if (!p) simulateUpload(i); }} style={{ width: 84, height: 84, borderRadius: 10, cursor: p ? "default" : "pointer", border: p ? "2px solid #22c55e" : "2px dashed rgba(255,255,255,0.08)", background: p ? "url(" + p + ") center/cover" : "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {!p && <span style={{ fontSize: 20, opacity: 0.2 }}>+</span>}
                      {p && <div style={{ position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "#fff" }}>✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sports */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 8 }}>④ SPORTARTEN FREIGEBEN</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6 }}>
                {SPORTS.map(function (s) {
                  var ch = sports.indexOf(s.id) !== -1;
                  return (
                    <div key={s.id} onClick={function () { toggleSport(s.id); }} style={{ padding: "9px 11px", borderRadius: 9, cursor: "pointer", background: ch ? s.color + "12" : "rgba(255,255,255,0.02)", border: ch ? "1px solid " + s.color : brd, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: ch ? "none" : "2px solid #2a2a3a", background: ch ? s.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{ch ? "✓" : ""}</div>
                      <span style={{ fontSize: 12 }}>{s.emoji} {s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consent */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 8 }}>⑤ EINWILLIGUNG</div>
              <div style={{ background: surf, border: brd, borderRadius: 11, padding: 14 }}>
                <p style={{ fontSize: 11, color: "#777", lineHeight: 1.8, marginBottom: 12 }}>Ich erklaere mich einverstanden, dass mein Gesicht mittels KI (Face-Swap) auf Koerper in den gewaehlten Sport-Szenarien montiert wird. Ich erhalte 90% der Token-Einnahmen pro Freischaltung. Einwilligung jederzeit widerrufbar.</p>
                <div onClick={function () { setConsent(!consent); }} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: consent ? "none" : "2px solid #3a3a4a", background: consent ? "#22d3ee" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", fontWeight: 700 }}>{consent ? "✓" : ""}</div>
                  <span style={{ fontSize: 12, color: consent ? "#fff" : "#777" }}>Ich stimme zu (inkl. 90% Revenue Share)</span>
                </div>
              </div>
            </div>

            <button onClick={function () { if (canSubmit) setProfileSaved(true); }} style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", cursor: canSubmit ? "pointer" : "not-allowed", background: canSubmit ? "linear-gradient(135deg,#a78bfa,#c084fc)" : "rgba(255,255,255,0.03)", color: canSubmit ? "#000" : "#444", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif" }}>
              {profileSaved ? "Aenderungen speichern" : "Profil einreichen"} →
            </button>
            {profileSaved && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, ...mono, fontSize: 11, color: "#22c55e", textAlign: "center" }}>
                ✓ Profil ist aktiv — Aenderungen werden sofort wirksam
              </div>
            )}
          </div>
        )}

        {/* ── EARNINGS TAB ── */}
        {tab === "earnings" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 3, color: "#22c55e", marginBottom: 4 }}>EINNAHMEN</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Deine Verguetung</h2>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
              <div style={{ background: surf, border: brd, borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ ...mono, fontSize: 9, color: "#5a5e6b", letterSpacing: 1, marginBottom: 6 }}>VERFUEGBAR</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#22c55e" }}>🪙 {earnedTokens.toFixed(1)}</div>
                <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 4 }}>{(earnedTokens * 0.10).toFixed(2)} EUR</div>
              </div>
              <div style={{ background: surf, border: brd, borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ ...mono, fontSize: 9, color: "#5a5e6b", letterSpacing: 1, marginBottom: 6 }}>GESAMT VERDIENT</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#a78bfa" }}>🪙 {totalEarned.toFixed(1)}</div>
                <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 4 }}>{(totalEarned * 0.10).toFixed(2)} EUR</div>
              </div>
              <div style={{ background: surf, border: brd, borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ ...mono, fontSize: 9, color: "#5a5e6b", letterSpacing: 1, marginBottom: 6 }}>AUSGEZAHLT</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#5a5e6b" }}>🪙 {totalPaidOut.toFixed(1)}</div>
                <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 4 }}>{(totalPaidOut * 0.10).toFixed(2)} EUR</div>
              </div>
            </div>

            {/* Revenue model info */}
            <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 10, padding: 14, marginBottom: 24 }}>
              <div style={{ ...mono, fontSize: 10, color: "#a78bfa", marginBottom: 6 }}>REVENUE MODELL</div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.7 }}>
                Du erhaeltst <span style={{ color: "#22c55e", fontWeight: 700 }}>90%</span> der Tokens, die Viewer fuer Videos mit deinem Gesicht zahlen. 1 Token = <span style={{ color: "#22d3ee", fontWeight: 700 }}>0,10 EUR</span>. Auszahlung ab 100 Tokens moeglich.
              </div>
            </div>

            {/* Payout */}
            <button onClick={function () { setShowPayout(!showPayout); }} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: earnedTokens >= 100 ? "linear-gradient(135deg,#22c55e,#10b981)" : "rgba(255,255,255,0.04)", color: earnedTokens >= 100 ? "#000" : "#555", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", cursor: "pointer", marginBottom: 12 }}>
              {earnedTokens >= 100 ? "💸 Auszahlung anfordern (" + (earnedTokens * 0.10).toFixed(2) + " EUR)" : "💸 Auszahlung ab 100 Tokens (noch " + (100 - earnedTokens).toFixed(1) + " noetig)"}
            </button>
            {showPayout && earnedTokens < 100 && (
              <div style={{ ...mono, fontSize: 11, color: "#f87171", textAlign: "center", marginBottom: 12 }}>
                Mindestbetrag: 100 Tokens (= 10,00 EUR). Dir fehlen noch {(100 - earnedTokens).toFixed(1)} Tokens.
              </div>
            )}

            {/* Transaction history */}
            <div style={{ marginTop: 8 }}>
              <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 12 }}>LETZTE TRANSAKTIONEN</div>
              {MOCK_EARNINGS.map(function (tx) {
                var sp = SPORTS.find(function (s) { return s.id === tx.sport; });
                return (
                  <div key={tx.id} style={{ background: surf, border: brd, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{sp ? sp.emoji : ""} {tx.video}</div>
                      <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 2 }}>{tx.date} · {tx.viewer}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>+{tx.earned.toFixed(1)} 🪙</div>
                      <div style={{ ...mono, fontSize: 9, color: "#5a5e6b" }}>von {tx.paid} (90%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ VIEWER DASHBOARD ═══════ */
function ViewerDash({ user, onLogout }) {
  const [tokens, setTokens] = useState(120);
  const [plan, setPlan] = useState("pro");
  const [showPlans, setShowPlans] = useState(false);
  const [step, setStep] = useState("prompt");
  const [selectedModel, setSelectedModel] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchIdx, setSearchIdx] = useState(0);
  const [procIdx, setProcIdx] = useState(0);
  const [unlockedIds, setUnlockedIds] = useState([]);

  var SEARCH_MSGS = ["Prompt wird analysiert...", "Sport-Videos werden durchsucht...", "Face-Swap auf 3 Videos angewendet...", "Vorschau wird vorbereitet..."];
  var PROC_MSGS = ["Zahlung bestaetigt...", "Video wird gerendert...", "Wasserzeichen wird eingebettet...", "Freigeschaltet!"];

  useEffect(function () {
    if (step !== "searching") return;
    if (searchIdx < SEARCH_MSGS.length - 1) {
      var t = setTimeout(function () { setSearchIdx(function (s) { return s + 1; }); }, 1200);
      return function () { clearTimeout(t); };
    }
    var t2 = setTimeout(function () {
      var modelSports = selectedModel ? selectedModel.sports : [];
      setSuggestions(findVideos(prompt, modelSports));
      setStep("results");
      setSearchIdx(0);
    }, 1000);
    return function () { clearTimeout(t2); };
  }, [step, searchIdx]);

  useEffect(function () {
    if (step !== "processing") return;
    if (procIdx < PROC_MSGS.length - 1) {
      var t = setTimeout(function () { setProcIdx(function (s) { return s + 1; }); }, 900);
      return function () { clearTimeout(t); };
    }
    var t2 = setTimeout(function () {
      setUnlockedIds(function (p) { return p.concat([selectedVideo.id]); });
      setStep("unlocked");
      setProcIdx(0);
    }, 800);
    return function () { clearTimeout(t2); };
  }, [step, procIdx]);

  function reset() { setStep("prompt"); setPrompt(""); setSelectedModel(null); setSuggestions([]); setSelectedVideo(null); }

  return (
    <div style={basePage}>
      <link href={fontLink} rel="stylesheet" />
      <style>{animCSS}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens} />

      {/* Plans modal */}
      {showPlans && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={function () { setShowPlans(false); }}>
          <div onClick={function (e) { e.stopPropagation(); }} style={{ background: "#060810", border: brd, borderRadius: 18, padding: 28, maxWidth: 500, width: "100%", animation: "fadeUp .3s ease" }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Abo waehlen</h3>
            <p style={{ color: "#5a5e6b", ...mono, fontSize: 12, marginBottom: 24 }}>Monatliche Tokens fuer Video-Freischaltungen</p>
            <div style={{ display: "flex", gap: 10 }}>
              {PLANS.map(function (p) {
                return (
                  <div key={p.id} onClick={function () { setPlan(p.id); setTokens(p.tokens); }} style={{ flex: 1, padding: 16, borderRadius: 13, cursor: "pointer", position: "relative", border: plan === p.id ? "2px solid " + p.color : brd, background: plan === p.id ? p.color + "10" : surf }}>
                    {p.popular && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "#22d3ee", color: "#000", padding: "2px 10px", borderRadius: 10, ...mono, fontSize: 9, fontWeight: 700 }}>BELIEBT</div>}
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: p.color }}>{p.price} EUR</div>
                    <div style={{ ...mono, fontSize: 10, color: "#5a5e6b" }}>/Monat</div>
                    <div style={{ marginTop: 10, padding: "5px 10px", background: p.color + "15", borderRadius: 8, ...mono, fontSize: 11, color: p.color, fontWeight: 600, textAlign: "center" }}>🪙 {p.tokens} Tokens</div>
                  </div>
                );
              })}
            </div>
            <button onClick={function () { setShowPlans(false); }} style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 10, border: "none", background: "#22d3ee", color: "#000", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", cursor: "pointer" }}>Fertig</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 3, color: "#22d3ee", marginBottom: 2 }}>VIEWER STUDIO</div>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Video erstellen</h2>
          </div>
          <button onClick={function () { setShowPlans(true); }} style={{ background: "rgba(255,255,255,0.04)", border: brd, color: "#5a5e6b", padding: "7px 14px", borderRadius: 9, cursor: "pointer", ...mono, fontSize: 10 }}>
            Abo: {PLANS.find(function (p) { return p.id === plan; }).name}
          </button>
        </div>

        {/* PROMPT */}
        {step === "prompt" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 10 }}>① GESICHT WAEHLEN</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 9, marginBottom: 28 }}>
              {MOCK_MODELS.map(function (m) {
                var sel = selectedModel && selectedModel.id === m.id;
                return (
                  <div key={m.id} onClick={function () { setSelectedModel(m); }} style={{ padding: 12, borderRadius: 11, cursor: "pointer", background: sel ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)", border: sel ? "1px solid #a78bfa" : brd }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 26 }}>{m.avatar}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                        {m.verified && <div style={{ ...mono, fontSize: 8, color: "#22c55e" }}>✅ Verifiziert</div>}
                      </div>
                    </div>
                    <div style={{ ...mono, fontSize: 9, color: "#5a5e6b", marginBottom: 4 }}>Verfuegbare Sportarten:</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {m.sports.map(function (sid) {
                        var sp = SPORTS.find(function (x) { return x.id === sid; });
                        return <span key={sid} style={{ padding: "2px 7px", borderRadius: 6, background: sp.color + "18", color: sp.color, ...mono, fontSize: 9 }}>{sp.emoji} {sp.label}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedModel && (
              <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 8, padding: 10, marginBottom: 16, ...mono, fontSize: 10, color: "#a78bfa" }}>
                {selectedModel.name} bietet nur diese Sportarten an: {selectedModel.sports.map(function (sid) {
                  var sp = SPORTS.find(function (x) { return x.id === sid; });
                  return sp.emoji + " " + sp.label;
                }).join(", ")}. Dein Prompt sollte eine davon enthalten.
              </div>
            )}

            <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", letterSpacing: 2, marginBottom: 10 }}>② WAS MOECHTEST DU SEHEN?</div>
            <textarea value={prompt} onChange={function (e) { setPrompt(e.target.value); }}
              placeholder="Beschreibe die Szene, z.B.: Alex beim Surfen auf einer riesigen Welle bei Sonnenuntergang"
              style={{ width: "100%", minHeight: 90, padding: "12px 14px", borderRadius: 12, border: brd, background: surf, color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif", resize: "vertical", outline: "none", lineHeight: 1.6, marginBottom: 16 }}
            />

            <button onClick={function () { if (selectedModel && prompt.trim()) { setStep("searching"); setSearchIdx(0); } }} style={{ width: "100%", padding: 15, borderRadius: 11, border: "none", cursor: selectedModel && prompt.trim() ? "pointer" : "not-allowed", background: selectedModel && prompt.trim() ? "linear-gradient(135deg,#22d3ee,#a78bfa)" : "rgba(255,255,255,0.03)", color: selectedModel && prompt.trim() ? "#000" : "#444", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif" }}>
              🔍 Videos finden und Face-Swap starten
            </button>
          </div>
        )}

        {/* SEARCHING */}
        {step === "searching" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, paddingTop: 50, animation: "fadeUp .4s ease" }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "conic-gradient(#22d3ee,#a78bfa,transparent)", animation: "spin 1s linear infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{selectedModel ? selectedModel.avatar : "?"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, width: "100%" }}>
              {SEARCH_MSGS.map(function (s, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= searchIdx ? 1 : 0.2, transition: "all .4s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: i < searchIdx ? "#22d3ee" : "transparent", border: i === searchIdx ? "2px solid #22d3ee" : i < searchIdx ? "none" : "2px solid #1a1a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 700 }}>
                      {i < searchIdx ? "✓" : (i === searchIdx ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", animation: "pulse .8s infinite" }} /> : null)}
                    </div>
                    <span style={{ ...mono, fontSize: 11, color: i <= searchIdx ? "#bbb" : "#333" }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div style={{ animation: "fadeUp .5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>3 Videos gefunden</h3>
              <p style={{ color: "#5a5e6b", ...mono, fontSize: 11 }}>Face-Swap angewendet — waehle ein Video zum Freischalten</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {suggestions.map(function (v, idx) {
                var sport = SPORTS.find(function (s) { return s.id === v.sport; });
                var isOpen = unlockedIds.indexOf(v.id) !== -1;
                return (
                  <div key={v.id} className="card-hover" onClick={function () { setSelectedVideo(v); setStep(isOpen ? "unlocked" : "payment"); }} style={{ background: surf, border: brd, borderRadius: 14, overflow: "hidden", cursor: "pointer", display: "flex", position: "relative" }}>
                    <div style={{ width: 170, minHeight: 120, position: "relative", flexShrink: 0 }}>
                      <img src={v.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: isOpen ? "none" : "blur(12px) brightness(0.5)" }} alt="" />
                      {!isOpen && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔒</div></div>}
                      {isOpen && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▶</div></div>}
                      <div style={{ position: "absolute", top: 6, left: 6, background: sport.color + "cc", color: "#fff", padding: "2px 7px", borderRadius: 4, ...mono, fontSize: 8, fontWeight: 600 }}>{sport.emoji} {sport.label}</div>
                    </div>
                    <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "#5a5e6b", lineHeight: 1.4 }}>{v.desc}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <div style={{ ...mono, fontSize: 10, color: "#5a5e6b" }}>{formatTime(v.duration)} · {v.quality}</div>
                        {isOpen
                          ? <div style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(34,197,94,0.12)", color: "#22c55e", ...mono, fontSize: 10, fontWeight: 600 }}>✓ Offen</div>
                          : <div style={{ padding: "4px 10px", borderRadius: 8, background: "linear-gradient(135deg,rgba(34,211,238,0.12),rgba(167,139,250,0.12))", border: "1px solid rgba(34,211,238,0.15)", ...mono, fontSize: 10, fontWeight: 600, color: "#22d3ee" }}>🪙 {v.tokens}</div>
                        }
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: 6, right: 10, ...mono, fontSize: 8, color: "#a78bfa", background: "rgba(167,139,250,0.1)", padding: "2px 7px", borderRadius: 4 }}>#{idx + 1}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={reset} style={{ width: "100%", marginTop: 16, padding: 11, borderRadius: 10, border: brd, background: "transparent", color: "#5a5e6b", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Neue Suche</button>
          </div>
        )}

        {/* PAYMENT */}
        {step === "payment" && selectedVideo && (
          <div style={{ animation: "fadeUp .4s ease", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🪙</div>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>Video freischalten</h3>
            </div>
            <div style={{ background: surf, border: brd, borderRadius: 13, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ position: "relative", height: 140 }}>
                <img src={selectedVideo.img} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(8px) brightness(0.4)" }} alt="" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 38 }}>{selectedModel ? selectedModel.avatar : ""}</div>
                    <div style={{ ...mono, fontSize: 9, color: "#888", marginTop: 2 }}>Face-Swap bereit</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{selectedVideo.title}</div>
                <div style={{ ...mono, fontSize: 10, color: "#5a5e6b" }}>{formatTime(selectedVideo.duration)} · {selectedVideo.quality} · Model: {selectedModel ? selectedModel.name : ""}</div>
              </div>
            </div>
            {/* Cost */}
            <div style={{ background: surf, border: brd, borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#999" }}>Video</span><span style={{ fontWeight: 600 }}>🪙 {selectedVideo.tokens}</span>
              </div>
              <div style={{ borderTop: brd, paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#999" }}>Dein Guthaben</span><span style={{ fontWeight: 700, color: tokens >= selectedVideo.tokens ? "#22c55e" : "#dc2626" }}>🪙 {tokens}</span>
              </div>
            </div>
            {/* Revenue split info */}
            <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 8, padding: 10, marginBottom: 16, ...mono, fontSize: 10, color: "#5a5e6b", lineHeight: 1.7 }}>
              💰 90% deiner Tokens ({(selectedVideo.tokens * 0.9).toFixed(1)} 🪙) gehen an {selectedModel ? selectedModel.name : "das Model"}
            </div>
            {tokens < selectedVideo.tokens ? (
              <div>
                <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: 12, textAlign: "center", marginBottom: 12, ...mono, fontSize: 11, color: "#f87171" }}>
                  Nicht genug Tokens
                </div>
                <button onClick={function () { setShowPlans(true); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#22d3ee,#a78bfa)", color: "#000", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", cursor: "pointer" }}>Abo upgraden</button>
              </div>
            ) : (
              <button onClick={function () { setTokens(function (t) { return t - selectedVideo.tokens; }); setStep("processing"); setProcIdx(0); }} style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", background: "linear-gradient(135deg,#22d3ee,#a78bfa)", color: "#000", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif", cursor: "pointer" }}>
                🪙 {selectedVideo.tokens} Tokens zahlen
              </button>
            )}
            <button onClick={function () { setStep("results"); }} style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10, border: brd, background: "transparent", color: "#5a5e6b", fontFamily: "'Syne', sans-serif", fontSize: 12, cursor: "pointer" }}>Zurueck</button>
          </div>
        )}

        {/* PROCESSING */}
        {step === "processing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 60, animation: "fadeUp .4s ease" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "conic-gradient(#22c55e,#22d3ee,transparent)", animation: "spin 1s linear infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#060810", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🪙</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, width: "100%" }}>
              {PROC_MSGS.map(function (s, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= procIdx ? 1 : 0.2, transition: "all .4s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: i < procIdx ? "#22c55e" : "transparent", border: i === procIdx ? "2px solid #22c55e" : i < procIdx ? "none" : "2px solid #1a1a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#000", fontWeight: 700 }}>
                      {i < procIdx ? "✓" : (i === procIdx ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse .7s infinite" }} /> : null)}
                    </div>
                    <span style={{ ...mono, fontSize: 11, color: i <= procIdx ? "#bbb" : "#333" }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* UNLOCKED */}
        {step === "unlocked" && selectedVideo && (
          <div style={{ animation: "fadeUp .5s ease" }}>
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
              <img src={selectedVideo.img} style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} alt="" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,8,16,0.9) 0%, transparent 40%)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid rgba(255,255,255,0.3)" }}>
                  <span style={{ fontSize: 26, marginLeft: 3 }}>▶</span>
                </div>
              </div>
              {/* Watermark */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-30deg)", ...mono, fontSize: 11, color: "rgba(255,255,255,0.08)", letterSpacing: 4, pointerEvents: "none", whiteSpace: "nowrap" }}>
                FACESWAP · {user.email} · ID-{Math.floor(Math.random() * 9000 + 1000)}
              </div>
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 5 }}>
                <span style={{ background: "#22c55e", color: "#fff", padding: "3px 9px", borderRadius: 14, ...mono, fontSize: 8, fontWeight: 700 }}>✓ FREIGESCHALTET</span>
                <span style={{ background: "rgba(0,0,0,0.5)", color: "#fff", padding: "3px 9px", borderRadius: 14, ...mono, fontSize: 8, fontWeight: 700 }}>FACE-SWAP</span>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, fontSize: 32 }}>{selectedModel ? selectedModel.avatar : ""}</div>
              <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{selectedModel ? selectedModel.name : ""} — {selectedVideo.title}</div>
                <div style={{ ...mono, fontSize: 10, color: "#5a5e6b", marginTop: 3 }}>{selectedVideo.desc} · {formatTime(selectedVideo.duration)} · {selectedVideo.quality}</div>
              </div>
            </div>

            {/* DRM / Watermark notice */}
            <div style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 8, padding: 10, marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
              <div style={{ ...mono, fontSize: 10, color: "#ca8a04", lineHeight: 1.7 }}>
                Dieses Video ist DRM-geschuetzt und enthaelt ein unsichtbares Wasserzeichen mit deiner Viewer-ID. Unerlaubte Weitergabe ist nachverfolgbar und fuehrt zum Kontobann.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <button style={{ background: "rgba(255,255,255,0.04)", border: brd, color: "#999", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600 }}>▶ Abspielen</button>
              <button style={{ background: "rgba(255,255,255,0.04)", border: brd, color: "#999", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600 }}>🔗 Teilen</button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={function () { setStep("results"); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: brd, background: "transparent", color: "#5a5e6b", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Andere Videos</button>
              <button onClick={reset} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#22d3ee,#a78bfa)", color: "#000", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Neue Suche</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role === "model") return <ModelDash user={user} onLogout={function () { setUser(null); }} />;
  return <ViewerDash user={user} onLogout={function () { setUser(null); }} />;
}

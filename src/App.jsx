import { useState, useRef, useEffect } from "react";

var BACKEND_URL = "https://starswap-backend.onrender.com";

var SPORTS = [
  { id: "surf",  label: "Surfen",        emoji: "🏄", color: "#0891b2" },
  { id: "climb", label: "Klettern",      emoji: "🧗", color: "#ea580c" },
  { id: "ski",   label: "Skifahren",     emoji: "⛷️",  color: "#7c3aed" },
  { id: "bike",  label: "Mountainbiken", emoji: "🚵", color: "#16a34a" },
  { id: "dive",  label: "Tauchen",       emoji: "🤿", color: "#0284c7" },
  { id: "skate", label: "Skateboarden",  emoji: "🛹", color: "#db2777" },
  { id: "box",   label: "Boxen",         emoji: "🥊", color: "#dc2626" },
  { id: "yoga",  label: "Yoga",          emoji: "🧘", color: "#d97706" },
];

var FACE_ANGLES = [
  { id: "front", label: "Frontal", icon: "😐", instruction: "Schau direkt in die Kamera" },
  { id: "left",  label: "Links",   icon: "👈", instruction: "Kopf leicht nach links drehen" },
  { id: "right", label: "Rechts",  icon: "👉", instruction: "Kopf leicht nach rechts drehen" },
  { id: "up",    label: "Hoch",    icon: "☝️",  instruction: "Kinn leicht anheben" },
  { id: "down",  label: "Runter",  icon: "👇", instruction: "Kinn leicht senken" },
];

var css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #08090f; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin     { to { transform: rotate(360deg) } }
  @keyframes glow     { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes starfall { 0%{transform:translateY(-20px);opacity:0} 100%{transform:translateY(0);opacity:1} }
  .fade-up  { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both }
  .spin     { animation: spin 1.2s linear infinite }
  .glow     { animation: glow 2s ease infinite }
  input, textarea { outline: none; }
  input::placeholder, textarea::placeholder { color: #1e2030; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #1e2030; border-radius: 2px; }
`;

var S = {
  page:  { minHeight:"100vh", background:"#08090f", color:"#eef0f6", fontFamily:"'DM Sans',sans-serif" },
  display: { fontFamily:"'Bebas Neue',cursive", letterSpacing:"0.05em" },
  mono:  { fontFamily:"'JetBrains Mono',monospace" },
  card:  { background:"#0d0e17", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20 },
  btn:   (active, color) => ({
    width:"100%", padding:"15px 0", borderRadius:12, border:"none",
    cursor: active ? "pointer" : "not-allowed",
    background: active ? (color || "linear-gradient(135deg,#f59e0b,#d97706)") : "rgba(255,255,255,0.03)",
    color: active ? "#000" : "#333", fontWeight:700, fontSize:15,
    fontFamily:"'DM Sans',sans-serif", transition:"all .2s",
    boxShadow: active ? "0 4px 24px rgba(245,158,11,0.25)" : "none",
  }),
  label: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#3a3d52", letterSpacing:3, textTransform:"uppercase" },
  input: { width:"100%", background:"#0d0e17", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12,
           padding:"13px 16px", color:"#eef0f6", fontSize:14, fontFamily:"'DM Sans',sans-serif" },
};

function Logo({ size = 24 }) {
  return (
    <span style={{ fontFamily:"'Bebas Neue',cursive", fontSize:size, letterSpacing:"0.05em" }}>
      <span style={{ color:"#f59e0b" }}>STAR</span><span style={{ color:"#eef0f6" }}>SWAP</span>
    </span>
  );
}

function NavBar({ user, onLogout, tokens, earnings }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(8,9,15,0.92)",
                  backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.05)",
                  padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <Logo size={22} />
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        {tokens !== undefined && (
          <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
                        padding:"4px 14px", borderRadius:20, ...S.mono, fontSize:11, color:"#f59e0b", fontWeight:600 }}>
            🪙 {tokens} Tokens
          </div>
        )}
        {earnings !== undefined && (
          <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)",
                        padding:"4px 14px", borderRadius:20, ...S.mono, fontSize:11, color:"#22c55e", fontWeight:600 }}>
            💰 {earnings.toFixed(1)} Tokens
          </div>
        )}
        <span style={{ ...S.mono, fontSize:10, color:"#3a3d52" }}>{user?.email}</span>
        <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
                color:"#555", padding:"5px 14px", borderRadius:8, cursor:"pointer", ...S.mono, fontSize:10 }}>
          Logout
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN ───
function LoginScreen({ onLogin }) {
  var [email, setEmail] = useState("");
  var [pw, setPw] = useState("");
  var [role, setRole] = useState("viewer");
  var [mode, setMode] = useState("login");

  return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh",
                  background:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, #08090f 60%)" }}>
      <style>{css}</style>
      <div className="fade-up" style={{ ...S.card, padding:40, width:"100%", maxWidth:420,
                                         boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Logo size={40} />
          <div style={{ ...S.mono, fontSize:11, color:"#3a3d52", marginTop:8 }}>
            Be the star of every video
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:24, background:"rgba(255,255,255,0.02)",
                      borderRadius:12, padding:4 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1, padding:"9px 0", borderRadius:9, border:"none",
              background: mode===m ? "rgba(245,158,11,0.12)" : "transparent",
              color: mode===m ? "#f59e0b" : "#555", cursor:"pointer", fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", fontSize:13, transition:"all .2s",
            }}>
              {m === "login" ? "Einloggen" : "Registrieren"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ ...S.label, marginBottom:8 }}>E-Mail</div>
          <input style={S.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@beispiel.de" />
        </div>
        <div style={{ marginBottom:24 }}>
          <div style={{ ...S.label, marginBottom:8 }}>Passwort</div>
          <input style={S.input} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
        </div>

        <div style={{ ...S.label, marginBottom:12 }}>Rolle</div>
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["viewer","👁️ Viewer"],["model","⭐ Model"]].map(([r,l]) => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex:1, padding:"11px 0", borderRadius:11,
              border:`1px solid ${role===r ? "#f59e0b" : "rgba(255,255,255,0.06)"}`,
              background: role===r ? "rgba(245,158,11,0.08)" : "transparent",
              color: role===r ? "#f59e0b" : "#555", cursor:"pointer", fontWeight:700,
              fontFamily:"'DM Sans',sans-serif", fontSize:14, transition:"all .2s",
            }}>{l}</button>
          ))}
        </div>

        <button onClick={() => email && pw && onLogin({ email, role, tokens: 80, earnings: 0 })}
          style={S.btn(email && pw)}>
          {mode === "login" ? "Einloggen →" : "Account erstellen →"}
        </button>
      </div>
    </div>
  );
}

// ─── 5 FOTOS KAMERA ───
function FaceCapture({ onComplete }) {
  var [currentAngle, setCurrentAngle] = useState(0);
  var [photos, setPhotos] = useState([]);
  var [started, setStarted] = useState(false);
  var videoRef = useRef(null);
  var streamRef = useRef(null);

  async function startCamera() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      streamRef.current = stream;
      setStarted(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 150);
    } catch(e) {
      alert("Kamera-Erlaubnis benötigt! Bitte im Browser erlauben.");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  }

  function captureFrame() {
    var video = videoRef.current;
    if (!video || video.videoWidth === 0) { alert("Kamera noch nicht bereit, kurz warten."); return; }
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      var newPhotos = [...photos, { blob, url: URL.createObjectURL(blob), angle: FACE_ANGLES[currentAngle] }];
      setPhotos(newPhotos);
      if (currentAngle < FACE_ANGLES.length - 1) {
        setCurrentAngle(currentAngle + 1);
      } else {
        stopCamera();
        onComplete(newPhotos);
      }
    }, "image/jpeg", 0.92);
  }

  var angle = FACE_ANGLES[currentAngle];

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20 }}>
        {FACE_ANGLES.map((a, i) => (
          <div key={a.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:52, height:52, borderRadius:26,
              background: i < photos.length ? "#22c55e" : i === currentAngle ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)",
              border: i === currentAngle ? "2px solid #f59e0b" : i < photos.length ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.06)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, overflow:"hidden",
            }}>
              {i < photos.length
                ? <img src={photos[i].url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : a.icon}
            </div>
            <span style={{ ...S.mono, fontSize:9, color: i === currentAngle ? "#f59e0b" : "#3a3d52" }}>{a.label}</span>
          </div>
        ))}
      </div>

      {!started ? (
        <div>
          <div style={{ fontSize:52, marginBottom:12 }}>{angle.icon}</div>
          <div style={{ fontWeight:700, fontSize:17, marginBottom:6 }}>
            Foto {currentAngle+1} von 5: <span style={{ color:"#f59e0b" }}>{angle.label}</span>
          </div>
          <div style={{ color:"#5a5e6b", fontSize:13, marginBottom:20 }}>{angle.instruction}</div>
          <button onClick={startCamera} style={{ ...S.btn(true), width:"auto", padding:"12px 36px" }}>
            📷 Kamera starten
          </button>
        </div>
      ) : (
        <div>
          <div style={{ position:"relative", display:"inline-block", marginBottom:14 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", maxWidth:300,
              borderRadius:14, border:"2px solid #f59e0b", display:"block" }} />
            <div style={{ position:"absolute", top:10, left:10, right:10, background:"rgba(0,0,0,0.75)",
              borderRadius:8, padding:"6px 10px", ...S.mono, fontSize:11, color:"#f59e0b", textAlign:"center" }}>
              {angle.icon} {angle.instruction}
            </div>
          </div>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f59e0b" }}>
            Foto {currentAngle+1} von 5 — {angle.label}
          </div>
          <button onClick={captureFrame} style={{ padding:"12px 32px", background:"#f59e0b", border:"none",
            borderRadius:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
            fontSize:15, color:"#000", boxShadow:"0 4px 20px rgba(245,158,11,0.3)" }}>
            📸 Jetzt aufnehmen
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MODEL DASHBOARD ───
function ModelDashboard({ user, onLogout }) {
  var [step, setStep] = useState("capture");
  var [photos, setPhotos] = useState([]);
  var [sports, setSports] = useState([]);
  var [consent, setConsent] = useState(false);
  var [verifyStep, setVerifyStep] = useState("pending"); // pending | email_sent | uploading | verified
  var [verifyPose, setVerifyPose] = useState("");
  var [verifyToken, setVerifyToken] = useState("");
  var [verifyPhoto, setVerifyPhoto] = useState(null);
  var [earnings, setEarnings] = useState(user.earnings || 0);
  var [loading, setLoading] = useState(false);

  function toggleSport(id) {
    setSports(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  async function sendVerificationMail() {
    setLoading(true);
    try {
      var fd = new FormData();
      fd.append("email", user.email);
      var res = await fetch(`${BACKEND_URL}/model/send-verification`, { method:"POST", body:fd });
      var data = await res.json();
      setVerifyPose(data.pose);
      setVerifyToken(data.token);
      setVerifyStep("email_sent");
    } catch(e) {
      alert("Mail konnte nicht gesendet werden: " + e.message);
    }
    setLoading(false);
  }

  async function uploadVerifyPhoto(file) {
    setVerifyPhoto(URL.createObjectURL(file));
    setVerifyStep("uploading");
    setLoading(true);
    try {
      var fd = new FormData();
      fd.append("photo", file);
      fd.append("token", verifyToken);
      fd.append("email", user.email);
      var res = await fetch(`${BACKEND_URL}/model/verify`, { method:"POST", body:fd });
      var data = await res.json();
      if (data.verified) setVerifyStep("verified");
    } catch(e) {
      alert("Fehler: " + e.message);
      setVerifyStep("email_sent");
    }
    setLoading(false);
  }

  // ── SCHRITT 1: Fotos ──
  if (step === "capture") return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} earnings={earnings} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"32px 16px" }}>
        <div className="fade-up">
          <h1 style={{ ...S.display, fontSize:32, marginBottom:4 }}>Model-Profil</h1>
          <p style={{ color:"#5a5e6b", fontSize:13, marginBottom:24 }}>Schritt 1 von 3 — 5 Gesichtsfotos aufnehmen</p>
          <div style={{ ...S.card, padding:24 }}>
            <div style={{ ...S.label, marginBottom:16 }}>Gesichtsfotos (5 Winkel)</div>
            <FaceCapture onComplete={p => { setPhotos(p); setStep("sports"); }} />
          </div>
        </div>
      </div>
    </div>
  );

  // ── SCHRITT 2: Sportarten ──
  if (step === "sports") return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} earnings={earnings} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"32px 16px" }}>
        <div className="fade-up">
          <h1 style={{ ...S.display, fontSize:32, marginBottom:4 }}>Sportarten</h1>
          <p style={{ color:"#5a5e6b", fontSize:13, marginBottom:24 }}>Schritt 2 von 3 — Für welche Sportarten gibst du dein Gesicht frei?</p>

          <div style={{ ...S.card, padding:20, marginBottom:14 }}>
            <div style={{ ...S.label, marginBottom:10 }}>✅ 5 Fotos aufgenommen</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {photos.map((p,i) => (
                <img key={i} src={p.url} alt="" style={{ width:52, height:52, borderRadius:8,
                  objectFit:"cover", border:"2px solid #22c55e" }} />
              ))}
            </div>
          </div>

          <div style={{ ...S.card, padding:20, marginBottom:14 }}>
            <div style={{ ...S.label, marginBottom:14 }}>Sportarten auswählen</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => toggleSport(s.id)} style={{
                  padding:"9px 16px", borderRadius:20,
                  border:`1px solid ${sports.includes(s.id) ? s.color : "rgba(255,255,255,0.06)"}`,
                  background: sports.includes(s.id) ? `${s.color}18` : "transparent",
                  color: sports.includes(s.id) ? s.color : "#555",
                  cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
                  transition:"all .15s",
                }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => sports.length > 0 && setStep("consent")} style={S.btn(sports.length > 0)}>
            {sports.length > 0 ? "Weiter →" : "Mindestens 1 Sportart wählen"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── SCHRITT 3: Consent + Verifikation ──
  if (step === "consent") return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} earnings={earnings} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"32px 16px" }}>
        <div className="fade-up">
          <h1 style={{ ...S.display, fontSize:32, marginBottom:4 }}>Einwilligung & Verifikation</h1>
          <p style={{ color:"#5a5e6b", fontSize:13, marginBottom:24 }}>Schritt 3 von 3</p>

          {verifyStep === "pending" && (
            <div>
              <div style={{ ...S.card, padding:20, marginBottom:14 }}>
                <div style={{ ...S.label, marginBottom:12 }}>Einwilligung</div>
                <label style={{ display:"flex", gap:12, cursor:"pointer", alignItems:"flex-start" }}>
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                    style={{ marginTop:3, accentColor:"#f59e0b", width:16, height:16 }} />
                  <span style={{ fontSize:13, color:"#8892a4", lineHeight:1.7 }}>
                    Ich willige ein, dass mein Gesicht für Face-Swap-Videos in den gewählten Sportarten verwendet wird.
                    Ich erhalte <strong style={{color:"#22c55e"}}>90% der Tokens</strong> pro Video (1 Token = 0,10 €).
                    Ich kann jederzeit widerrufen.
                  </span>
                </label>
              </div>
              <button onClick={() => consent && sendVerificationMail()} style={S.btn(consent && !loading)}>
                {loading ? "⏳ Wird gesendet..." : consent ? "📧 Verifikations-Mail senden →" : "Erst Einwilligung bestätigen"}
              </button>
            </div>
          )}

          {verifyStep === "email_sent" && (
            <div style={{ ...S.card, padding:28, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📧</div>
              <h2 style={{ fontSize:18, fontWeight:700, marginBottom:12 }}>Mail gesendet an {user.email}!</h2>
              <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
                borderRadius:12, padding:20, marginBottom:20 }}>
                <div style={{ ...S.mono, fontSize:11, color:"#f59e0b", marginBottom:8 }}>DEINE POSE</div>
                <div style={{ fontSize:16, fontWeight:700 }}>{verifyPose}</div>
              </div>
              <p style={{ color:"#5a5e6b", fontSize:13, marginBottom:20 }}>
                Mache ein Foto von dir in dieser Pose und lade es hier hoch:
              </p>
              <label style={{ display:"block", padding:"14px 0", background:"linear-gradient(135deg,#f59e0b,#d97706)",
                borderRadius:12, fontWeight:700, cursor:"pointer", color:"#000", fontSize:15 }}>
                📸 Verifikationsfoto hochladen
                <input type="file" accept="image/*" onChange={e => e.target.files[0] && uploadVerifyPhoto(e.target.files[0])}
                  style={{ display:"none" }} />
              </label>
            </div>
          )}

          {verifyStep === "uploading" && (
            <div style={{ ...S.card, padding:28, textAlign:"center" }}>
              <div className="spin" style={{ fontSize:48, display:"inline-block", marginBottom:16 }}>⭐</div>
              <div style={{ fontWeight:700, fontSize:16 }}>Wird verifiziert...</div>
            </div>
          )}

          {verifyStep === "verified" && (
            <div style={{ ...S.card, padding:28, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
              <h2 style={{ ...S.display, fontSize:28, marginBottom:8 }}>Profil verifiziert!</h2>
              <p style={{ color:"#5a5e6b", fontSize:14, marginBottom:20 }}>
                Du bist jetzt als StarSwap Model aktiv. Du verdienst 90% der Tokens wenn Viewer dein Gesicht nutzen.
              </p>
              <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)",
                borderRadius:12, padding:20 }}>
                <div style={{ ...S.mono, fontSize:10, color:"#5a5e6b", marginBottom:4 }}>AKTUELLES GUTHABEN</div>
                <div style={{ ...S.display, fontSize:36, color:"#22c55e" }}>💰 {earnings.toFixed(1)} Tokens</div>
                <div style={{ ...S.mono, fontSize:11, color:"#5a5e6b", marginTop:4 }}>
                  = {(earnings * 0.10).toFixed(2)} € auszahlbar ab 100 Tokens
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VIEWER DASHBOARD ───
function ViewerDashboard({ user, onLogout }) {
  var [tokens, setTokens] = useState(user.tokens || 80);
  var [photo, setPhoto] = useState(null);
  var [prompt, setPrompt] = useState("");
  var [step, setStep] = useState("setup");
  var [resultUrl, setResultUrl] = useState(null);
  var [errorMsg, setErrorMsg] = useState("");
  var [procMsg, setProcMsg] = useState("");
  var videoRef = useRef(null);
  var streamRef = useRef(null);
  var [cameraActive, setCameraActive] = useState(false);

  var PROC_MSGS = [
    "Gesicht wird analysiert...",
    "Sport-Video wird ausgewählt...",
    "Face-Swap läuft auf GPU...",
    "Video wird fertiggestellt...",
  ];

  async function startCamera() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 150);
    } catch(e) { alert("Kamera-Erlaubnis benötigt!"); }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }

  function takePhoto() {
    var video = videoRef.current;
    if (!video || video.videoWidth === 0) { alert("Kamera noch nicht bereit."); return; }
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => { setPhoto({ url:URL.createObjectURL(blob), blob }); stopCamera(); }, "image/jpeg", 0.92);
  }

  async function generate() {
    if (!photo || !prompt.trim()) return;
    setStep("processing");
    var idx = 0;
    setProcMsg(PROC_MSGS[0]);
    var interval = setInterval(() => { idx = Math.min(idx+1, PROC_MSGS.length-1); setProcMsg(PROC_MSGS[idx]); }, 5000);
    try {
      var fd = new FormData();
      fd.append("photo", photo.blob);
      fd.append("prompt", prompt);
      var res = await fetch(`${BACKEND_URL}/faceswap`, { method:"POST", body:fd });
      clearInterval(interval);
      if (!res.ok) { var err = await res.json(); throw new Error(err.detail || "Fehler"); }
      var data = await res.json();
      setResultUrl(data.video_url);
      setTokens(t => t - 10);
      setStep("result");
    } catch(e) { clearInterval(interval); setErrorMsg(e.message); setStep("error"); }
  }

  function reset() { setStep("setup"); setPrompt(""); setPhoto(null); setResultUrl(null); setErrorMsg(""); stopCamera(); }

  return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens} />
      <div style={{ maxWidth:640, margin:"0 auto", padding:"32px 16px" }}>

        {step === "setup" && (
          <div className="fade-up">
            <div style={{ marginBottom:28 }}>
              <h1 style={{ ...S.display, fontSize:36, marginBottom:4 }}>
                Du bist der <span style={{ color:"#f59e0b" }}>Star</span>
              </h1>
              <p style={{ color:"#5a5e6b", fontSize:14 }}>Foto machen · Wunsch eingeben · Video erhalten</p>
            </div>

            <div style={{ ...S.card, padding:22, marginBottom:14 }}>
              <div style={{ ...S.label, marginBottom:14 }}>① Dein Gesichtsfoto</div>
              {photo ? (
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <img src={photo.url} alt="" style={{ width:80, height:80, borderRadius:40,
                    objectFit:"cover", border:"3px solid #f59e0b" }} />
                  <div>
                    <div style={{ ...S.mono, fontSize:11, color:"#22c55e", marginBottom:8 }}>✅ Foto bereit</div>
                    <button onClick={() => { setPhoto(null); stopCamera(); }} style={{ ...S.mono, fontSize:10,
                      color:"#555", background:"none", border:"1px solid rgba(255,255,255,0.06)",
                      padding:"4px 12px", borderRadius:8, cursor:"pointer" }}>Neues Foto</button>
                  </div>
                </div>
              ) : cameraActive ? (
                <div style={{ textAlign:"center" }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", maxWidth:300,
                    borderRadius:14, border:"2px solid #f59e0b", display:"block", margin:"0 auto 12px" }} />
                  <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                    <button onClick={takePhoto} style={{ padding:"11px 28px", background:"#f59e0b", border:"none",
                      borderRadius:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                      fontSize:14, color:"#000" }}>📸 Foto schießen</button>
                    <button onClick={stopCamera} style={{ padding:"11px 16px", background:"rgba(255,255,255,0.03)",
                      border:"1px solid rgba(255,255,255,0.06)", borderRadius:11, color:"#666",
                      cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Abbrechen</button>
                  </div>
                </div>
              ) : (
                <button onClick={startCamera} style={{ ...S.btn(true) }}>📷 Kamera öffnen</button>
              )}
            </div>

            <div style={{ ...S.card, padding:22, marginBottom:20 }}>
              <div style={{ ...S.label, marginBottom:12 }}>② Was möchtest du sehen?</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="z.B. ich will beim Surfen in Bali eine riesige Welle reiten"
                style={{ ...S.input, minHeight:90, resize:"vertical", lineHeight:1.7 }} />
              <div style={{ ...S.mono, fontSize:10, color:"#1e2030", marginTop:8 }}>
                Surfen · Skifahren · Klettern · Boxen · Yoga · Tauchen · Mountainbiken · Skateboarden
              </div>
            </div>

            <button onClick={generate} style={S.btn(photo && prompt.trim())}>
              {photo && prompt.trim() ? "🎬 Video generieren — 10 Tokens" : "Foto aufnehmen + Text eingeben"}
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"80px 0" }}>
            <div className="spin" style={{ fontSize:52, display:"inline-block", marginBottom:24 }}>⭐</div>
            <div style={{ ...S.display, fontSize:28, marginBottom:10 }}>{procMsg}</div>
            <div style={{ ...S.mono, fontSize:11, color:"#3a3d52" }}>Bitte nicht schließen · ~30-90 Sekunden</div>
          </div>
        )}

        {step === "result" && resultUrl && (
          <div className="fade-up">
            <h2 style={{ ...S.display, fontSize:32, marginBottom:16 }}>⭐ Dein Video ist fertig!</h2>
            <video src={resultUrl} controls autoPlay loop style={{ width:"100%", borderRadius:16,
              border:"1px solid rgba(255,255,255,0.08)", background:"#000", marginBottom:16 }} />
            <button onClick={reset} style={S.btn(true)}>← Neues Video erstellen</button>
          </div>
        )}

        {step === "error" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:44, marginBottom:16 }}>⚠️</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8, color:"#f87171" }}>Fehler</div>
            <div style={{ ...S.mono, fontSize:12, color:"#3a3d52", marginBottom:24, maxWidth:400, margin:"0 auto 24px" }}>{errorMsg}</div>
            <button onClick={reset} style={S.btn(true)}>← Nochmal versuchen</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  var [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role === "model") return <ModelDashboard user={user} onLogout={() => setUser(null)} />;
  return <ViewerDashboard user={user} onLogout={() => setUser(null)} />;
}

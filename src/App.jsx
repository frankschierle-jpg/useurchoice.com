import { useState, useRef } from "react";

var BACKEND_URL = "https://useurchoice-backend.onrender.com";

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
  { id: "front", label: "Frontal",     icon: "😐", instruction: "Schau direkt in die Kamera" },
  { id: "left",  label: "Links",       icon: "👈", instruction: "Dreh den Kopf leicht nach links" },
  { id: "right", label: "Rechts",      icon: "👉", instruction: "Dreh den Kopf leicht nach rechts" },
  { id: "up",    label: "Hoch",        icon: "☝️",  instruction: "Hebe das Kinn leicht an" },
  { id: "down",  label: "Runter",      icon: "👇", instruction: "Senke das Kinn leicht ab" },
];

var css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060810; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes pulse { 0%,100%{opacity:.25} 50%{opacity:1} }
  @keyframes countdown { from { width: 100% } to { width: 0% } }
  .fade-up { animation: fadeUp .45s ease both }
  .spin { animation: spin 1s linear infinite }
  input, textarea { outline: none; }
  input::placeholder, textarea::placeholder { color: #2e3446; }
`;

var S = {
  page:  { minHeight:"100vh", background:"#060810", color:"#e8ecf4", fontFamily:"'Syne',sans-serif" },
  mono:  { fontFamily:"'IBM Plex Mono',monospace" },
  card:  { background:"#0c1018", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16 },
  btn:   (active, color) => ({
    width:"100%", padding:"14px 0", borderRadius:11, border:"none", cursor: active?"pointer":"not-allowed",
    background: active ? (color||"linear-gradient(135deg,#22d3ee,#a78bfa)") : "rgba(255,255,255,0.04)",
    color: active?"#000":"#444", fontWeight:700, fontSize:15, fontFamily:"'Syne',sans-serif",
    transition:"all .2s",
  }),
  label: { fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#5a5e6b", letterSpacing:2 },
  input: { width:"100%", background:"#0c1018", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10,
           padding:"12px 14px", color:"#e8ecf4", fontSize:14, fontFamily:"'Syne',sans-serif" },
};

function NavBar({ user, onLogout, tokens }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(6,8,16,0.9)",
                  backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.06)",
                  padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <span style={{ fontWeight:800, fontSize:16 }}>
        <span style={{ color:"#22d3ee" }}>FACE</span><span style={{ color:"#a78bfa" }}>SWAP</span>
      </span>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {tokens !== undefined && (
          <div style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)",
                        padding:"4px 12px", borderRadius:20, ...S.mono, fontSize:11, color:"#22d3ee", fontWeight:600 }}>
            🪙 {tokens} Tokens
          </div>
        )}
        <span style={{ ...S.mono, fontSize:10, color:"#5a5e6b" }}>{user?.email}</span>
        <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                color:"#666", padding:"4px 12px", borderRadius:8, cursor:"pointer", ...S.mono, fontSize:10 }}>
          Logout
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  var [email, setEmail] = useState("");
  var [pw, setPw] = useState("");
  var [role, setRole] = useState("viewer");
  var [mode, setMode] = useState("login");

  return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <style>{css}</style>
      <div className="fade-up" style={{ ...S.card, padding:36, width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:-1 }}>
            <span style={{ color:"#22d3ee" }}>FACE</span><span style={{ color:"#a78bfa" }}>SWAP</span>
          </div>
          <div style={{ ...S.mono, fontSize:11, color:"#5a5e6b", marginTop:6 }}>Dein Gesicht. Jede Sportart.</div>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1, padding:"9px 0", borderRadius:9, border:"1px solid rgba(255,255,255,0.07)",
              background: mode===m ? "rgba(34,211,238,0.1)" : "transparent",
              color: mode===m ? "#22d3ee" : "#555", cursor:"pointer", fontWeight:700,
              fontFamily:"'Syne',sans-serif", fontSize:13,
            }}>
              {m === "login" ? "Einloggen" : "Registrieren"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ ...S.label, marginBottom:6 }}>E-MAIL</div>
          <input style={S.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@beispiel.de" />
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ ...S.label, marginBottom:6 }}>PASSWORT</div>
          <input style={S.input} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
        </div>

        <div style={{ ...S.label, marginBottom:10 }}>ROLLE</div>
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[["viewer","👁 Viewer"],["model","🧑 Model"]].map(([r,l]) => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex:1, padding:"10px 0", borderRadius:10, border:`1px solid ${role===r?"#22d3ee":"rgba(255,255,255,0.07)"}`,
              background: role===r ? "rgba(34,211,238,0.08)" : "transparent",
              color: role===r ? "#22d3ee" : "#666", cursor:"pointer", fontWeight:700,
              fontFamily:"'Syne',sans-serif", fontSize:14,
            }}>{l}</button>
          ))}
        </div>

        <button onClick={() => email && pw && onLogin({ email, role, tokens: 80 })} style={S.btn(email && pw)}>
          {mode === "login" ? "Einloggen →" : "Account erstellen →"}
        </button>
      </div>
    </div>
  );
}

// ─── KAMERA FOTO AUFNAHME (5 Winkel) ───
function FaceCapture({ onComplete }) {
  var [currentAngle, setCurrentAngle] = useState(0);
  var [photos, setPhotos] = useState([]);
  var [cameraActive, setCameraActive] = useState(false);
  var [countdown, setCountdown] = useState(null);
  var videoRef = useRef(null);
  var streamRef = useRef(null);

  async function startCamera() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (e) {
      alert("Kamera konnte nicht gestartet werden. Bitte Kamera-Erlaubnis erteilen.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

 function takePhoto() {
    if (!videoRef.current || !videoRef.current.readyState >= 2) return;
    var count = 3;
    setCountdown(count);
    var timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        captureFrame();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }

  function captureFrame() {
    var canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
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
      {/* Fortschritt */}
      <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:20 }}>
        {FACE_ANGLES.map((a, i) => (
          <div key={a.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{
              width:48, height:48, borderRadius:24,
              background: i < photos.length ? "#22c55e" : i === currentAngle ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.04)",
              border: i === currentAngle ? "2px solid #22d3ee" : i < photos.length ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.07)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
              overflow:"hidden",
            }}>
              {i < photos.length
                ? <img src={photos[i].url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : a.icon
              }
            </div>
            <span style={{ ...S.mono, fontSize:9, color: i === currentAngle ? "#22d3ee" : "#2e3446" }}>{a.label}</span>
          </div>
        ))}
      </div>

      {!cameraActive ? (
        <div>
          <div style={{ fontSize:48, marginBottom:12 }}>{angle.icon}</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>
            Foto {currentAngle + 1} von 5: <span style={{ color:"#22d3ee" }}>{angle.label}</span>
          </div>
          <div style={{ color:"#5a5e6b", fontSize:13, marginBottom:20 }}>{angle.instruction}</div>
          <button onClick={startCamera} style={{ ...S.btn(true), width:"auto", padding:"12px 32px" }}>
            📷 Kamera starten
          </button>
        </div>
      ) : (
        <div>
          <div style={{ position:"relative", display:"inline-block", marginBottom:12 }}>
            <video ref={videoRef} autoPlay playsInline style={{
              width:"100%", maxWidth:320, borderRadius:12,
              border:`2px solid ${countdown ? "#f59e0b" : "#22d3ee"}`,
              display:"block",
            }} />
            {countdown && (
              <div style={{
                position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                fontSize:80, fontWeight:800, color:"#22d3ee",
                textShadow:"0 0 40px rgba(34,211,238,0.8)",
              }}>
                {countdown}
              </div>
            )}
            <div style={{
              position:"absolute", top:10, left:10, right:10,
              background:"rgba(0,0,0,0.7)", borderRadius:8, padding:"6px 10px",
              ...S.mono, fontSize:11, color:"#22d3ee", textAlign:"center",
            }}>
              {angle.icon} {angle.instruction}
            </div>
          </div>

          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <button onClick={takePhoto} disabled={!!countdown} style={{
              padding:"12px 28px", background: countdown ? "rgba(255,255,255,0.04)" : "#22d3ee",
              border:"none", borderRadius:10, fontWeight:700, cursor: countdown ? "not-allowed" : "pointer",
              fontFamily:"'Syne',sans-serif", fontSize:14, color:"#000",
            }}>
              {countdown ? `📸 ${countdown}...` : "📸 Foto aufnehmen"}
            </button>
            <button onClick={stopCamera} style={{
              padding:"12px 16px", background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.07)", borderRadius:10,
              color:"#888", cursor:"pointer", fontFamily:"'Syne',sans-serif",
            }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODEL DASHBOARD ───
function ModelDashboard({ user, onLogout }) {
  var [step, setStep] = useState("capture"); // capture | sports | consent | done
  var [photos, setPhotos] = useState([]);
  var [sports, setSports] = useState([]);
  var [consent, setConsent] = useState(false);
  var [earnings] = useState(50.4);

  function toggleSport(id) {
    setSports(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  if (step === "done") {
    return (
      <div style={S.page}>
        <style>{css}</style>
        <NavBar user={user} onLogout={onLogout} />
        <div style={{ maxWidth:500, margin:"60px auto", padding:"0 16px", textAlign:"center" }}>
          <div className="fade-up">
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Profil eingereicht!</h2>
            <p style={{ color:"#5a5e6b", fontSize:14, marginBottom:24 }}>
              Deine 5 Fotos werden überprüft. Sobald freigegeben, können Viewer dein Gesicht nutzen.
            </p>
            <div style={{ ...S.card, padding:20, borderRadius:14 }}>
              <div style={{ ...S.mono, fontSize:10, color:"#5a5e6b", marginBottom:4 }}>DEIN GUTHABEN</div>
              <div style={{ fontSize:32, fontWeight:800, color:"#22c55e" }}>💰 {earnings} Tokens</div>
              <div style={{ ...S.mono, fontSize:10, color:"#5a5e6b", marginTop:4 }}>
                = {(earnings * 0.10).toFixed(2)} EUR auszahlbar
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"32px 16px" }}>
        <div className="fade-up">
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Model-Profil einrichten</h1>
          <p style={{ color:"#5a5e6b", fontSize:13, marginBottom:24 }}>
            {step === "capture" && "Schritt 1: 5 Gesichtsfotos aufnehmen (verschiedene Winkel)"}
            {step === "sports"  && "Schritt 2: Sportarten auswählen"}
            {step === "consent" && "Schritt 3: Einwilligung bestätigen"}
          </p>

          {/* SCHRITT 1: Fotos */}
          {step === "capture" && (
            <div style={{ ...S.card, padding:24 }}>
              <div style={{ ...S.label, marginBottom:16 }}>① 5 GESICHTSFOTOS AUFNEHMEN</div>
              <FaceCapture onComplete={(p) => { setPhotos(p); setStep("sports"); }} />
            </div>
          )}

          {/* SCHRITT 2: Sportarten */}
          {step === "sports" && (
            <div>
              <div style={{ ...S.card, padding:20, marginBottom:14 }}>
                <div style={{ ...S.label, marginBottom:8 }}>✅ 5 FOTOS AUFGENOMMEN</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {photos.map((p, i) => (
                    <img key={i} src={p.url} alt="" style={{ width:56, height:56, borderRadius:8,
                      objectFit:"cover", border:"2px solid #22c55e" }} />
                  ))}
                </div>
              </div>

              <div style={{ ...S.card, padding:20, marginBottom:14 }}>
                <div style={{ ...S.label, marginBottom:12 }}>② SPORTARTEN FREIGEBEN</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {SPORTS.map(s => (
                    <button key={s.id} onClick={() => toggleSport(s.id)} style={{
                      padding:"8px 14px", borderRadius:20,
                      border:`1px solid ${sports.includes(s.id) ? s.color : "rgba(255,255,255,0.07)"}`,
                      background: sports.includes(s.id) ? `${s.color}18` : "transparent",
                      color: sports.includes(s.id) ? s.color : "#666",
                      cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13,
                    }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => sports.length > 0 && setStep("consent")}
                style={S.btn(sports.length > 0)}>
                {sports.length > 0 ? "Weiter →" : "Mindestens 1 Sportart wählen"}
              </button>
            </div>
          )}

          {/* SCHRITT 3: Consent */}
          {step === "consent" && (
            <div>
              <div style={{ ...S.card, padding:20, marginBottom:14 }}>
                <div style={{ ...S.label, marginBottom:12 }}>③ EINWILLIGUNG</div>
                <label style={{ display:"flex", gap:12, cursor:"pointer", alignItems:"flex-start" }}>
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                    style={{ marginTop:2, accentColor:"#22d3ee", width:16, height:16 }} />
                  <span style={{ fontSize:13, color:"#8892a4", lineHeight:1.6 }}>
                    Ich willige ein, dass mein Gesicht für Face-Swap-Videos in den ausgewählten Sportarten
                    verwendet werden darf. Ich erhalte <strong style={{color:"#22c55e"}}>90% der Tokens</strong> pro
                    generiertem Video (1 Token = 0,10 €). Ich kann meine Einwilligung jederzeit widerrufen.
                  </span>
                </label>
              </div>

              <button onClick={() => consent && setStep("done")} style={S.btn(consent)}>
                {consent ? "✅ Profil einreichen" : "Bitte Einwilligung bestätigen"}
              </button>
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
    "Passendes Sport-Video wird gesucht...",
    "Face-Swap wird durchgeführt...",
    "Video wird fertiggestellt...",
  ];

  async function startCamera() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch(e) {
      alert("Kamera-Erlaubnis benötigt!");
    }
  }

  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }

  function takePhoto() {
    var canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      setPhoto({ url: URL.createObjectURL(blob), blob });
      stopCamera();
    }, "image/jpeg", 0.92);
  }

  async function generate() {
    if (!photo || !prompt.trim()) return;
    setStep("processing");
    setErrorMsg("");
    var idx = 0;
    setProcMsg(PROC_MSGS[0]);
    var interval = setInterval(() => {
      idx = Math.min(idx + 1, PROC_MSGS.length - 1);
      setProcMsg(PROC_MSGS[idx]);
    }, 4000);

    try {
      var formData = new FormData();
      formData.append("photo", photo.blob);
      formData.append("prompt", prompt);
      var res = await fetch(`${BACKEND_URL}/faceswap`, { method:"POST", body: formData });
      clearInterval(interval);
      if (!res.ok) { var err = await res.json(); throw new Error(err.detail || "Server-Fehler"); }
      var data = await res.json();
      setResultUrl(data.video_url);
      setTokens(t => t - 10);
      setStep("result");
    } catch(e) {
      clearInterval(interval);
      setErrorMsg(e.message);
      setStep("error");
    }
  }

  function reset() { setStep("setup"); setPrompt(""); setPhoto(null); setResultUrl(null); setErrorMsg(""); stopCamera(); }

  return (
    <div style={S.page}>
      <style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens} />
      <div style={{ maxWidth:640, margin:"0 auto", padding:"32px 16px" }}>

        {step === "setup" && (
          <div className="fade-up">
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>
                Dein <span style={{ color:"#22d3ee" }}>Gesicht</span> in Action
              </h1>
              <p style={{ color:"#5a5e6b", fontSize:14 }}>Foto machen, Wunsch eingeben — KI macht den Rest.</p>
            </div>

            {/* Foto */}
            <div style={{ ...S.card, padding:20, marginBottom:16 }}>
              <div style={{ ...S.label, marginBottom:12 }}>① DEIN GESICHTSFOTO</div>

              {photo ? (
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <img src={photo.url} alt="" style={{ width:80, height:80, borderRadius:40,
                    objectFit:"cover", border:"3px solid #22d3ee" }} />
                  <div>
                    <div style={{ ...S.mono, fontSize:11, color:"#22c55e", marginBottom:6 }}>✅ Foto bereit</div>
                    <button onClick={() => { setPhoto(null); stopCamera(); }} style={{
                      ...S.mono, fontSize:10, color:"#666", background:"none",
                      border:"1px solid rgba(255,255,255,0.07)", padding:"4px 12px", borderRadius:8, cursor:"pointer"
                    }}>Neues Foto</button>
                  </div>
                </div>
              ) : cameraActive ? (
                <div style={{ textAlign:"center" }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width:"100%", maxWidth:300,
                    borderRadius:12, border:"2px solid #22d3ee", display:"block", margin:"0 auto 12px" }} />
                  <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                    <button onClick={takePhoto} style={{ padding:"10px 24px", background:"#22d3ee", border:"none",
                      borderRadius:10, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
                      📸 Foto schießen
                    </button>
                    <button onClick={stopCamera} style={{ padding:"10px 16px", background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, color:"#888",
                      cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={startCamera} style={{ ...S.btn(true), background:"linear-gradient(135deg,#22d3ee,#06b6d4)" }}>
                  📷 Kamera öffnen & Foto machen
                </button>
              )}
            </div>

            {/* Prompt */}
            <div style={{ ...S.card, padding:20, marginBottom:20 }}>
              <div style={{ ...S.label, marginBottom:10 }}>② WAS MÖCHTEST DU SEHEN?</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="z.B. ich will beim Surfen in Bali eine große Welle reiten"
                style={{ ...S.input, minHeight:90, resize:"vertical", lineHeight:1.6 }} />
              <div style={{ ...S.mono, fontSize:10, color:"#2e3446", marginTop:8 }}>
                Tipp: Surfen · Skifahren · Klettern · Boxen · Yoga · Tauchen · Mountainbiken · Skateboarden
              </div>
            </div>

            <button onClick={generate} style={S.btn(photo && prompt.trim())}>
              {photo && prompt.trim() ? "🎬 Video generieren (10 Tokens)" : "Foto + Text eingeben"}
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:48, marginBottom:20 }}>
              <span className="spin" style={{ display:"inline-block" }}>⚙️</span>
            </div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{procMsg}</div>
            <div style={{ ...S.mono, fontSize:11, color:"#5a5e6b" }}>Bitte nicht schließen — dauert ~30-60 Sek</div>
          </div>
        )}

        {step === "result" && resultUrl && (
          <div className="fade-up">
            <h2 style={{ fontWeight:800, fontSize:20, marginBottom:16 }}>✅ Dein Video ist fertig!</h2>
            <video src={resultUrl} controls autoPlay loop style={{ width:"100%", borderRadius:14,
              border:"1px solid rgba(255,255,255,0.1)", background:"#000", marginBottom:16 }} />
            <button onClick={reset} style={S.btn(true)}>← Neues Video erstellen</button>
          </div>
        )}

        {step === "error" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8, color:"#f87171" }}>Fehler</div>
            <div style={{ ...S.mono, fontSize:12, color:"#5a5e6b", marginBottom:24 }}>{errorMsg}</div>
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

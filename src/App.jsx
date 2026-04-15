import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

var BACKEND_URL = "https://useurchoice-backend.onrender.com";
var SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
var SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

var ALL_POSES = [
  "Hebe deine rechte Hand über den Kopf",
  "Zeige ein Peace-Zeichen mit beiden Händen",
  "Lege beide Hände auf die Wangen",
  "Zeige einen Daumen hoch mit der linken Hand",
  "Verschränke die Arme vor der Brust",
  "Zeige drei Finger mit der rechten Hand",
  "Lege eine Hand auf die Schulter",
  "Zeige ein Herzzeichen mit beiden Händen",
  "Hebe beide Arme seitlich an",
  "Zeige eine Faust mit der rechten Hand",
  "Tippe mit dem Finger auf deine Nase",
  "Halte beide Hände vor dem Gesicht",
  "Zeige einen Daumen runter mit rechts",
  "Lege den Kopf schief nach rechts",
  "Zeige fünf Finger mit der linken Hand",
  "Strecke die Zunge heraus und hebe rechte Hand",
  "Mache eine Pistole mit beiden Händen",
  "Lege beide Hände auf den Kopf",
  "Zeige ein Okay-Zeichen mit der rechten Hand",
  "Hebe die linke Schulter an und zwinkere",
];

var VIDEO_PREVIEWS = [
  { id:"v1", sport:"surf",  title:"Barrel Ride Bali",       thumb:"https://images.unsplash.com/photo-1502680390548-bdbac40f7154?w=400&q=80", duration:180 },
  { id:"v2", sport:"surf",  title:"Big Wave Nazaré",        thumb:"https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400&q=80", duration:90  },
  { id:"v3", sport:"ski",   title:"Powder Run Chamonix",    thumb:"https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&q=80", duration:300 },
  { id:"v4", sport:"climb", title:"El Capitan Free Solo",   thumb:"https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80", duration:420 },
  { id:"v5", sport:"box",   title:"Ring Sparring Berlin",   thumb:"https://images.unsplash.com/photo-1517438322307-e67111335449?w=400&q=80", duration:60  },
  { id:"v6", sport:"yoga",  title:"Sunrise Flow Bali",      thumb:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80", duration:600 },
  { id:"v7", sport:"dive",  title:"Korallenriff Malediven", thumb:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", duration:360 },
  { id:"v8", sport:"bike",  title:"Downhill Whistler",      thumb:"https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&q=80", duration:240 },
  { id:"v9", sport:"skate", title:"Venice Beach Halfpipe",  thumb:"https://images.unsplash.com/photo-1564296786786-a4dd73e51086?w=400&q=80", duration:120 },
];

function getTokenPrice(s){if(s<=60)return 50;if(s<=180)return 100;if(s<=300)return 300;return 500;}
function formatDuration(s){if(s<60)return s+" Sek";return Math.floor(s/60)+" Min"+(s%60>0?" "+s%60+"s":"");}
function detectSport(text){
  var t=text.toLowerCase();
  var m={surf:["surf","welle","ozean","beach","bali","hawaii","meer"],ski:["ski","schnee","alpen","piste","winter","snowboard"],climb:["kletter","fels","berg","bouldern"],bike:["bike","fahrrad","downhill","trail","mtb"],box:["box","ring","kampf","boxen","sparring"],yoga:["yoga","meditation","flow"],dive:["tauch","unterwasser","koralle"],skate:["skate","halfpipe","skateboard"]};
  for(var sport in m){if(m[sport].some(k=>t.includes(k)))return sport;}
  return null;
}
function getVideoSuggestions(prompt){
  var sport=detectSport(prompt);
  var pool=sport?VIDEO_PREVIEWS.filter(v=>v.sport===sport):VIDEO_PREVIEWS;
  if(pool.length<3)pool=[...pool,...VIDEO_PREVIEWS.filter(v=>v.sport!==sport)];
  return [...pool].sort(()=>Math.random()-.5).slice(0,3);
}

var css=`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}body{background:#08090f;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fade-up{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
  .spin{animation:spin 1.2s linear infinite}
  input,textarea{outline:none;}input::placeholder,textarea::placeholder{color:#1e2030;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#1e2030;border-radius:2px;}
  .card-hover{transition:all .25s ease;cursor:pointer;}.card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.5);}
`;

var S={
  page:{minHeight:"100vh",background:"#08090f",color:"#eef0f6",fontFamily:"'DM Sans',sans-serif"},
  display:{fontFamily:"'Bebas Neue',cursive",letterSpacing:"0.05em"},
  mono:{fontFamily:"'JetBrains Mono',monospace"},
  card:{background:"#0d0e17",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20},
  btn:(active,color)=>({width:"100%",padding:"15px 0",borderRadius:12,border:"none",cursor:active?"pointer":"not-allowed",background:active?(color||"linear-gradient(135deg,#f59e0b,#d97706)"):"rgba(255,255,255,0.03)",color:active?"#000":"#333",fontWeight:700,fontSize:15,fontFamily:"'DM Sans',sans-serif",transition:"all .2s",boxShadow:active?"0 4px 24px rgba(245,158,11,0.2)":"none"}),
  label:{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#3a3d52",letterSpacing:3},
  input:{width:"100%",background:"#0d0e17",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"13px 16px",color:"#eef0f6",fontSize:14,fontFamily:"'DM Sans',sans-serif"},
};

function Logo({size=24}){return <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:size,letterSpacing:"0.05em"}}><span style={{color:"#f59e0b"}}>STAR</span><span style={{color:"#eef0f6"}}>SWAP</span></span>;}

function NavBar({user,onLogout,tokens,earnings}){
  return(
    <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(8,9,15,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <Logo size={22}/>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        {tokens!==undefined&&<div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",padding:"4px 14px",borderRadius:20,...S.mono,fontSize:11,color:"#f59e0b",fontWeight:600}}>🪙 {tokens} Tokens</div>}
        {earnings!==undefined&&<div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",padding:"4px 14px",borderRadius:20,...S.mono,fontSize:11,color:"#22c55e",fontWeight:600}}>💰 {earnings.toFixed(1)} Tokens</div>}
        <span style={{...S.mono,fontSize:10,color:"#3a3d52"}}>{user?.email}</span>
        <button onClick={onLogout} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",color:"#555",padding:"5px 14px",borderRadius:8,cursor:"pointer",...S.mono,fontSize:10}}>Logout</button>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ───
function AuthScreen({onLogin}){
  var [screen,setScreen]=useState("choose"); // choose | login | register-viewer | register-model-email | register-model-photos | register-model-pose | register-model-done | check-email
  var [email,setEmail]=useState("");
  var [pw,setPw]=useState("");
  var [name,setName]=useState("");
  var [sports,setSports]=useState([]);
  var [photos,setPhotos]=useState([]);
  var [profileIdx,setProfileIdx]=useState(0);
  var [pose]=useState(()=>ALL_POSES[Math.floor(Math.random()*ALL_POSES.length)]);
  var [loading,setLoading]=useState(false);
  var [error,setError]=useState("");

  function toggleSport(id){setSports(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);}

  async function loginSubmit(){
    setLoading(true);setError("");
    try{
      var {data,error:e}=await supabase.auth.signInWithPassword({email,password:pw});
      if(e)throw e;
      var {data:modelData}=await supabase.from("models").select("*").eq("email",email).single();
      var role=modelData?"model":"viewer";
      onLogin({email,role,tokens:80,earnings:modelData?.earnings||0,id:data.user.id,modelData});
    }catch(e){
      var msg=e.message||"Fehler";
      if(msg.includes("Invalid login credentials"))msg="E-Mail oder Passwort falsch";
      if(msg.includes("Email not confirmed"))msg="Bitte zuerst die Bestätigungs-Mail anklicken";
      setError(msg);
    }
    setLoading(false);
  }

  async function registerViewer(){
    setLoading(true);setError("");
    try{
      var {error:e}=await supabase.auth.signUp({email,password:pw,options:{emailRedirectTo:window.location.origin}});
      if(e)throw e;
      setScreen("check-email");
    }catch(e){setError(e.message||"Fehler");}
    setLoading(false);
  }

  async function registerModelFinal(verifyPhoto){
    setLoading(true);setError("");
    try{
      // 1. Supabase Auth Account erstellen
      var {error:e}=await supabase.auth.signUp({email,password:pw,options:{emailRedirectTo:window.location.origin}});
      if(e&&!e.message.includes("already registered"))throw e;

      // 2. Frontalfoto auf Cloudinary hochladen
      var faceUrl="";
      var fd=new FormData();
      fd.append("photo",photos[profileIdx].blob,"face.jpg");
      fd.append("email",email);
      var res=await fetch(`${BACKEND_URL}/model/upload-photo`,{method:"POST",body:fd});
      var uploadData=await res.json();
      faceUrl=uploadData.photo_url||"";

      // 3. Verifikationsfoto hochladen
      var fd2=new FormData();
      fd2.append("photo",verifyPhoto);
      fd2.append("email",email);
      await fetch(`${BACKEND_URL}/model/verify`,{method:"POST",body:fd2});

      // 4. In Supabase speichern
      await supabase.from("models").upsert({email,name:name||email.split("@")[0],face_url:faceUrl,sports,verified:false,earnings:0});

      setScreen("register-model-done");
    }catch(e){setError(e.message||"Fehler");}
    setLoading(false);
  }

  // CHOOSE
  if(screen==="choose")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, #08090f 60%)"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:440,boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <div style={{textAlign:"center",marginBottom:36}}><Logo size={44}/><div style={{...S.mono,fontSize:11,color:"#3a3d52",marginTop:8}}>Be the star of every video</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <button onClick={()=>setScreen("login")} style={{...S.btn(true),background:"linear-gradient(135deg,#f59e0b,#d97706)"}}>Einloggen</button>
          <button onClick={()=>setScreen("register-viewer")} style={{...S.btn(true,"rgba(255,255,255,0.06)"),color:"#eef0f6",boxShadow:"none"}}>👁️ Als Viewer registrieren</button>
          <button onClick={()=>setScreen("register-model-email")} style={{...S.btn(true,"rgba(245,158,11,0.1)"),color:"#f59e0b",border:"1px solid rgba(245,158,11,0.3)",boxShadow:"none"}}>⭐ Als Model registrieren</button>
        </div>
      </div>
    </div>
  );

  // LOGIN
  if(screen==="login")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, #08090f 60%)"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <button onClick={()=>setScreen("choose")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
        <div style={{textAlign:"center",marginBottom:28}}><Logo size={36}/></div>
        <div style={{marginBottom:14}}><div style={{...S.label,marginBottom:8}}>E-MAIL</div><input style={S.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@beispiel.de"/></div>
        <div style={{marginBottom:24}}><div style={{...S.label,marginBottom:8}}>PASSWORT</div><input style={S.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"/></div>
        {error&&<div style={{...S.mono,fontSize:11,color:"#f87171",marginBottom:16,padding:"8px 12px",background:"rgba(248,113,113,0.08)",borderRadius:8}}>{error}</div>}
        <button onClick={loginSubmit} style={S.btn(email&&pw&&!loading)}>{loading?"⏳ Einloggen...":"Einloggen →"}</button>
      </div>
    </div>
  );

  // REGISTER VIEWER
  if(screen==="register-viewer")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, #08090f 60%)"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <button onClick={()=>setScreen("choose")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
        <div style={{textAlign:"center",marginBottom:24}}><Logo size={32}/><div style={{...S.mono,fontSize:11,color:"#3a3d52",marginTop:6}}>👁️ Viewer Registrierung</div></div>
        <div style={{marginBottom:14}}><div style={{...S.label,marginBottom:8}}>E-MAIL</div><input style={S.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@beispiel.de"/></div>
        <div style={{marginBottom:24}}><div style={{...S.label,marginBottom:8}}>PASSWORT</div><input style={S.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mindestens 6 Zeichen"/></div>
        {error&&<div style={{...S.mono,fontSize:11,color:"#f87171",marginBottom:16,padding:"8px 12px",background:"rgba(248,113,113,0.08)",borderRadius:8}}>{error}</div>}
        <button onClick={registerViewer} style={S.btn(email&&pw.length>=6&&!loading)}>{loading?"⏳ Wird erstellt...":"Account erstellen → Bestätigungsmail"}</button>
        <div style={{...S.mono,fontSize:10,color:"#3a3d52",textAlign:"center",marginTop:12}}>Du erhältst eine Bestätigungsmail</div>
      </div>
    </div>
  );

  // REGISTER MODEL — EMAIL + PASSWORT
  if(screen==="register-model-email")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, #08090f 60%)"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <button onClick={()=>setScreen("choose")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
        <div style={{textAlign:"center",marginBottom:24}}><Logo size={32}/><div style={{...S.mono,fontSize:11,color:"#f59e0b",marginTop:6}}>⭐ Model Registrierung — Schritt 1/3</div></div>
        <div style={{marginBottom:14}}><div style={{...S.label,marginBottom:8}}>DEIN NAME</div><input style={S.input} value={name} onChange={e=>setName(e.target.value)} placeholder="z.B. Alex M."/></div>
        <div style={{marginBottom:14}}><div style={{...S.label,marginBottom:8}}>E-MAIL</div><input style={S.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@beispiel.de"/></div>
        <div style={{marginBottom:24}}><div style={{...S.label,marginBottom:8}}>PASSWORT</div><input style={S.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mindestens 6 Zeichen"/></div>
        <button onClick={()=>email&&pw.length>=6&&setScreen("register-model-photos")} style={S.btn(email&&pw.length>=6)}>Weiter → Fotos aufnehmen</button>
      </div>
    </div>
  );

  // REGISTER MODEL — 5 FOTOS
  if(screen==="register-model-photos")return(
    <div style={S.page}><style>{css}</style>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <button onClick={()=>setScreen("register-model-email")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
          <div style={{textAlign:"center",marginBottom:24}}><Logo size={32}/><div style={{...S.mono,fontSize:11,color:"#f59e0b",marginTop:6}}>⭐ Model Registrierung — Schritt 2/3</div></div>
          <div style={{...S.card,padding:24,marginBottom:16}}>
            <div style={{...S.label,marginBottom:16}}>5 GESICHTSFOTOS AUFNEHMEN</div>
            <FaceCapture userEmail={email} onComplete={p=>{setPhotos(p);setScreen("register-model-sports");}}/>
          </div>
        </div>
      </div>
    </div>
  );

  // REGISTER MODEL — SPORTARTEN
  if(screen==="register-model-sports")return(
    <div style={S.page}><style>{css}</style>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <div style={{textAlign:"center",marginBottom:24}}><Logo size={32}/><div style={{...S.mono,fontSize:11,color:"#f59e0b",marginTop:6}}>⭐ Model Registrierung — Schritt 2/3</div></div>
          <div style={{...S.card,padding:20,marginBottom:14}}>
            <div style={{...S.label,marginBottom:12}}>PROFILBILD WÄHLEN</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {photos.map((p,i)=>(
                <div key={i} onClick={()=>setProfileIdx(i)} style={{cursor:"pointer",position:"relative"}}>
                  <img src={p.url} alt="" style={{width:72,height:72,borderRadius:36,objectFit:"cover",border:`3px solid ${profileIdx===i?"#f59e0b":"rgba(255,255,255,0.06)"}`,transition:"all .15s"}}/>
                  {profileIdx===i&&<div style={{position:"absolute",bottom:0,right:0,background:"#f59e0b",borderRadius:10,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>⭐</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{...S.card,padding:20,marginBottom:14}}>
            <div style={{...S.label,marginBottom:14}}>SPORTARTEN FREIGEBEN</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {SPORTS.map(s=>(
                <button key={s.id} onClick={()=>toggleSport(s.id)} style={{padding:"9px 16px",borderRadius:20,border:`1px solid ${sports.includes(s.id)?s.color:"rgba(255,255,255,0.06)"}`,background:sports.includes(s.id)?`${s.color}18`:"transparent",color:sports.includes(s.id)?s.color:"#555",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13}}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>sports.length>0&&setScreen("register-model-pose")} style={S.btn(sports.length>0)}>
            {sports.length>0?"Weiter → Verifikation":"Mindestens 1 Sportart wählen"}
          </button>
        </div>
      </div>
    </div>
  );

  // REGISTER MODEL — VERIFIKATIONS-POSE
  if(screen==="register-model-pose")return(
    <div style={S.page}><style>{css}</style>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <div style={{textAlign:"center",marginBottom:24}}><Logo size={32}/><div style={{...S.mono,fontSize:11,color:"#f59e0b",marginTop:6}}>⭐ Model Registrierung — Schritt 3/3</div></div>
          <div style={{...S.card,padding:28,marginBottom:14}}>
            <div style={{...S.label,marginBottom:16}}>VERIFIKATIONS-POSE</div>
            <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:14,padding:24,textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:44,marginBottom:10}}>🤳</div>
              <div style={{fontSize:17,fontWeight:700,color:"#f59e0b",lineHeight:1.5}}>{pose}</div>
            </div>
            <p style={{color:"#5a5e6b",fontSize:13,marginBottom:20,lineHeight:1.6}}>
              Mache ein Foto von dir in genau dieser Pose. Das bestätigt dass du wirklich du bist.
              Nach dem Upload erhältst du eine Bestätigungsmail.
            </p>
            {error&&<div style={{...S.mono,fontSize:11,color:"#f87171",marginBottom:16,padding:"8px 12px",background:"rgba(248,113,113,0.08)",borderRadius:8}}>{error}</div>}
            {loading?(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div className="spin" style={{fontSize:40,display:"inline-block",marginBottom:12}}>⭐</div>
                <div style={{...S.mono,fontSize:12,color:"#f59e0b"}}>Wird gespeichert...</div>
              </div>
            ):(
              <label style={{display:"block",padding:"14px 0",background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:12,fontWeight:700,cursor:"pointer",color:"#000",fontSize:15,textAlign:"center"}}>
                📸 Verifikationsfoto hochladen & Registrierung abschließen
                <input type="file" accept="image/*" onChange={e=>e.target.files[0]&&registerModelFinal(e.target.files[0])} style={{display:"none"}}/>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // REGISTER MODEL — FERTIG
  if(screen==="register-model-done")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:440,textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <div style={{fontSize:56,marginBottom:16}}>🎉</div>
        <Logo size={32}/>
        <h2 style={{fontSize:20,fontWeight:700,margin:"16px 0 8px"}}>Registrierung fast abgeschlossen!</h2>
        <p style={{color:"#5a5e6b",fontSize:14,lineHeight:1.7,marginBottom:24}}>
          Wir haben dir eine Bestätigungsmail an <strong style={{color:"#f59e0b"}}>{email}</strong> geschickt.
          Klick auf den Link in der Mail um dein Profil zu aktivieren.
        </p>
        <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:16,...S.mono,fontSize:11,color:"#f59e0b",marginBottom:24}}>
          Nach Bestätigung wirst du von uns freigeschaltet und kannst Tokens verdienen.
        </div>
        <button onClick={()=>setScreen("login")} style={S.btn(true)}>Zum Login →</button>
      </div>
    </div>
  );

  // CHECK EMAIL
  if(screen==="check-email")return(
    <div style={{...S.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <style>{css}</style>
      <div className="fade-up" style={{...S.card,padding:40,width:"100%",maxWidth:440,textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.6)"}}>
        <div style={{fontSize:56,marginBottom:16}}>📧</div>
        <Logo size={32}/>
        <h2 style={{fontSize:20,fontWeight:700,margin:"16px 0 8px"}}>Bestätigungsmail gesendet!</h2>
        <p style={{color:"#5a5e6b",fontSize:14,lineHeight:1.7,marginBottom:24}}>
          Wir haben dir einen Link an <strong style={{color:"#f59e0b"}}>{email}</strong> geschickt.
          Klick darauf um deinen Account zu aktivieren.
        </p>
        <button onClick={()=>setScreen("login")} style={S.btn(true)}>Zum Login →</button>
      </div>
    </div>
  );
}

// ─── 5 FOTOS KAMERA ───
function FaceCapture({onComplete,userEmail}){
  var [currentAngle,setCurrentAngle]=useState(0);
  var [photos,setPhotos]=useState([]);
  var [started,setStarted]=useState(false);
  var [uploading,setUploading]=useState(false);
  var videoRef=useRef(null);
  var streamRef=useRef(null);

  async function startCamera(){
    try{
      var stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});
      streamRef.current=stream;setStarted(true);
      setTimeout(()=>{if(videoRef.current)videoRef.current.srcObject=stream;},150);
    }catch(e){alert("Kamera-Erlaubnis benötigt!");}
  }
  function stopCamera(){if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}}
  async function captureFrame(){
    var video=videoRef.current;
    if(!video||video.videoWidth===0){alert("Kamera noch nicht bereit.");return;}
    var canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;canvas.height=video.videoHeight;
    canvas.getContext("2d").drawImage(video,0,0);
    canvas.toBlob(async blob=>{
      var url=URL.createObjectURL(blob);
      var newPhotos=[...photos,{blob,url,angle:FACE_ANGLES[currentAngle]}];
      setPhotos(newPhotos);
      if(currentAngle===0){
        setUploading(true);
        try{
          var fd=new FormData();fd.append("photo",blob,"face.jpg");fd.append("email",userEmail);
          var res=await fetch(`${BACKEND_URL}/model/upload-photo`,{method:"POST",body:fd});
          var data=await res.json();
          newPhotos[0].cloudinaryUrl=data.photo_url;
        }catch(e){console.error(e);}
        setUploading(false);
      }
      if(currentAngle<FACE_ANGLES.length-1){setCurrentAngle(currentAngle+1);}
      else{stopCamera();onComplete(newPhotos);}
    },"image/jpeg",0.92);
  }
  var angle=FACE_ANGLES[currentAngle];
  return(
    <div style={{textAlign:"center"}}>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
        {FACE_ANGLES.map((a,i)=>(
          <div key={a.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:52,height:52,borderRadius:26,background:i<photos.length?"#22c55e":i===currentAngle?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.03)",border:i===currentAngle?"2px solid #f59e0b":i<photos.length?"2px solid #22c55e":"2px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,overflow:"hidden"}}>
              {i<photos.length?<img src={photos[i].url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:a.icon}
            </div>
            <span style={{...S.mono,fontSize:9,color:i===currentAngle?"#f59e0b":"#3a3d52"}}>{a.label}</span>
          </div>
        ))}
      </div>
      {uploading&&<div style={{...S.mono,fontSize:11,color:"#f59e0b",marginBottom:12}}>⏳ Foto wird gespeichert...</div>}
      {!started?(
        <div>
          <div style={{fontSize:52,marginBottom:12}}>{angle.icon}</div>
          <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>Foto {currentAngle+1} von 5: <span style={{color:"#f59e0b"}}>{angle.label}</span></div>
          <div style={{color:"#5a5e6b",fontSize:13,marginBottom:20}}>{angle.instruction}</div>
          <button onClick={startCamera} style={{...S.btn(true),width:"auto",padding:"12px 36px"}}>📷 Kamera starten</button>
        </div>
      ):(
        <div>
          <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
            <video ref={videoRef} autoPlay playsInline muted style={{width:"100%",maxWidth:300,borderRadius:14,border:"2px solid #f59e0b",display:"block"}}/>
            <div style={{position:"absolute",top:10,left:10,right:10,background:"rgba(0,0,0,0.75)",borderRadius:8,padding:"6px 10px",...S.mono,fontSize:11,color:"#f59e0b",textAlign:"center"}}>{angle.icon} {angle.instruction}</div>
          </div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14,color:"#f59e0b"}}>Foto {currentAngle+1} von 5 — {angle.label}</div>
          <button onClick={captureFrame} disabled={uploading} style={{padding:"12px 32px",background:uploading?"rgba(255,255,255,0.04)":"#f59e0b",border:"none",borderRadius:11,fontWeight:700,cursor:uploading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#000"}}>
            {uploading?"⏳ Warten...":"📸 Jetzt aufnehmen"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MODEL DASHBOARD ───
function ModelDashboard({user,onLogout}){
  var [earnings,setEarnings]=useState(user.earnings||0);
  var modelData=user.modelData;
  return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} earnings={earnings}/>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <h1 style={{...S.display,fontSize:36,marginBottom:4}}>Dein Model-Dashboard</h1>
          <p style={{color:"#5a5e6b",fontSize:13,marginBottom:24}}>Willkommen zurück, {modelData?.name||user.email.split("@")[0]}!</p>
          <div style={{...S.card,padding:24,marginBottom:14,display:"flex",alignItems:"center",gap:20}}>
            {modelData?.face_url?(
              <img src={modelData.face_url} alt="" style={{width:80,height:80,borderRadius:40,objectFit:"cover",border:"3px solid #f59e0b",flexShrink:0}}/>
            ):(
              <div style={{width:80,height:80,borderRadius:40,background:"rgba(245,158,11,0.1)",border:"3px solid #f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>👤</div>
            )}
            <div>
              <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>{modelData?.name||user.email.split("@")[0]}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {(modelData?.sports||[]).map(s=>{var sp=SPORTS.find(x=>x.id===s);return sp?<span key={s} style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:`${sp.color}18`,color:sp.color,fontWeight:600}}>{sp.emoji} {sp.label}</span>:null;})}
              </div>
              <div style={{...S.mono,fontSize:10,color:modelData?.verified?"#22c55e":"#f59e0b",marginTop:6}}>{modelData?.verified?"✅ Verifiziert":"⏳ Warte auf Freischaltung"}</div>
            </div>
          </div>
          <div style={{...S.card,padding:24,textAlign:"center"}}>
            <div style={{...S.mono,fontSize:10,color:"#3a3d52",marginBottom:8}}>DEIN GUTHABEN</div>
            <div style={{...S.display,fontSize:48,color:"#22c55e"}}>💰 {earnings.toFixed(1)}</div>
            <div style={{...S.mono,fontSize:11,color:"#5a5e6b",marginTop:4}}>Tokens · {(earnings*0.10).toFixed(2)} € · Auszahlung ab 100 Tokens</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VIEWER DASHBOARD ───
function ViewerDashboard({user,onLogout}){
  var [tokens,setTokens]=useState(user.tokens||80);
  var [step,setStep]=useState("gallery");
  var [models,setModels]=useState([]);
  var [selectedModel,setSelectedModel]=useState(null);
  var [prompt,setPrompt]=useState("");
  var [suggestions,setSuggestions]=useState([]);
  var [selectedVideo,setSelectedVideo]=useState(null);
  var [resultUrl,setResultUrl]=useState(null);
  var [loading,setLoading]=useState(false);
  var [errorMsg,setErrorMsg]=useState("");
  var [procMsg,setProcMsg]=useState("");

  var PROC_MSGS=["Gesicht analysieren...","Video suchen...","Face-Swap auf GPU...","Fertigstellen..."];

  useEffect(()=>{
    async function loadModels(){
      var {data,error}=await supabase.from("models").select("*").eq("verified",true);
      if(!error&&data)setModels(data);
    }
    loadModels();
  },[]);

  function searchVideos(){setLoading(true);setTimeout(()=>{setSuggestions(getVideoSuggestions(prompt));setLoading(false);setStep("suggestions");},1200);}

  async function generateAndUnlock(durationSeconds){
    var price=getTokenPrice(durationSeconds);
    if(tokens<price){alert(`Nicht genug Tokens! Brauchst ${price}, hast ${tokens}.`);return;}
    setStep("result");setLoading(true);
    var idx=0;setProcMsg(PROC_MSGS[0]);
    var interval=setInterval(()=>{idx=Math.min(idx+1,PROC_MSGS.length-1);setProcMsg(PROC_MSGS[idx]);},5000);
    try{
      var fd=new FormData();fd.append("prompt",prompt);fd.append("face_url",selectedModel.face_url);
      var res=await fetch(`${BACKEND_URL}/faceswap`,{method:"POST",body:fd});
      clearInterval(interval);
      if(!res.ok){var err=await res.json();throw new Error(err.detail||"Fehler");}
      var data=await res.json();
      setResultUrl(data.video_url);setTokens(t=>t-price);
      await supabase.from("videos").insert({viewer_email:user.email,model_id:selectedModel.id,video_url:data.video_url,prompt,sport:data.sport,tokens_paid:price});
      await supabase.from("models").update({earnings:(selectedModel.earnings||0)+(price*0.9)}).eq("id",selectedModel.id);
    }catch(e){clearInterval(interval);setErrorMsg(e.message);}
    setLoading(false);
  }

  function reset(){setStep("gallery");setSelectedModel(null);setPrompt("");setSuggestions([]);setSelectedVideo(null);setResultUrl(null);setErrorMsg("");}

  if(step==="gallery")return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens}/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <h1 style={{...S.display,fontSize:38,marginBottom:4}}>Wähle dein <span style={{color:"#f59e0b"}}>Model</span></h1>
          <p style={{color:"#5a5e6b",fontSize:14,marginBottom:32}}>Verifizierte Models — deren Gesicht kommt in dein Video</p>
          {models.length===0?(
            <div style={{...S.card,padding:40,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>👤</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Noch keine Models verfügbar</div>
              <div style={{...S.mono,fontSize:11,color:"#3a3d52"}}>Registriere dich als Model um als erstes dabei zu sein!</div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:16}}>
              {models.map(model=>(
                <div key={model.id} className="card-hover" onClick={()=>{setSelectedModel(model);setStep("prompt");}} style={{...S.card,padding:20,textAlign:"center"}}>
                  {model.face_url?<img src={model.face_url} alt={model.name} style={{width:90,height:90,borderRadius:45,objectFit:"cover",border:"3px solid #f59e0b",marginBottom:12,display:"block",margin:"0 auto 12px"}}/>:<div style={{width:90,height:90,borderRadius:45,background:"rgba(245,158,11,0.1)",border:"3px solid #f59e0b",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 12px"}}>👤</div>}
                  <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{model.name||model.email.split("@")[0]}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:8}}>
                    {(model.sports||[]).map(s=>{var sp=SPORTS.find(x=>x.id===s);return sp?<span key={s} style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:`${sp.color}18`,color:sp.color,fontWeight:600}}>{sp.emoji} {sp.label}</span>:null;})}
                  </div>
                  <div style={{...S.mono,fontSize:10,color:"#22c55e"}}>✅ Verifiziert</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if(step==="prompt")return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens}/>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <button onClick={reset} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
            {selectedModel.face_url?<img src={selectedModel.face_url} alt="" style={{width:64,height:64,borderRadius:32,objectFit:"cover",border:"2px solid #f59e0b"}}/>:<div style={{width:64,height:64,borderRadius:32,background:"rgba(245,158,11,0.1)",border:"2px solid #f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>👤</div>}
            <div><div style={{...S.display,fontSize:24}}>{selectedModel.name||selectedModel.email.split("@")[0]}</div><div style={{...S.mono,fontSize:10,color:"#22c55e"}}>✅ Verifiziertes Model</div></div>
          </div>
          <div style={{...S.card,padding:22,marginBottom:20}}>
            <div style={{...S.label,marginBottom:12}}>WAS SOLL DAS MODEL TUN?</div>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="z.B. beim Surfen in Bali auf einer riesigen Welle reiten" style={{...S.input,minHeight:100,resize:"vertical",lineHeight:1.7}}/>
            <div style={{...S.mono,fontSize:10,color:"#1e2030",marginTop:8}}>Verfügbar: {(selectedModel.sports||[]).map(s=>SPORTS.find(x=>x.id===s)?.label).filter(Boolean).join(" · ")}</div>
          </div>
          <button onClick={searchVideos} style={S.btn(prompt.trim().length>5&&!loading)}>{loading?"⏳ Suche Videos...":prompt.trim().length>5?"🔍 3 Video-Vorschläge finden →":"Mindestens 6 Zeichen eingeben"}</button>
        </div>
      </div>
    </div>
  );

  if(step==="suggestions")return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens}/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <button onClick={()=>setStep("prompt")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
          <h1 style={{...S.display,fontSize:32,marginBottom:4}}>3 Video-Vorschläge</h1>
          <p style={{color:"#5a5e6b",fontSize:13,marginBottom:24}}>5 Sekunden gratis · dann mit Tokens freischalten</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",gap:16}}>
            {suggestions.map(video=>(
              <div key={video.id} className="card-hover" onClick={()=>{setSelectedVideo(video);setStep("unlock");}} style={{...S.card,overflow:"hidden"}}>
                <div style={{position:"relative",height:160,overflow:"hidden"}}>
                  <img src={video.thumb} alt={video.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)"}}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,0.6)",borderRadius:30,width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>▶️</div>
                  <div style={{position:"absolute",bottom:10,left:12,right:12}}><div style={{fontWeight:700,fontSize:14}}>{video.title}</div><div style={{...S.mono,fontSize:10,color:"#aaa"}}>{formatDuration(video.duration)}</div></div>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(245,158,11,0.9)",borderRadius:8,padding:"3px 8px",...S.mono,fontSize:10,color:"#000",fontWeight:700}}>5 SEK GRATIS</div>
                </div>
                <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...S.mono,fontSize:10,color:"#5a5e6b"}}>{SPORTS.find(s=>s.id===video.sport)?.emoji} {SPORTS.find(s=>s.id===video.sport)?.label}</div>
                  <div style={{...S.mono,fontSize:11,color:"#f59e0b",fontWeight:700}}>ab 50 Tokens</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if(step==="unlock"&&selectedVideo)return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens}/>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px 16px"}}>
        <div className="fade-up">
          <button onClick={()=>setStep("suggestions")} style={{...S.mono,fontSize:11,color:"#555",background:"none",border:"none",cursor:"pointer",marginBottom:20,padding:0}}>← Zurück</button>
          <h1 style={{...S.display,fontSize:32,marginBottom:20}}>Video freischalten</h1>
          <div style={{...S.card,overflow:"hidden",marginBottom:20}}>
            <div style={{position:"relative",height:200}}>
              <img src={selectedVideo.thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:48,marginBottom:8}}>▶️</div>
                <div style={{...S.mono,fontSize:11,color:"#f59e0b"}}>5 SEKUNDEN VORSCHAU</div>
                <div style={{fontWeight:700,fontSize:16,marginTop:4}}>{selectedVideo.title}</div>
              </div>
            </div>
          </div>
          <div style={{...S.label,marginBottom:14}}>LÄNGE WÄHLEN & FREISCHALTEN</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {[{label:"1 Minute",seconds:60,price:50},{label:"3 Minuten",seconds:180,price:100},{label:"5 Minuten",seconds:300,price:300},{label:"Komplett",seconds:selectedVideo.duration,price:500}].map(opt=>(
              <button key={opt.seconds} onClick={()=>generateAndUnlock(opt.seconds)} disabled={tokens<opt.price}
                style={{padding:"16px 12px",borderRadius:14,textAlign:"center",transition:"all .2s",border:`1px solid ${tokens>=opt.price?"rgba(245,158,11,0.3)":"rgba(255,255,255,0.04)"}`,background:tokens>=opt.price?"rgba(245,158,11,0.06)":"rgba(255,255,255,0.02)",cursor:tokens>=opt.price?"pointer":"not-allowed"}}>
                <div style={{fontWeight:700,fontSize:15,color:tokens>=opt.price?"#eef0f6":"#333",marginBottom:4}}>{opt.label}</div>
                <div style={{...S.mono,fontSize:13,color:tokens>=opt.price?"#f59e0b":"#444",fontWeight:700}}>{opt.price} Tokens</div>
                {tokens<opt.price&&<div style={{...S.mono,fontSize:9,color:"#555",marginTop:4}}>Fehlen {opt.price-tokens}</div>}
              </button>
            ))}
          </div>
          <div style={{...S.mono,fontSize:10,color:"#3a3d52",textAlign:"center"}}>Guthaben: {tokens} Tokens</div>
        </div>
      </div>
    </div>
  );

  if(step==="result")return(
    <div style={S.page}><style>{css}</style>
      <NavBar user={user} onLogout={onLogout} tokens={tokens}/>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px 16px",textAlign:"center"}}>
        <div className="fade-up">
          {loading?(
            <div style={{padding:"80px 0"}}>
              <div className="spin" style={{fontSize:52,display:"inline-block",marginBottom:24}}>⭐</div>
              <div style={{...S.display,fontSize:28,marginBottom:10}}>{procMsg}</div>
              <div style={{...S.mono,fontSize:11,color:"#3a3d52"}}>Bitte nicht schließen · ~30-90 Sek</div>
            </div>
          ):resultUrl?(
            <div>
              <h2 style={{...S.display,fontSize:36,marginBottom:16}}>⭐ Dein Video ist fertig!</h2>
              <video src={resultUrl} controls autoPlay loop style={{width:"100%",borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",background:"#000",marginBottom:20}}/>
              <button onClick={reset} style={S.btn(true)}>← Neues Video erstellen</button>
            </div>
          ):(
            <div style={{padding:"80px 0"}}>
              <div style={{fontSize:44,marginBottom:16}}>⚠️</div>
              <div style={{fontWeight:700,color:"#f87171",marginBottom:8}}>Fehler</div>
              <div style={{...S.mono,fontSize:12,color:"#3a3d52",marginBottom:24}}>{errorMsg}</div>
              <button onClick={reset} style={S.btn(true)}>← Nochmal versuchen</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  var [user,setUser]=useState(null);

  useEffect(()=>{
    supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="SIGNED_IN"&&session&&!user){
        // Auto-login nach Mail-Bestätigung
      }
    });
  },[]);

  if(!user)return <AuthScreen onLogin={setUser}/>;
  if(user.role==="model")return <ModelDashboard user={user} onLogout={()=>setUser(null)}/>;
  return <ViewerDashboard user={user} onLogout={()=>setUser(null)}/>;
}

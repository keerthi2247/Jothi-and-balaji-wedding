import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MapPin, Heart, CalendarDays, Music2, VolumeX, ChevronDown, Sparkles } from "lucide-react";
import "./style.css";

const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Selvam%20Mahal%2C%20116%20Radha%20Nagar%20Main%20Rd%2C%20Chromepet%2C%20Chennai%2C%20Tamil%20Nadu%20600044";
const photos = [
  { src: "/photos/closeup.jpg", alt: "A romantic black and white couple portrait", className: "photo-tall" },
  { src: "/photos/wedding.jpg", alt: "Jotheeswari and Balaji in their wedding attire", className: "photo-wide" },
  { src: "/photos/portrait.jpg", alt: "Jotheeswari and Balaji in traditional outfits", className: "photo-wide" },
  { src: "/photos/romantic-pose.jpg", alt: "A candid romantic moment", className: "photo-tall" },
  { src: "/photos/casual.jpg", alt: "A casual couple photograph", className: "photo-wide" },
  { src: "/photos/celebration.jpg", alt: "Jotheeswari and Balaji celebrating together", className: "photo-wide" },
];


function ScratchReveal() {
  const canvasRef = React.useRef(null);
  const lastPoint = React.useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [scratched, setScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#f5dfcf");
    grad.addColorStop(.48, "#d6ad75");
    grad.addColorStop(1, "#f1d7c5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#704235";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "11px Montserrat, sans-serif";
    ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 12);
    ctx.font = "25px 'Great Vibes', cursive";
    ctx.fillText("our wedding date", rect.width / 2, rect.height / 2 + 15);
    ctx.globalAlpha = .8;
    ctx.font = "20px serif";
    ctx.fillText("✧", rect.width / 2 - 100, rect.height / 2);
    ctx.fillText("✧", rect.width / 2 + 100, rect.height / 2);
    ctx.globalAlpha = 1;
  }, []);

  const pointFrom = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (e) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const p = pointFrom(e);
    const dpr = canvas.width / canvas.getBoundingClientRect().width;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 42;
    ctx.beginPath();
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(p.x, p.y);
    } else {
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.1, p.y + 0.1);
    }
    ctx.stroke();
    lastPoint.current = p;
    setScratched(true);

    // Check the scratch coverage occasionally to keep touch movement responsive.
    if (Math.random() < 0.12) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 80) clear++;
      if (clear / (data.length / 4) > 0.34) setRevealed(true);
    }
  };

  return (
    <div className={`scratch-card ${revealed ? "is-revealed" : ""}`}>
      <div className="scratch-date">
        <span className="scratch-label">SAVE THE DATE</span>
        <strong>15 · 11 · 2026</strong>
        <span className="scratch-caption">Jotheeswari &amp; Balaji</span>
      </div>
      {!revealed && <canvas ref={canvasRef} className="scratch-layer"
        onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); lastPoint.current = null; scratch(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) scratch(e); }}
        onPointerUp={() => { lastPoint.current = null; }}
        onPointerCancel={() => { lastPoint.current = null; }}
        aria-label="Scratch this card with your finger or mouse to reveal the wedding date" />}
      {!revealed && <span className="scratch-hint">{scratched ? "Keep scratching to reveal the date" : "Use your finger or mouse to scratch"}</span>}
    </div>
  );
}
function App() {
  const [opened, setOpened] = useState(false);
  const [sound, setSound] = useState(false);
  const audioRef = React.useRef(null);
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date("2026-11-15T00:00:00+05:30").getTime() - Date.now());
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="none" />
      <button className="sound-toggle" onClick={async () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (sound) { audio.pause(); setSound(false); }
        else { try { await audio.play(); setSound(true); } catch { alert("Add a royalty-free music file named bgm.mp3 inside the public folder to enable background music."); } }
      }} aria-label="Toggle background music">
        {sound ? <Music2 size={15}/> : <VolumeX size={15}/>} <span>{sound ? "PAUSE MUSIC" : "PLAY MUSIC"}</span>
      </button>

      <section className="cover" id="home">
        <div className="cover-image" />
        <div className="cover-shade" />
        <div className="cover-content">
          <div className="small-caps light">Together with our families</div>
          <div className="ornament">❧</div>
          <p className="script cover-intro">With love & joy,</p>
          <h1>Jotheeswari <span>&amp;</span><br/>Balaji</h1>
          <div className="thin-rule"><i>✦</i></div>
          <p className="cover-copy">invite you to celebrate the beginning<br/>of their forever</p>
          <button className="outline-button" onClick={() => { setOpened(true); scrollTo("invitation"); }}>
            {opened ? "EXPLORE INVITATION" : "OPEN INVITATION"} <ChevronDown size={14}/>
          </button>
        </div>
        <div className="cover-bottom">A DAY TO REMEMBER · A LOVE TO TREASURE</div>
      </section>

      <section className="intro-section section-pad" id="invitation">
        <div className="section-kicker">THE BEGINNING OF FOREVER</div>
        <h2 className="serif">Two hearts. <em>One love.</em></h2>
        <div className="tiny-flower">✿</div>
        <p className="body-copy">With the blessings of our families, we invite you to be part of our special day and share in the joy of our new beginning.</p>
        <div className="name-lockup"><span className="script">Jotheeswari</span><span className="name-amp">&amp;</span><span className="script">Balaji</span></div>
        <div className="parents-grid">
          <div className="parent-card">
            <span className="parent-label">DAUGHTER OF</span>
            <p><strong>P. Karthikeyan</strong><br/><span>&amp;</span><br/><strong>K. Kanchana</strong></p>
            <div className="parent-rule">✧</div>
            <span className="parent-child">P. Jotheeswari</span>
          </div>
          <div className="parent-card">
            <span className="parent-label">SON OF</span>
            <p><strong>K. Veerabathran</strong><br/><span>&amp;</span><br/><strong>V. Malliga</strong></p>
            <div className="parent-rule">✧</div>
            <span className="parent-child">V. Balaji</span>
          </div>
        </div>
        <div className="scratch-intro">A little surprise awaits…</div>
        <ScratchReveal />
      </section>

      <section className="feature">
        <img src="/photos/wedding.jpg" alt="Jotheeswari and Balaji on their wedding day"/>
        <div className="feature-caption"><span className="script">The start of our forever</span><Heart size={16} fill="currentColor"/></div>
      </section>

      <section className="count-section section-pad">
        <div className="section-kicker">COUNTING DOWN TO OUR DAY</div>
        <h2 className="serif">Until we say <em>“I do”</em></h2>
        <div className="countdown">
          {Object.entries(remaining).map(([label, value]) => <div className="count-item" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label.toUpperCase()}</span></div>)}
        </div>
        <p className="count-note script">The best is yet to come...</p>
      </section>

      <section className="events-section section-pad" id="celebration">
        <div className="section-kicker">SAVE THE DATES</div>
        <h2 className="serif">Wedding <em>celebrations</em></h2>
        <div className="event-grid">
          <article className="event-card">
            <div className="event-icon"><Heart size={22}/></div>
            <div className="section-kicker">THE EVENING BEFORE</div>
            <h3 className="serif">Wedding Reception</h3>
            <p className="event-date">SATURDAY · 14 NOVEMBER 2026</p>
            <p>We would be delighted to celebrate this joyful occasion with you.</p>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="map-link"><MapPin size={15}/> VIEW LOCATION</a>
          </article>
          <article className="event-card">
            <div className="event-icon"><Sparkles size={22}/></div>
            <div className="section-kicker">OUR SPECIAL DAY</div>
            <h3 className="serif">Wedding Ceremony</h3>
            <p className="event-date">SUNDAY · 15 NOVEMBER 2026</p>
            <p>Your presence and blessings will make our day truly memorable.</p>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="map-link"><MapPin size={15}/> OPEN MAP</a>
          </article>
        </div>
      </section>

      <section className="gallery-section section-pad" id="gallery">
        <div className="section-kicker">LITTLE MOMENTS, BIG MEMORIES</div>
        <h2 className="serif">Our <em>love story</em></h2>
        <p className="body-copy">Every picture holds a memory. Every memory brings us closer to forever.</p>
        <div className="gallery-grid">
          {photos.map((photo, index) => <figure className={`gallery-photo ${photo.className}`} key={photo.src}>
            <img src={photo.src} alt={photo.alt} loading={index > 1 ? "lazy" : "eager"}/>
          </figure>)}
        </div>
      </section>

      <section className="siblings-section section-pad" id="family">
        <div className="section-kicker">WITH LOVE FROM OUR FAMILIES</div>
        <h2 className="serif">Our <em>brothers &amp; sisters</em></h2>
        <p className="body-copy">With love and blessings from the people who make our lives special.</p>
        <div className="siblings-grid">
          <div className="siblings-card">
            <ul>
              <li>K. Harish</li><li>K. Deepika</li><li>K. Prashant</li><li>K. Hemnath</li>
              <li>D. Oviya</li><li>D. Surya</li><li>G. Keerthana</li><li>G. Krishna Priya</li>
            </ul>
          </div>
          <div className="siblings-card">
            <ul>
              <li>K. Harini</li><li>K. Harish</li><li>K. Abinaya</li><li>K. Dhamodharan</li>
              <li>M. Dheekshitha</li><li>M. Pragatheesh</li><li>V. Saidhivya</li><li>V. Vaishnavi</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing-ornament">❧</div>
        <p className="script">We can't wait to celebrate with you</p>
        <h2 className="serif">With love, always</h2>
        <div className="closing-names">Jotheeswari <span>&amp;</span> Balaji</div>
        <p className="closing-date">14 &amp; 15 NOVEMBER 2026</p>
        <a href={MAP_URL} target="_blank" rel="noreferrer" className="final-map"><MapPin size={16}/> FIND THE VENUE</a>
        <div className="footer-flower">✿</div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

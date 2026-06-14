"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./duniya.module.css";

interface Star    { id: number; top: number; left: number; size: number; delay: number; duration: number; }
interface Asteroid { id: number; angle: number; radius: number; size: number; opacity: number; delay: number; duration: number; }
interface ShootingStar { id: number; top: number; left: number; }

function Typewriter({ text, speed = 35 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(iv); }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

type PlanetId = "SUN"|"MERCURY"|"VENUS"|"EARTH"|"MARS"|"JUPITER"|"SATURN"|"URANUS"|"NEPTUNE";

const PLANET_IMAGES: Record<PlanetId, string> = {
  SUN:"/images/planets/sun1.png", MERCURY:"/images/planets/mercury.png",
  VENUS:"/images/planets/venus.png", EARTH:"/images/planets/earth.png",
  MARS:"/images/planets/mars.png", JUPITER:"/images/planets/jupiter.png",
  SATURN:"/images/planets/saturn.png", URANUS:"/images/planets/uranus.png",
  NEPTUNE:"/images/planets/neptune.png",
};

/* Size comparison data — real radii in km */
const SIZE_DATA: { id: PlanetId; name: string; radiusKm: number; glow: string; capped?: boolean }[] = [
  { id:"SUN",     name:"SUN",     radiusKm:695700, glow:"#ffaa00", capped:true  },
  { id:"MERCURY", name:"MERCURY", radiusKm:2440,   glow:"#b0b0b0" },
  { id:"VENUS",   name:"VENUS",   radiusKm:6052,   glow:"#ffb347" },
  { id:"EARTH",   name:"EARTH",   radiusKm:6371,   glow:"#4fc3f7" },
  { id:"MARS",    name:"MARS",    radiusKm:3390,   glow:"#ff6b35" },
  { id:"JUPITER", name:"JUPITER", radiusKm:69911,  glow:"#d4967a" },
  { id:"SATURN",  name:"SATURN",  radiusKm:58232,  glow:"#e8c97a" },
  { id:"URANUS",  name:"URANUS",  radiusKm:25362,  glow:"#7fffd4" },
  { id:"NEPTUNE", name:"NEPTUNE", radiusKm:24622,  glow:"#4169e1" },
];

const SCALE_REF = 69911; // Jupiter's radius = reference
const SCALE_PX  = 90;    // Jupiter displays at 90px

function displayPx(radiusKm: number, capped?: boolean): number {
  const raw = (radiusKm / SCALE_REF) * SCALE_PX;
  if (capped) return Math.min(raw, 180); // sun capped at 180px for display
  return Math.max(6, raw);               // minimum 6px so tiny planets are visible
}

interface PlanetInfo {
  title: string;
  stats: { label: string; value: string }[];
  facts: string[];
  wiki: string;
  trueScaleLink?: boolean;
}

const PLANET_INFO: Record<PlanetId, PlanetInfo> = {
  SUN: {
    title:"THE SUN",
    stats:[
      {label:"TYPE",         value:"G-TYPE MAIN-SEQUENCE STAR"},
      {label:"DIAMETER",     value:"1,391,000 KM"},
      {label:"SURFACE TEMP", value:"~5,500 °C"},
      {label:"CORE TEMP",    value:"~15,000,000 °C"},
      {label:"AGE",          value:"~4.6 BILLION YEARS"},
      {label:"MASS",         value:"99.86% OF SOLAR SYSTEM"},
    ],
    facts:[
      "The Sun loses about 4 million tonnes of mass every second through nuclear fusion.",
      "Light from the Sun takes ~8 minutes 20 seconds to reach Earth.",
      "The Sun completes one rotation every 25 days at its equator but 35 days at its poles.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Sun",
    trueScaleLink:true,
  },
  MERCURY: {
    title:"MERCURY",
    stats:[
      {label:"TYPE",             value:"TERRESTRIAL PLANET"},
      {label:"DISTANCE FROM SUN",value:"57,900,000 KM (0.39 AU)"},
      {label:"RADIUS",           value:"2,439.7 KM"},
      {label:"MOONS",            value:"0"},
      {label:"ORBIT PERIOD",     value:"88 EARTH DAYS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Despite being closest to the Sun, Mercury is not the hottest planet — its lack of atmosphere lets heat escape rapidly.",
      "A day on Mercury (sunrise to sunrise) lasts 176 Earth days — longer than its year.",
      "Mercury's core makes up about 85% of its radius, the largest core-to-planet ratio in the solar system.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Mercury_(planet)",
  },
  VENUS: {
    title:"VENUS",
    stats:[
      {label:"TYPE",             value:"TERRESTRIAL PLANET"},
      {label:"DISTANCE FROM SUN",value:"108,200,000 KM (0.72 AU)"},
      {label:"RADIUS",           value:"6,051.8 KM"},
      {label:"MOONS",            value:"0"},
      {label:"ORBIT PERIOD",     value:"225 EARTH DAYS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Venus rotates backwards compared to most planets — the Sun rises in the west and sets in the east.",
      "A day on Venus is longer than its year: it takes 243 Earth days to rotate once.",
      "Venus has more volcanoes than any other planet — over 1,600 major ones identified.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Venus",
  },
  EARTH: {
    title:"EARTH",
    stats:[
      {label:"TYPE",             value:"TERRESTRIAL PLANET"},
      {label:"DISTANCE FROM SUN",value:"149,600,000 KM (1 AU)"},
      {label:"RADIUS",           value:"6,371 KM"},
      {label:"MOONS",            value:"1 (THE MOON)"},
      {label:"ORBIT PERIOD",     value:"365.25 DAYS"},
      {label:"AGE",              value:"~4.54 BILLION YEARS"},
    ],
    facts:[
      "Earth is the only known planet with plate tectonics, which recycles carbon and helps regulate climate.",
      "The Moon is slowly drifting away from Earth at about 3.8 cm per year.",
      "Earth's magnetic field is generated by molten iron flowing in the outer core — without it, solar wind would strip our atmosphere.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Earth",
  },
  MARS: {
    title:"MARS",
    stats:[
      {label:"TYPE",             value:"TERRESTRIAL PLANET"},
      {label:"DISTANCE FROM SUN",value:"227,900,000 KM (1.52 AU)"},
      {label:"RADIUS",           value:"3,389.5 KM"},
      {label:"MOONS",            value:"2 (PHOBOS & DEIMOS)"},
      {label:"ORBIT PERIOD",     value:"687 EARTH DAYS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Olympus Mons on Mars is the tallest volcano in the solar system at ~22 km — nearly 3× the height of Everest.",
      "Mars has the largest dust storms in the solar system, sometimes covering the entire planet for months.",
      "Phobos is spiralling inward and will either crash into Mars or break apart into a ring in ~50 million years.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Mars",
  },
  JUPITER: {
    title:"JUPITER",
    stats:[
      {label:"TYPE",             value:"GAS GIANT"},
      {label:"DISTANCE FROM SUN",value:"778,500,000 KM (5.2 AU)"},
      {label:"RADIUS",           value:"69,911 KM"},
      {label:"MOONS",            value:"95 (CONFIRMED)"},
      {label:"ORBIT PERIOD",     value:"11.86 EARTH YEARS"},
      {label:"AGE",              value:"~4.6 BILLION YEARS"},
    ],
    facts:[
      "Jupiter's Great Red Spot is a storm that has persisted for at least 350 years — and is shrinking.",
      "Jupiter has the shortest day of any planet, completing a rotation in just under 10 hours despite its massive size.",
      "Jupiter acts as a cosmic shield — its gravity deflects and absorbs many asteroids and comets that would otherwise hit the inner planets.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Jupiter",
  },
  SATURN: {
    title:"SATURN",
    stats:[
      {label:"TYPE",             value:"GAS GIANT"},
      {label:"DISTANCE FROM SUN",value:"1,432,000,000 KM (9.58 AU)"},
      {label:"RADIUS",           value:"58,232 KM"},
      {label:"MOONS",            value:"274 (CONFIRMED)"},
      {label:"ORBIT PERIOD",     value:"29.5 EARTH YEARS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Saturn is the least dense planet — less dense than water, meaning it would theoretically float in a giant ocean.",
      "Saturn's rings are incredibly thin: up to 282,000 km wide but only about 10–100 metres thick.",
      "Saturn's moon Titan has lakes and rivers of liquid methane — the only body other than Earth with stable surface liquids.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Saturn",
  },
  URANUS: {
    title:"URANUS",
    stats:[
      {label:"TYPE",             value:"ICE GIANT"},
      {label:"DISTANCE FROM SUN",value:"2,867,000,000 KM (19.2 AU)"},
      {label:"RADIUS",           value:"25,362 KM"},
      {label:"MOONS",            value:"28 (CONFIRMED)"},
      {label:"ORBIT PERIOD",     value:"84 EARTH YEARS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Uranus rotates on an axial tilt of 98° — it essentially rolls around the Sun on its side.",
      "Uranus is the coldest planetary atmosphere in the solar system at −224 °C, despite not being the farthest from the Sun.",
      "Uranus's moons are uniquely named after characters from Shakespeare and Alexander Pope, not mythology.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Uranus",
  },
  NEPTUNE: {
    title:"NEPTUNE",
    stats:[
      {label:"TYPE",             value:"ICE GIANT"},
      {label:"DISTANCE FROM SUN",value:"4,515,000,000 KM (30.2 AU)"},
      {label:"RADIUS",           value:"24,622 KM"},
      {label:"MOONS",            value:"16 (CONFIRMED)"},
      {label:"ORBIT PERIOD",     value:"164.8 EARTH YEARS"},
      {label:"AGE",              value:"~4.5 BILLION YEARS"},
    ],
    facts:[
      "Neptune has the strongest winds in the solar system — up to 2,100 km/h, faster than the speed of sound on Earth.",
      "Neptune was the first planet predicted mathematically before it was observed — its gravity was deduced from Uranus's irregular orbit.",
      "Neptune's largest moon Triton orbits backwards (retrograde) and is slowly spiralling inward — it will be torn apart in ~3.6 billion years.",
    ],
    wiki:"https://en.wikipedia.org/wiki/Neptune",
  },
};

export default function PlanetsPage() {
  const [stars, setStars]                   = useState<Star[]>([]);
  const [asteroids, setAsteroids]           = useState<Asteroid[]>([]);
  const [shootingStars, setShootingStars]   = useState<ShootingStar[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId | null>(null);
  const [isScanning, setIsScanning]         = useState(false);
  const [scanStep, setScanStep]             = useState(0);
  const [showModal, setShowModal]           = useState(false);
  const [modalOrigin, setModalOrigin]       = useState({ x: 50, y: 50 });
  const [sunPhase, setSunPhase]             = useState<1 | 2>(1);
  const [loading, setLoading]               = useState(true);
  const [loadingFade, setLoadingFade]       = useState(false);
  const [showSizeMode, setShowSizeMode]     = useState(false);
  const shootingIdRef                       = useRef(0);

  // Loading screen
  useEffect(() => {
    const f = setTimeout(() => setLoadingFade(true), 2800);
    const r = setTimeout(() => setLoading(false),    3600);
    return () => { clearTimeout(f); clearTimeout(r); };
  }, []);

  // Background stars
  useEffect(() => {
    setStars(Array.from({ length: 200 }, (_, i) => ({
      id: i, top: Math.random()*100, left: Math.random()*100,
      size: Math.random()*2+1, delay: Math.random()*5, duration: 2+Math.random()*3,
    })));
  }, []);

  // Asteroid belt — 200 rocks between Mars and Jupiter orbit radii (178–208px)
  useEffect(() => {
    setAsteroids(Array.from({ length: 200 }, (_, i) => ({
      id:       i,
      angle:    (i / 200) * 360 + Math.random() * 4 - 2,
      radius:   178 + Math.random() * 30,
      size:     1 + Math.random() * 1.8,
      opacity:  0.15 + Math.random() * 0.55,
      delay:    Math.random() * 10,
      duration: 3 + Math.random() * 6,
    })));
  }, []);

  // Sun crossfade every 3 s
  useEffect(() => {
    const t = setInterval(() => setSunPhase(p => p === 1 ? 2 : 1), 3000);
    return () => clearInterval(t);
  }, []);

  // Shooting star every 20 s
  useEffect(() => {
    const spawn = () => {
      const id = shootingIdRef.current++;
      setShootingStars(p => [...p, { id, top: 5+Math.random()*40, left: 5+Math.random()*60 }]);
      setTimeout(() => setShootingStars(p => p.filter(s => s.id !== id)), 1400);
    };
    const init = setTimeout(spawn, 5000);
    const iv   = setInterval(spawn, 20000);
    return () => { clearTimeout(init); clearInterval(iv); };
  }, []);

  const handleScan = (planet: PlanetId, e: React.MouseEvent) => {
    const cx = e.clientX, cy = e.clientY;
    setShowModal(false); setSelectedPlanet(null);
    setIsScanning(true); setScanStep(1);
    setTimeout(() => setScanStep(2), 900);
    setTimeout(() => setScanStep(3), 1800);
    setTimeout(() => {
      setIsScanning(false); setScanStep(0);
      setSelectedPlanet(planet);
      setModalOrigin({ x: cx, y: cy });
      setShowModal(true);
    }, 2700);
  };

  const info = selectedPlanet ? PLANET_INFO[selectedPlanet] : null;

  return (
    <div className={styles.space}>

      {/* ── Loading screen ── */}
      {loading && (
        <div className={`${styles.loadingOverlay} ${loadingFade ? styles.fadeOut : ""}`}>
          <div className={styles.loadingTitle}>◈ Get Ready ◈</div>
          <div className={styles.loadingBar}><div className={styles.loadingBarFill} /></div>
          <div className={styles.loadingLines}>
            <div className={styles.loadingLine}>&gt; INITIALISING SOLAR DATABASE...</div>
            <div className={styles.loadingLine}>&gt; LOADING PLANETARY ASSETS...</div>
            <div className={styles.loadingLine}>&gt; CALIBRATING ORBIT PATHS...</div>
            <div className={styles.loadingLine}>&gt; SYSTEM READY</div>
          </div>
        </div>
      )}

      {/* ── Background stars ── */}
      {stars.map(s => (
        <div key={s.id} className={styles.star} style={{
          top:`${s.top}%`, left:`${s.left}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          animationDelay:`${s.delay}s`, animationDuration:`${s.duration}s`,
        }} />
      ))}

      {/* ── Shooting stars ── */}
      {shootingStars.map(s => (
        <div key={s.id} className={styles.shootingStar} style={{ top:`${s.top}%`, left:`${s.left}%` }} />
      ))}

      {/* ── Asteroid belt (between Mars 170px radius and Jupiter 215px radius) ── */}
      <div className={styles.asteroidBelt}>
        {asteroids.map(a => (
          <div key={a.id} className={styles.asteroid} style={{
            left: `${Math.cos(a.angle * Math.PI / 180) * a.radius}px`,
            top:  `${Math.sin(a.angle * Math.PI / 180) * a.radius}px`,
            width:`${a.size}px`, height:`${a.size}px`,
            opacity: a.opacity,
            animationDelay:`${a.delay}s`,
            animationDuration:`${a.duration}s`,
          }} />
        ))}
      </div>

      {/* ── Sun ── */}
      <button className={styles.sun} onClick={e => handleScan("SUN", e)}>
        <div className={styles.sunImgContainer}>
          <img src="/images/planets/sun1.png" alt="Sun 1"
            className={`${styles.sunImg} ${sunPhase===1?styles.sunImgActive:""}`} />
          <img src="/images/planets/sun2.png" alt="Sun 2"
            className={`${styles.sunImg} ${sunPhase===2?styles.sunImgActive:""}`} />
        </div>
        <span className={styles.tooltip}>THE SUN</span>
      </button>

      {/* ── Scale disclaimer ── */}
      <div className={styles.scaleNote}>
        <span>This project doesn&apos;t show true scale.</span>
        <a href="https://joshworth.com/dev/pixelspace/pixelspace_solarsystem.html"
           target="_blank" rel="noopener noreferrer">Click here to know why?</a>
      </div>

      {/* ── Planets with tooltips ── */}
      <div className={styles.mercuryOrbit}>
        <button className={styles.mercury} onClick={e => handleScan("MERCURY", e)}>
          <img src="/images/planets/mercury.png" alt="Mercury" />
          <span className={styles.tooltip}>MERCURY</span>
        </button>
      </div>

      <div className={styles.venusOrbit}>
        <button className={styles.venus} onClick={e => handleScan("VENUS", e)}>
          <img src="/images/planets/venus.png" alt="Venus" />
          <span className={styles.tooltip}>VENUS</span>
        </button>
      </div>

      <div className={styles.earthOrbit}>
        <button className={styles.earth} onClick={e => handleScan("EARTH", e)}>
          <img src="/images/planets/earth.png" alt="Earth" />
          <span className={styles.tooltip}>EARTH</span>
        </button>
      </div>

      <div className={styles.marsOrbit}>
        <button className={styles.mars} onClick={e => handleScan("MARS", e)}>
          <img src="/images/planets/mars.png" alt="Mars" />
          <span className={styles.tooltip}>MARS</span>
        </button>
      </div>

      <div className={styles.jupiterOrbit}>
        <button className={styles.jupiter} onClick={e => handleScan("JUPITER", e)}>
          <img src="/images/planets/jupiter.png" alt="Jupiter" />
          <span className={styles.tooltip}>JUPITER</span>
        </button>
      </div>

      <div className={styles.saturnOrbit}>
        <button className={styles.saturn} onClick={e => handleScan("SATURN", e)}>
          <img src="/images/planets/saturn.png" alt="Saturn" />
          <span className={styles.tooltip}>SATURN</span>
        </button>
      </div>

      <div className={styles.uranusOrbit}>
        <button className={styles.uranus} onClick={e => handleScan("URANUS", e)}>
          <img src="/images/planets/uranus.png" alt="Uranus" />
          <span className={styles.tooltip}>URANUS</span>
        </button>
      </div>

      <div className={styles.neptuneOrbit}>
        <button className={styles.neptune} onClick={e => handleScan("NEPTUNE", e)}>
          <img src="/images/planets/neptune.png" alt="Neptune" />
          <span className={styles.tooltip}>NEPTUNE</span>
        </button>
      </div>

      {/* ── Retro monitor ── */}
      <div className={styles.monitor}>
        <img src="/images/retro/monitor.png" alt="Monitor" className={styles.monitorImg} />
        <div className={styles.monitorScreen}>
          {isScanning ? (
            <>
              {scanStep >= 1 && <p><Typewriter text="> SCANNING..."        /></p>}
              {scanStep >= 2 && <p><Typewriter text="> TARGET LOCKED"      /></p>}
              {scanStep >= 3 && <p><Typewriter text="> RETRIEVING DATA..." /></p>}
            </>
          ) : selectedPlanet ? (
            <>
              <p>{">"} TARGET : {selectedPlanet}</p>
              <p>{">"} DATA RETRIEVED</p>
              <p>{">"} OPENING FILE</p>
            </>
          ) : (
            <>
              <p>{">"} PLANET DATABASE</p>
              <p>{">"} CLICK A PLANET TO SCAN</p>
              <button className={styles.monitorBtn} onClick={() => setShowSizeMode(true)}>
                [SIZE COMPARE]
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Size comparison overlay ── */}
      {showSizeMode && (
        <div className={styles.sizeModeOverlay} onClick={() => setShowSizeMode(false)}>
          <div className={styles.sizeModePanel} onClick={e => e.stopPropagation()}>

            <div className={styles.sizeModeHeader}>
              <span>{">"} SIZE COMPARISON — radii to scale (Jupiter = 90px)</span>
              <button className={styles.closeBtn} onClick={() => setShowSizeMode(false)}>✕</button>
            </div>

            <div className={styles.sizeModeRow}>
              {SIZE_DATA.map(planet => {
                const px = displayPx(planet.radiusKm, planet.capped);
                return (
                  <div key={planet.id} className={styles.sizeItem}>
                    {/* Planet image scaled to display size */}
                    <div className={styles.sizeImgWrap} style={{ width: px, height: px }}>
                      <img
                        src={PLANET_IMAGES[planet.id]}
                        alt={planet.name}
                        className={styles.sizeImg}
                        style={{ filter: `drop-shadow(0 0 ${planet.capped ? 20 : 6}px ${planet.glow})` }}
                      />
                    </div>
                    <span className={styles.sizeName}>{planet.name}</span>
                    <span className={styles.sizeKm}>
                      {planet.radiusKm.toLocaleString()} km
                    </span>
                    {planet.capped && (
                      <span className={styles.sizeCapped}>*capped</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.sizeModeNote}>
              * Sun radius capped at 180px for display — true proportional size would be ~895px here.
              Rocky planets (Mercury, Venus, Earth, Mars) appear as dots next to gas giants — that is accurate.
            </div>
          </div>
        </div>
      )}

      {/* ── Planet data modal ── */}
      {showModal && selectedPlanet && info && (
        <div className={styles.modalOverlay} onClick={() => { setShowModal(false); setSelectedPlanet(null); }}>
          <div
            className={styles.tvWrapper}
            style={{ "--ox":`${modalOrigin.x}px`, "--oy":`${modalOrigin.y}px` } as React.CSSProperties}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.tvBezel}>
              <div className={styles.tvScreen}>
                <div className={styles.modal}>
                  <div className={styles.modalHeader}>
                    <span className={styles.modalHeaderTitle}>
                      {">"} PLANETARY DATABASE &nbsp;/&nbsp; {info.title}
                    </span>
                    <button className={styles.closeBtn} onClick={() => { setShowModal(false); setSelectedPlanet(null); }}>✕</button>
                  </div>
                  <div className={styles.modalContent}>
                    <div className={styles.planetImageBox}>
                      <img src={PLANET_IMAGES[selectedPlanet]} alt={info.title} className={styles.planetImage} />
                      <span className={styles.planetImageLabel}>{info.title}</span>
                    </div>
                    <div className={styles.infoGrid}>
                      {info.stats.map((s, i) => (
                        <div key={i} className={styles.infoRow}>
                          <span>{">"} {s.label} :</span>{s.value}
                        </div>
                      ))}
                    </div>
                    <div className={styles.factsSection}>
                      <div className={styles.factsTitle}>{">"} LESSER-KNOWN FACTS</div>
                      {info.facts.map((f, i) => <div key={i} className={styles.factItem}>{f}</div>)}
                    </div>
                    <div className={styles.wikiLine}>
                      {">"} TO KNOW MORE :{" "}
                      <a href={info.wiki} target="_blank" rel="noopener noreferrer" className={styles.wikiLink}>
                        {info.wiki}
                      </a>
                    </div>
                    {info.trueScaleLink && (
                      <div className={styles.wikiLine}>
                        {">"} TRUE SCALE :{" "}
                        <a href="https://joshworth.com/dev/pixelspace/pixelspace_solarsystem.html"
                           target="_blank" rel="noopener noreferrer" className={styles.wikiLink}>
                          Click here to see why this project can&apos;t show true scale
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.tvBottom}>
              <span className={styles.tvBrand}>DUNIYA&nbsp;&nbsp;◈&nbsp;&nbsp;SOLAR EXPLORER</span>
              <div className={styles.tvButtons}>
                <div className={styles.tvBtn} />
                <div className={styles.tvBtn} />
                <div className={styles.tvBtnGreen} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
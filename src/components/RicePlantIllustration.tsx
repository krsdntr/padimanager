import React from 'react';

interface Props {
  progress: number; // 0–100
}

// Stage 1: Bibit (0–19%) — delicate, light green, small leaves
function Seedling() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant drop-shadow-sm">
      <defs>
        <linearGradient id="s1-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <radialGradient id="s1-leaf" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="80%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      
      {/* Soil base */}
      <path d="M25 160 Q60 152 95 160 Q105 165 95 170 Q60 178 25 170 Q15 165 25 160 Z" fill="url(#soil)" opacity="0.9" />
      
      {/* Main tiny stem */}
      <path d="M58 160 Q60 150 62 130 Q63 115 60 100 Q58 115 56 130 Q57 150 58 160" fill="url(#s1-stem)" />
      
      <g className="leaf-sway" style={{ transformOrigin: '60px 150px' }}>
        {/* Left leaf */}
        <path d="M59 135 C45 130 35 120 30 105 C35 112 45 118 59 125 Z" fill="url(#s1-leaf)" />
        {/* Right leaf */}
        <path d="M61 120 C75 115 85 105 90 90 C85 98 75 108 61 112 Z" fill="url(#s1-leaf)" />
        {/* Top small leaf */}
        <path d="M60 102 C55 90 52 80 50 65 C55 75 58 85 60 95 Z" fill="url(#s1-leaf)" />
      </g>
    </svg>
  );
}

// Stage 2: Vegetatif (20–39%) — taller, darker greens, wider spreading
function Vegetative() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant drop-shadow-md">
      <defs>
        <linearGradient id="s2-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="s2-leaf-l" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="s2-leaf-r" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      <path d="M15 160 Q60 150 105 160 Q115 165 105 170 Q60 178 15 170 Q5 165 15 160 Z" fill="url(#soil)" opacity="0.9" />

      {/* Main stem cluster */}
      <path d="M56 160 C58 130 55 90 60 70 C62 90 64 130 62 160 Z" fill="url(#s2-stem)" />
      <path d="M54 160 C50 140 48 110 50 90 C53 110 57 140 56 160 Z" fill="url(#s2-stem)" />
      <path d="M64 160 C68 140 72 110 70 90 C67 110 63 140 62 160 Z" fill="url(#s2-stem)" />

      {/* Left leaves group */}
      <g className="leaf-sway" style={{ transformOrigin: '50px 140px' }}>
        <path d="M55 140 C35 130 20 110 12 85 C22 100 35 118 55 130 Z" fill="url(#s2-leaf-l)" />
        <path d="M52 115 C35 105 25 85 20 60 C28 75 40 95 53 105 Z" fill="url(#s2-leaf-l)" />
        <path d="M51 95 C40 85 30 65 28 45 C35 58 43 78 54 88 Z" fill="url(#s2-leaf-l)" />
      </g>

      {/* Right leaves group */}
      <g className="leaf-sway-alt" style={{ transformOrigin: '70px 140px' }}>
        <path d="M65 130 C85 120 100 100 108 75 C98 90 85 108 65 120 Z" fill="url(#s2-leaf-r)" />
        <path d="M68 105 C85 95 95 75 100 50 C92 65 80 85 67 95 Z" fill="url(#s2-leaf-r)" />
        <path d="M68 85 C78 75 88 55 90 35 C83 48 75 68 66 78 Z" fill="url(#s2-leaf-r)" />
      </g>
    </svg>
  );
}

// Stage 3: Anakan (40–59%) — dense bush, many stems, darker base
function Tillering() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant drop-shadow-md">
      <defs>
        <linearGradient id="s3-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="50%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="s3-leaf-l" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="s3-leaf-r" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      <path d="M10 160 Q60 145 110 160 Q120 165 110 170 Q60 180 10 170 Q0 165 10 160 Z" fill="url(#soil)" opacity="0.9" />

      {/* 5 base stems creating a dense cluster */}
      <path d="M42 160 C30 130 25 90 28 65 C32 90 38 130 46 160 Z" fill="url(#s3-stem)" />
      <path d="M78 160 C90 130 95 90 92 65 C88 90 82 130 74 160 Z" fill="url(#s3-stem)" />
      <path d="M50 160 C40 120 42 70 48 40 C50 70 52 120 54 160 Z" fill="url(#s3-stem)" />
      <path d="M70 160 C80 120 78 70 72 40 C70 70 68 120 66 160 Z" fill="url(#s3-stem)" />
      <path d="M58 160 C60 110 58 50 60 20 C62 50 63 110 62 160 Z" fill="url(#s3-stem)" />

      {/* Extreme left leaves */}
      <g className="leaf-sway" style={{ transformOrigin: '40px 140px' }}>
        <path d="M45 145 C25 135 10 115 5 90 C15 105 28 125 48 135 Z" fill="url(#s3-leaf-l)" />
        <path d="M38 115 C20 105 5 85 2 60 C12 75 25 95 42 105 Z" fill="url(#s3-leaf-l)" />
      </g>

      {/* Mid left leaves */}
      <g className="leaf-sway-alt" style={{ transformOrigin: '50px 120px' }}>
        <path d="M52 120 C35 110 20 85 15 55 C25 70 38 95 54 110 Z" fill="url(#s3-leaf-l)" />
        <path d="M50 90 C35 80 25 55 22 25 C30 40 40 65 52 80 Z" fill="url(#s3-leaf-l)" />
      </g>

      {/* Mid right leaves */}
      <g className="leaf-sway" style={{ transformOrigin: '70px 120px' }}>
        <path d="M68 120 C85 110 100 85 105 55 C95 70 82 95 66 110 Z" fill="url(#s3-leaf-r)" />
        <path d="M70 90 C85 80 95 55 98 25 C90 40 80 65 68 80 Z" fill="url(#s3-leaf-r)" />
      </g>

      {/* Extreme right leaves */}
      <g className="leaf-sway-alt" style={{ transformOrigin: '80px 140px' }}>
        <path d="M75 145 C95 135 110 115 115 90 C105 105 92 125 72 135 Z" fill="url(#s3-leaf-r)" />
        <path d="M82 115 C100 105 115 85 118 60 C108 75 95 95 78 105 Z" fill="url(#s3-leaf-r)" />
      </g>
    </svg>
  );
}

// Stage 4: Heading (60–79%) — emergence of green panicles from top leaves
function Heading() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant drop-shadow-lg">
      <defs>
        <linearGradient id="s4-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="50%" stopColor="#166534" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="s4-leaf-l" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="40%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <linearGradient id="s4-leaf-r" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="40%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <radialGradient id="panicle-green" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="80%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </radialGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      <path d="M10 160 Q60 145 110 160 Q120 165 110 170 Q60 180 10 170 Q0 165 10 160 Z" fill="url(#soil)" opacity="0.9" />

      {/* Stems */}
      <path d="M48 160 C40 120 42 70 45 35 C47 70 48 120 52 160 Z" fill="url(#s4-stem)" />
      <path d="M72 160 C80 120 78 70 75 35 C73 70 72 120 68 160 Z" fill="url(#s4-stem)" />
      <path d="M60 160 C62 110 59 50 60 10 C63 50 64 110 64 160 Z" fill="url(#s4-stem)" />

      {/* Emerging Panicles (Green grains clustered at tips) */}
      <g className="leaf-sway" style={{ transformOrigin: '60px 80px' }}>
        {/* Center panicle straight up */}
        <path d="M60 30 Q63 20 60 10" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={`c1-${i}`} rx="2.5" ry="4" cx={60 + (i % 2 === 0 ? -2 : 2)} cy={25 - i * 3} fill="url(#panicle-green)" transform={`rotate(${i % 2 === 0 ? -15 : 15} ${60} ${25 - i * 3})`} />
        ))}
        {/* Sub center panicle */}
        <path d="M60 40 Q55 30 52 20" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
           <ellipse key={`c2-${i}`} rx="2" ry="3.5" cx={55 + (i % 2 === 0 ? -1.5 : 1.5) - i*1} cy={35 - i * 4} fill="url(#panicle-green)" transform={`rotate(${i % 2 === 0 ? -25 : -5} ${55} ${35 - i * 4})`} />
        ))}
      </g>

      <g className="leaf-sway-alt" style={{ transformOrigin: '45px 90px' }}>
        {/* Left panicle curving out slightly */}
        <path d="M46 50 Q42 35 38 25" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={`l-${i}`} rx="2.2" ry="3.8" cx={44 - i*1.5 + (i % 2 === 0 ? -2 : 1)} cy={45 - i * 4} fill="url(#panicle-green)" transform={`rotate(${i % 2 === 0 ? -30 : -10} ${44} ${45 - i * 4})`} />
        ))}
      </g>

      <g className="leaf-sway" style={{ transformOrigin: '75px 90px' }}>
        {/* Right panicle curving out slightly */}
        <path d="M74 50 Q78 35 82 25" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={`r-${i}`} rx="2.2" ry="3.8" cx={76 + i*1.5 + (i % 2 === 0 ? 2 : -1)} cy={45 - i * 4} fill="url(#panicle-green)" transform={`rotate(${i % 2 === 0 ? 30 : 10} ${76} ${45 - i * 4})`} />
        ))}
      </g>

      {/* Foreground lush leaves covering the bases of panicles */}
      <g className="leaf-sway" style={{ transformOrigin: '50px 120px' }}>
        <path d="M48 140 C25 130 10 100 5 65 C15 85 28 115 52 130 Z" fill="url(#s4-leaf-l)" />
        <path d="M52 110 C30 100 20 60 18 30 C28 50 38 85 54 100 Z" fill="url(#s4-leaf-l)" />
        {/* Upper wrapper leaf left */}
        <path d="M50 80 C40 70 35 40 38 15 C42 30 48 55 52 75 Z" fill="url(#s4-leaf-l)" />
      </g>

      <g className="leaf-sway-alt" style={{ transformOrigin: '70px 120px' }}>
        <path d="M72 140 C95 130 110 100 115 65 C105 85 92 115 68 130 Z" fill="url(#s4-leaf-r)" />
        <path d="M68 110 C90 100 100 60 102 30 C92 50 82 85 66 100 Z" fill="url(#s4-leaf-r)" />
        {/* Upper wrapper leaf right */}
        <path d="M70 80 C80 70 85 40 82 15 C78 30 72 55 68 75 Z" fill="url(#s4-leaf-r)" />
      </g>
    </svg>
  );
}

// Stage 5: Ripening (80–100%) — heavy golden, drooping panicles, older leaves
function Ripening() {
  return (
    <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant drop-shadow-xl">
      <defs>
        <linearGradient id="s5-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="s5-leaf-l" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="40%" stopColor="#65a30d" />
          <stop offset="80%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#fde047" /> {/* Yellowing tips */}
        </linearGradient>
        <linearGradient id="s5-leaf-r" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="40%" stopColor="#65a30d" />
          <stop offset="80%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <radialGradient id="panicle-gold" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      <path d="M10 180 Q70 165 130 180 Q140 185 130 190 Q70 200 10 190 Q0 185 10 180 Z" fill="url(#soil)" opacity="0.9" />

      {/* Thicker, more yellow-green stems */}
      <path d="M50 180 C40 140 42 90 45 60 C48 90 50 140 54 180 Z" fill="url(#s5-stem)" />
      <path d="M90 180 C100 140 98 90 95 60 C92 90 90 140 86 180 Z" fill="url(#s5-stem)" />
      <path d="M70 180 C74 130 73 70 70 30 C67 70 66 130 66 180 Z" fill="url(#s5-stem)" />

      {/* --- Heavy Golden Panicles Drooping --- */}

      {/* Center heavy panicle */}
      <g className="leaf-sway" style={{ transformOrigin: '70px 60px' }}>
        <path d="M70 45 C75 25 50 10 25 40" stroke="#a16207" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Massive cluster of golden grains */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => {
          // Calculate parametric position along the curve roughly
          const t = i / 11;
          const cx = 70 * Math.pow(1-t, 2) + 2*50*t*(1-t) + 25 * Math.pow(t, 2);
          const cy = 45 * Math.pow(1-t, 2) + 2*10*t*(1-t) + 40 * Math.pow(t, 2);
          const offset1 = (i % 2 === 0 ? 3 : -3);
          const offset2 = (i % 3 === 0 ? 5 : -5);
          return (
            <g key={`cg-${i}`}>
              <ellipse rx="3.5" ry="5.5" cx={cx+offset1} cy={cy + i*2} fill="url(#panicle-gold)" transform={`rotate(${-30 + i*5} ${cx} ${cy})`} />
              {i % 2 === 0 && <ellipse rx="3.5" ry="5.5" cx={cx+offset2} cy={cy + 3 + i*2} fill="url(#panicle-gold)" transform={`rotate(${-45 + i*5} ${cx} ${cy})`} />}
            </g>
          );
        })}
      </g>

      {/* Right heavy panicle */}
      <g className="leaf-sway-alt" style={{ transformOrigin: '90px 70px' }}>
        <path d="M93 70 C105 45 130 40 125 75" stroke="#a16207" strokeWidth="2" fill="none" strokeLinecap="round" />
        {[0,1,2,3,4,5,6,7,8].map((i) => {
          const t = i / 8;
          const cx = 93 * Math.pow(1-t, 2) + 2*130*t*(1-t) + 125 * Math.pow(t, 2);
          const cy = 70 * Math.pow(1-t, 2) + 2*40*t*(1-t) + 75 * Math.pow(t, 2);
          const offset1 = (i % 2 === 0 ? 3 : -3);
          return (
             <ellipse key={`rg-${i}`} rx="3" ry="5" cx={cx+offset1} cy={cy + i*1.5} fill="url(#panicle-gold)" transform={`rotate(${30 - i*5} ${cx} ${cy})`} />
          );
        })}
      </g>

      {/* Left heavy panicle */}
      <g className="leaf-sway-alt" style={{ transformOrigin: '50px 70px' }}>
        <path d="M47 70 C35 45 10 40 15 75" stroke="#a16207" strokeWidth="2" fill="none" strokeLinecap="round" />
        {[0,1,2,3,4,5,6,7,8].map((i) => {
          const t = i / 8;
          const cx = 47 * Math.pow(1-t, 2) + 2*10*t*(1-t) + 15 * Math.pow(t, 2);
          const cy = 70 * Math.pow(1-t, 2) + 2*40*t*(1-t) + 75 * Math.pow(t, 2);
          const offset1 = (i % 2 === 0 ? 3 : -3);
          return (
             <ellipse key={`lg-${i}`} rx="3" ry="5" cx={cx+offset1} cy={cy + i*1.5} fill="url(#panicle-gold)" transform={`rotate(${-30 + i*5} ${cx} ${cy})`} />
          );
        })}
      </g>

      {/* Leaves with yellowing tips, drooping lower */}
      <g className="leaf-sway" style={{ transformOrigin: '55px 140px' }}>
        <path d="M50 160 C25 150 5 110 5 80 C20 100 35 135 55 150 Z" fill="url(#s5-leaf-l)" />
        <path d="M55 130 C30 120 15 70 10 40 C30 60 45 105 60 120 Z" fill="url(#s5-leaf-l)" />
      </g>

      <g className="leaf-sway-alt" style={{ transformOrigin: '85px 140px' }}>
        <path d="M90 160 C115 150 135 110 135 80 C120 100 105 135 85 150 Z" fill="url(#s5-leaf-r)" />
        <path d="M85 130 C110 120 125 70 130 40 C110 60 95 105 80 120 Z" fill="url(#s5-leaf-r)" />
      </g>
    </svg>
  );
}

export default function RicePlantIllustration({ progress }: Props) {
  const getStage = () => {
    if (progress < 20) return { component: <Seedling />, label: 'Bibit', color: 'text-emerald-500' };
    if (progress < 40) return { component: <Vegetative />, label: 'Vegetatif', color: 'text-emerald-600' };
    if (progress < 60) return { component: <Tillering />, label: 'Anakan', color: 'text-green-600' };
    if (progress < 80) return { component: <Heading />, label: 'Bunting', color: 'text-lime-600' };
    return { component: <Ripening />, label: 'Siap Panen', color: 'text-amber-500' };
  };

  const { component, label, color } = getStage();

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-40 flex items-end justify-center mb-1 drop-shadow-lg">
        {component}
      </div>
      <span className={`text-xs font-black uppercase tracking-[0.2em] shadow-sm ${color}`}>{label}</span>
      <style dangerouslySetInnerHTML={{ __html: `
        .rice-plant { overflow: visible; width: 100%; height: 100%; }
        .leaf-sway { animation: sway 4s ease-in-out infinite; }
        .leaf-sway-alt { animation: sway-alt 3.5s ease-in-out infinite; }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
        }
        @keyframes sway-alt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
      `}} />
    </div>
  );
}

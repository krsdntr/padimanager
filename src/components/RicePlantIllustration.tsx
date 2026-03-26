import React from 'react';

interface Props {
  progress: number; // 0–100
}

// Stage 1: Bibit (0–19%) — single tiny sprout
function Seedling() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant">
      <defs>
        <linearGradient id="stemGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Soil */}
      <rect x="20" y="158" width="80" height="18" rx="9" fill="url(#soilGrad)" />
      {/* Main stem */}
      <path d="M60 158 L60 100" stroke="url(#stemGrad1)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left tiny leaf */}
      <path d="M60 130 Q40 118 38 105" stroke="url(#leafGrad1)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-l" />
      {/* Right tiny leaf */}
      <path d="M60 120 Q80 108 82 95" stroke="url(#leafGrad1)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-r" />
      {/* Tip bud */}
      <ellipse cx="60" cy="98" rx="4" ry="5" fill="#86efac" />
    </svg>
  );
}

// Stage 2: Vegetatif (20–39%) — taller with more leaves
function Vegetative() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant">
      <defs>
        <linearGradient id="stemGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="soilGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Soil */}
      <rect x="15" y="158" width="90" height="18" rx="9" fill="url(#soilGrad2)" />
      {/* Main stem */}
      <path d="M60 158 L60 72" stroke="url(#stemGrad2)" strokeWidth="4" strokeLinecap="round" />
      {/* Leaf 1 - left wide */}
      <path d="M60 145 Q30 132 22 112" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      {/* Leaf 2 - right */}
      <path d="M60 128 Q90 115 95 95" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      {/* Leaf 3 - left upper */}
      <path d="M60 108 Q35 95 32 78" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-l" />
      {/* Leaf 4 - right upper */}
      <path d="M60 88 Q85 75 87 60" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-r" />
      {/* Tip */}
      <path d="M60 72 Q60 62 60 58" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Stage 3: Anakan (40–59%) — bushy cluster of 3 stems
function Tillering() {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant">
      <defs>
        <linearGradient id="stemGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="soilGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Soil */}
      <rect x="10" y="158" width="100" height="18" rx="9" fill="url(#soilGrad3)" />
      {/* Left stem */}
      <path d="M42 158 L35 70" stroke="url(#stemGrad3)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Center stem */}
      <path d="M60 158 L60 58" stroke="url(#stemGrad3)" strokeWidth="4" strokeLinecap="round" />
      {/* Right stem */}
      <path d="M78 158 L85 70" stroke="url(#stemGrad3)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left leaves */}
      <path d="M38 130 Q15 115 12 96" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M36 105 Q18 90 20 72" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-l" />
      {/* Center leaves */}
      <path d="M60 128 Q36 112 32 95" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M60 105 Q85 90 88 72" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      {/* Right leaves */}
      <path d="M82 130 Q104 115 108 96" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      <path d="M84 105 Q102 90 100 72" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" className="leaf-r" />
    </svg>
  );
}

// Stage 4: Bunting / Heading (60–79%) — panicle tips emerging
function Heading() {
  return (
    <svg viewBox="0 0 120 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant">
      <defs>
        <linearGradient id="stemGrad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="grainGrad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <linearGradient id="soilGrad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Soil */}
      <rect x="10" y="168" width="100" height="18" rx="9" fill="url(#soilGrad4)" />
      {/* Left stem */}
      <path d="M42 168 L35 78" stroke="url(#stemGrad4)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Center stem */}
      <path d="M60 168 L60 60" stroke="url(#stemGrad4)" strokeWidth="4" strokeLinecap="round" />
      {/* Right stem */}
      <path d="M78 168 L85 78" stroke="url(#stemGrad4)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M38 138 Q14 122 11 102" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M60 135 Q35 118 30 100" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M60 110 Q88 95 92 76" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      <path d="M82 138 Q106 122 109 102" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      {/* Emerging panicles */}
      {/* Center panicle */}
      <path d="M60 60 Q62 48 60 38" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
      {[-8,-4,0,4,8].map((x, i) => (
        <ellipse key={i} cx={60 + x * 0.6} cy={38 - i * 2} rx="3" ry="4.5" fill="url(#grainGrad4)" transform={`rotate(${x * 4} ${60 + x * 0.6} ${38 - i * 2})`} />
      ))}
      {/* Left panicle emerging */}
      <path d="M35 78 Q37 68 35 60" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
      {[-5,-2,0,2,5].map((x, i) => (
        <ellipse key={i} cx={35 + x * 0.5} cy={60 - i * 1.5} rx="2.5" ry="3.5" fill="url(#grainGrad4)" transform={`rotate(${x * 4} ${35 + x * 0.5} ${60 - i *1.5})`} />
      ))}
      {/* Right panicle */}
      <path d="M85 78 Q87 68 85 60" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
      {[-5,-2,0,2,5].map((x, i) => (
        <ellipse key={i} cx={85 + x * 0.5} cy={60 - i * 1.5} rx="2.5" ry="3.5" fill="url(#grainGrad4)" transform={`rotate(${x * 4} ${85 + x * 0.5} ${60 - i *1.5})`} />
      ))}
    </svg>
  );
}

// Stage 5: Panen (80–100%) — full golden drooping panicles
function Ripening() {
  return (
    <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="rice-plant">
      <defs>
        <linearGradient id="stemGrad5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="grainGoldTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="grainGoldBot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="soilGrad5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Soil */}
      <rect x="10" y="178" width="120" height="18" rx="9" fill="url(#soilGrad5)" />

      {/* --- Left stem --- */}
      <path d="M45 178 L38 88" stroke="url(#stemGrad5)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left droop neck */}
      <path d="M38 88 Q34 72 22 62" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left drooping panicle grains */}
      {[0,1,2,3,4,5,6].map(i => (
        <ellipse key={i} cx={22 - i * 1.5} cy={62 + i * 5} rx="3" ry="5" fill={i < 3 ? 'url(#grainGoldTop)' : 'url(#grainGoldBot)'} transform={`rotate(-30 ${22 - i*1.5} ${62+i*5})`} />
      ))}

      {/* --- Center stem --- */}
      <path d="M70 178 L70 82" stroke="url(#stemGrad5)" strokeWidth="4" strokeLinecap="round" />
      {/* Center droop neck */}
      <path d="M70 82 Q72 64 58 50" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      {/* Center drooping panicle grains */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <ellipse key={i} cx={58 - i * 1.2} cy={50 + i * 6} rx="3.5" ry="5.5" fill={i < 4 ? 'url(#grainGoldTop)' : 'url(#grainGoldBot)'} transform={`rotate(-25 ${58 - i*1.2} ${50+i*6})`} />
      ))}

      {/* --- Right stem --- */}
      <path d="M95 178 L100 88" stroke="url(#stemGrad5)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right droop neck */}
      <path d="M100 88 Q106 72 118 62" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right drooping panicle grains */}
      {[0,1,2,3,4,5,6].map(i => (
        <ellipse key={i} cx={118 + i * 1.5} cy={62 + i * 5} rx="3" ry="5" fill={i < 3 ? 'url(#grainGoldTop)' : 'url(#grainGoldBot)'} transform={`rotate(30 ${118 + i*1.5} ${62+i*5})`} />
      ))}

      {/* Leaves */}
      <path d="M44 148 Q18 133 14 112" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M70 148 Q42 133 36 112" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-l" />
      <path d="M70 122 Q98 108 103 90" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
      <path d="M95 148 Q120 133 124 112" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" className="leaf-r" />
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
      <div className="w-28 h-36 flex items-end justify-center">
        {component}
      </div>
      <span className={`mt-1 text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
      <style dangerouslySetInnerHTML={{ __html: `
        .rice-plant { overflow: visible; }
        .leaf-l { transform-origin: 60px 160px; animation: sway-l 3s ease-in-out infinite; }
        .leaf-r { transform-origin: 60px 160px; animation: sway-r 3s ease-in-out infinite; }
        @keyframes sway-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg); }
        }
        @keyframes sway-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
      `}} />
    </div>
  );
}

// 2D chat avatars (same designs as the 3D cast)
const O = 'stroke="#111" stroke-width="3.5" stroke-linejoin="round"';
export const AV: Record<string, (x?: string) => string> = {
  gerald: (x) => `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#8f6b3e" ${O}/>
    <path d="M30 98 Q34 84 50 84 Q66 84 70 98 Z" fill="#2f2f38" ${O}/>
    <ellipse cx="50" cy="60" rx="23" ry="25" fill="#ffd7b5" ${O}/>
    <path d="M27 60 Q29 90 50 92 Q71 90 73 60 Q66 79 50 80 Q34 79 27 60 Z" fill="#5a3a1a" ${O}/>
    <path d="M35 57 Q40 54 46 57" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M54 57 Q60 54 65 57" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="41" cy="59.5" r="2.4" fill="#111"/><circle cx="60" cy="59.5" r="2.4" fill="#111"/>
    <path d="M43 71 Q51 75 59 68" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M73 52 Q76 58 73 61 Q70 58 73 52 Z" fill="#7cc6ff" stroke="#111" stroke-width="1.5"/>
    <ellipse cx="50" cy="39" rx="38" ry="7.5" fill="#3a3a44" ${O}/>
    <path d="M29 38 Q28 14 50 13 Q72 14 71 38 Z" fill="#4b4b57" ${O}/>
    <rect x="29.5" y="30" width="41" height="7" fill="#17171c"/>
    <path d="M42 15 Q50 22 58 15" stroke="#111" stroke-width="2.5" fill="none"/>
    ${x || ''}</svg>`,
  kevin: (x) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#2fbf4a" ${O}/>
    <ellipse cx="50" cy="58" rx="28" ry="28" fill="#ffc9a0" ${O}/>
    <path d="M22 50 Q24 24 50 24 Q76 24 78 50 Z" fill="#ff3d3d" ${O}/>
    <path d="M70 44 Q90 44 92 52 L76 52Z" fill="#ff3d3d" ${O}/>
    <path d="M18 58 Q18 30 50 30 Q82 30 82 58" stroke="#222" stroke-width="6" fill="none"/>
    <rect x="12" y="52" width="12" height="20" rx="5" fill="#222"/><rect x="76" y="52" width="12" height="20" rx="5" fill="#222"/>
    <path d="M80 70 Q76 82 62 80" stroke="#222" stroke-width="3" fill="none"/><circle cx="61" cy="80" r="3.5" fill="#222"/>
    <circle cx="40" cy="58" r="4" fill="#111"/><circle cx="60" cy="58" r="4" fill="#111"/>
    <path d="M27 50 Q30 56 27 59 Q24 56 27 50 Z" fill="#7cc6ff" stroke="#111" stroke-width="1.5"/>
    <path d="M38 70 Q50 80 64 68" stroke="#111" stroke-width="3.5" fill="#fff" stroke-linecap="round"/>${x || ''}</svg>`,
  grandma: (x) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#b066ff" ${O}/>
    <circle cx="50" cy="20" r="12" fill="#e8e8f0" ${O}/>
    <ellipse cx="50" cy="56" rx="28" ry="30" fill="#ffd9c2" ${O}/>
    <path d="M22 50 Q22 26 50 26 Q78 26 78 50 Q70 36 50 36 Q30 36 22 50Z" fill="#e8e8f0" ${O}/>
    <circle cx="39" cy="54" r="9" fill="#fff" stroke="#111" stroke-width="3.5"/><circle cx="61" cy="54" r="9" fill="#fff" stroke="#111" stroke-width="3.5"/>
    <path d="M48 54 H52" stroke="#111" stroke-width="3.5"/>
    <circle cx="39" cy="55" r="3.5" fill="#111"/><circle cx="61" cy="55" r="3.5" fill="#111"/>
    <ellipse cx="30" cy="66" rx="5" ry="3" fill="#ff8fa3"/><ellipse cx="70" cy="66" rx="5" ry="3" fill="#ff8fa3"/>
    <path d="M42 72 Q50 78 58 72" stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round"/>${x || ''}</svg>`,
  bot: (x) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#2a7fff" ${O}/>
    <path d="M50 12 V24" stroke="#111" stroke-width="4"/><circle cx="50" cy="11" r="5" fill="#ff3d3d" ${O}/>
    <rect x="22" y="24" width="56" height="50" rx="10" fill="#d9e3f0" ${O}/>
    <rect x="30" y="34" width="40" height="22" rx="6" fill="#111"/>
    <rect x="35" y="40" width="10" height="10" rx="2" fill="#5affc8"/><rect x="55" y="40" width="10" height="10" rx="2" fill="#5affc8"/>
    <path d="M36 64 H64" stroke="#111" stroke-width="4" stroke-dasharray="5 4"/>
    <rect x="34" y="74" width="32" height="12" fill="#9aa8bb" ${O}/>${x || ''}</svg>`,
  dave: (x) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#8fa3b8" ${O}/>
    <path d="M28 86 Q24 50 40 34 Q52 22 64 32 Q74 42 70 60 Q78 74 72 88Z" fill="#9a9aae" ${O}/>
    <path d="M58 60 Q66 66 70 60" fill="#6fd1a8" stroke="#111" stroke-width="3"/>
    <path d="M60 40 L80 46 L62 50Z" fill="#ffb02e" ${O}/>
    <circle cx="52" cy="40" r="7" fill="#fff" ${O}/><circle cx="54" cy="40" r="2.5" fill="#111"/>
    <circle cx="38" cy="42" r="5" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="37" cy="44" r="2" fill="#111"/>${x || ''}</svg>`,
  mom: (x) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#ff3d3d" ${O}/>
    <path d="M20 70 Q16 26 50 22 Q84 26 80 70 Z" fill="#5a3216" ${O}/>
    <ellipse cx="50" cy="56" rx="24" ry="27" fill="#ffc9a0" ${O}/>
    <path d="M34 46 L46 52 M66 46 L54 52" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="41" cy="57" r="3.8" fill="#111"/><circle cx="59" cy="57" r="3.8" fill="#111"/>
    <path d="M40 72 Q50 66 60 72" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>${x || ''}</svg>`,
};

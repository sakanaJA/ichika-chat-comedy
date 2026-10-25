// Original character avatars (inline SVG). x = extra overlay (e.g. crown).
const O = 'stroke="#111" stroke-width="3.5" stroke-linejoin="round"';
const AV = {
  hana: (x) => `<svg viewBox="0 0 100 100">
    <defs><clipPath id="hanaclip"><circle cx="50" cy="50" r="46.5"/></clipPath></defs>
    <circle cx="50" cy="50" r="48" fill="#ffd1e8" ${O}/>
    <g clip-path="url(#hanaclip)">
    <path d="M17 94 Q10 52 24 30 Q36 13 50 13 Q66 13 77 30 Q90 52 83 94 Z" fill="#ff8fc7" ${O}/>
    <path d="M27 98 Q31 82 50 82 Q69 82 73 98 Z" fill="#7c6cff" ${O}/>
    <path d="M44 76 H56 V84 Q50 87 44 84 Z" fill="#ffe1d6" stroke="#111" stroke-width="2.5"/>
    <path d="M29 47 Q29 77 50 81 Q71 77 71 47 Z" fill="#ffeee6" ${O}/>
    <path d="M27 55 Q24 22 50 20 Q76 22 73 55 Q69 45 64 50 Q62 39 56 46 Q51 34 46 46 Q40 38 37 50 Q32 44 27 55 Z" fill="#ff8fc7" ${O}/>
    <path d="M40 27 Q46 24 52 26" stroke="#ffd1ea" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M28 46 Q22 68 29 88 L34 58 Z" fill="#ff8fc7" ${O}/>
    <path d="M72 46 Q78 68 71 88 L66 58 Z" fill="#ff8fc7" ${O}/>
    <ellipse cx="40" cy="60" rx="5.6" ry="7.2" fill="#4a1f7a"/>
    <ellipse cx="40" cy="62" rx="4" ry="4.6" fill="#b46cff"/>
    <circle cx="38" cy="57" r="2.1" fill="#fff"/><circle cx="42.2" cy="64" r="1.1" fill="#fff"/>
    <ellipse cx="60" cy="60" rx="5.6" ry="7.2" fill="#4a1f7a"/>
    <ellipse cx="60" cy="62" rx="4" ry="4.6" fill="#b46cff"/>
    <circle cx="58" cy="57" r="2.1" fill="#fff"/><circle cx="62.2" cy="64" r="1.1" fill="#fff"/>
    <path d="M33 55 Q40 50 47 54" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M53 54 Q60 50 67 55" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="33" cy="69" rx="4.5" ry="2.4" fill="#ff9fbf" opacity=".85"/><ellipse cx="67" cy="69" rx="4.5" ry="2.4" fill="#ff9fbf" opacity=".85"/>
    <path d="M45 72 Q47.5 75 50 72 Q52.5 75 55 72" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M23 46 Q23 13 50 13 Q77 13 77 46" stroke="#2b2b3a" stroke-width="4.5" fill="none"/>
    <path d="M29 24 L26 5 L42 15 Z" fill="#fff" ${O}/><path d="M30 20 L29 10 L37 15 Z" fill="#ffb3d6"/>
    <path d="M71 24 L74 5 L58 15 Z" fill="#fff" ${O}/><path d="M70 20 L71 10 L63 15 Z" fill="#ffb3d6"/>
    <rect x="16" y="44" width="11" height="17" rx="5" fill="#fff" ${O}/>
    <rect x="73" y="44" width="11" height="17" rx="5" fill="#fff" ${O}/>
    ${x || ''}</svg>`,
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
const CROWN = `<path d="M30 20 L36 5 L44 14 L50 1 L56 14 L64 5 L70 20 Z" fill="#ffc400" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`;
AV.ichika = (x) => `<svg viewBox="0 0 512 512"><defs><clipPath id="ichclip"><circle cx="256" cy="256" r="250"/></clipPath></defs><g clip-path="url(#ichclip)"><rect width="512" height="512" fill="#ffe6f1"/>
<circle cx="256" cy="256" r="236" fill="#ffe6f1"/>
<circle cx="256" cy="256" r="236" fill="none" stroke="#ffc6de" stroke-width="6"/>
<path d="M86 120 Q86 138 104 138 Q86 138 86 156 Q86 138 68 138 Q86 138 86 120 Z" fill="#ffffff"/>
<path d="M430 150 Q430 162 442 162 Q430 162 430 174 Q430 162 418 162 Q430 162 430 150 Z" fill="#ffffff"/>
<path d="M60 250 Q60 258 68 258 Q60 258 60 266 Q60 258 52 258 Q60 258 60 250 Z" fill="#ff9ec7"/>
<path d="M452 270 Q452 278 460 278 Q452 278 452 286 Q452 278 444 278 Q452 278 452 270 Z" fill="#ff9ec7"/>
<path d="M256 80 C146 80 92 160 98 258 C102 340 84 420 76 492 Q116 506 158 490 L354 490 Q396 506 436 492 C428 420 410 340 414 258 C420 160 366 80 256 80 Z" fill="#ed76a7" stroke="#c0607f" stroke-width="2" stroke-linejoin="round"/>
<path d="M120 300 Q116 390 104 470 M392 300 Q396 390 408 470" fill="none" stroke="#c0607f" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
<path d="M126 220 Q118 320 120 380 M386 220 Q394 320 392 380" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.35"/>
<path d="M146 512 C150 440 194 400 230 396 Q256 406 282 396 C318 400 362 440 366 512 Z" fill="#fffaf6" stroke="#c0aaa8" stroke-width="2" stroke-linejoin="round"/>
<path d="M240 340 L240 402 Q256 410 272 402 L272 340 Z" fill="#fff3ec" stroke="#d08f88" stroke-width="2"/>
<path d="M240 352 Q256 374 272 352 L272 372 Q256 388 240 372 Z" fill="#ffd9cf"/>
<g transform="translate(0 -24)">
<path d="M210 422 Q256 440 302 422 L308 432 Q298 444 288 436 Q280 450 270 440 Q262 452 256 442 Q250 452 242 440 Q232 450 224 436 Q214 444 204 432 Z" fill="#ffffff" stroke="#c0aaa8" stroke-width="2" stroke-linejoin="round"/>
<path d="M256 446 L234 434 Q228 448 234 460 Z M256 446 L278 434 Q284 448 278 460 Z" fill="#ff8fb8" stroke="#c0507f" stroke-width="2" stroke-linejoin="round"/>
<circle cx="256" cy="446" r="6" fill="#ffa6c8" stroke="#c0507f" stroke-width="2"/>
</g>
<path d="M160 232 C158 302 198 352 256 364 C314 352 354 302 352 232 C352 152 310 120 256 120 C202 120 160 152 160 232 Z" fill="#fff3ec" stroke="#d08f88" stroke-width="2"/>
<g transform="translate(0 8)">
<path d="M150 270 C136 160 186 90 256 90 C326 90 376 160 362 270 Q352 240 340 218 Q340 244 328 258 Q324 226 310 206 Q304 234 290 248 Q290 214 276 196 Q268 226 256 244 Q248 220 236 196 Q222 222 222 248 Q208 232 202 206 Q190 230 184 258 Q180 236 172 218 Q164 246 150 270 Z" fill="#ffdcd2"/>
</g>
<ellipse cx="194" cy="320" rx="20" ry="9" fill="#ff8fb0" opacity="0.45"/>
<ellipse cx="318" cy="320" rx="20" ry="9" fill="#ff8fb0" opacity="0.45"/>
<path d="M186 322 L190 316 M194 322 L198 316 M202 322 L206 316 M310 322 L314 316 M318 322 L322 316 M326 322 L330 316" fill="none" stroke="#f47a9c" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
<g><g transform="translate(213 290) scale(1.12) translate(-213 -290)">
<path d="M184 278 Q208 254 242 266 Q245 290 237 309 Q214 319 190 309 Q182 294 184 278 Z" fill="#ffffff"/>
<ellipse cx="213" cy="287" rx="23" ry="28" fill="#383f92"/>
<ellipse cx="213" cy="297" rx="17" ry="15" fill="#6f86ff"/>
<ellipse cx="213" cy="305" rx="11" ry="6" fill="#b7c2ff"/>
<ellipse cx="213" cy="271" rx="15" ry="8" fill="#1a1040" opacity="0.5"/>
<ellipse cx="213" cy="285" rx="7" ry="10" fill="#1a1040"/>
<path d="M190 256 Q210 246 232 251" fill="none" stroke="#a0606e" stroke-width="1.5" stroke-linecap="round"/>
<path d="M179 278 Q206 249 246 264" fill="none" stroke="#2e1426" stroke-width="6.5" stroke-linecap="round"/>
<path d="M183 274 Q175 268 168 270" fill="none" stroke="#2e1426" stroke-width="3.5" stroke-linecap="round"/>
<path d="M190 309 Q198 314 208 315" fill="none" stroke="#a0606e" stroke-width="1.6" stroke-linecap="round"/>
</g></g>
<g transform="translate(512 0) scale(-1 1)"><g transform="translate(213 290) scale(1.12) translate(-213 -290)">
<path d="M184 278 Q208 254 242 266 Q245 290 237 309 Q214 319 190 309 Q182 294 184 278 Z" fill="#ffffff"/>
<ellipse cx="213" cy="287" rx="23" ry="28" fill="#383f92"/>
<ellipse cx="213" cy="297" rx="17" ry="15" fill="#6f86ff"/>
<ellipse cx="213" cy="305" rx="11" ry="6" fill="#b7c2ff"/>
<ellipse cx="213" cy="271" rx="15" ry="8" fill="#1a1040" opacity="0.5"/>
<ellipse cx="213" cy="285" rx="7" ry="10" fill="#1a1040"/>
<path d="M190 256 Q210 246 232 251" fill="none" stroke="#a0606e" stroke-width="1.5" stroke-linecap="round"/>
<path d="M179 278 Q206 249 246 264" fill="none" stroke="#2e1426" stroke-width="6.5" stroke-linecap="round"/>
<path d="M183 274 Q175 268 168 270" fill="none" stroke="#2e1426" stroke-width="3.5" stroke-linecap="round"/>
<path d="M190 309 Q198 314 208 315" fill="none" stroke="#a0606e" stroke-width="1.6" stroke-linecap="round"/>
</g></g>
<g transform="translate(213 290) scale(1.12) translate(-213 -290)">
<ellipse cx="204" cy="276" rx="7" ry="8" fill="#ffffff"/>
<circle cx="223" cy="300" r="3.5" fill="#ffffff"/>
<circle cx="220" cy="274" r="2" fill="#ffffff"/>
</g>
<g transform="translate(299 290) scale(1.12) translate(-299 -290)">
<ellipse cx="290" cy="276" rx="7" ry="8" fill="#ffffff"/>
<circle cx="309" cy="300" r="3.5" fill="#ffffff"/>
<circle cx="306" cy="274" r="2" fill="#ffffff"/>
</g>
<path d="M257 322 L255 325" fill="none" stroke="#e0a096" stroke-width="1.8" stroke-linecap="round"/>
<path d="M247 335 Q256 338 265 335 Q263 347 256 348 Q249 347 247 335 Z" fill="#d9506a" stroke="#8a3046" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M251 344 Q256 340 261 344 Q259 347 256 347 Q253 347 251 344 Z" fill="#ff93a3"/>
<path d="M170 206 C146 260 146 340 136 432 Q148 420 156 428 Q160 444 168 454 C172 380 172 310 180 262 Q178 232 170 206 Z" fill="#ff9ec7" stroke="#c0607f" stroke-width="2" stroke-linejoin="round"/>
<path d="M342 206 C366 260 366 340 376 432 Q364 420 356 428 Q352 444 344 454 C340 380 340 310 332 262 Q334 232 342 206 Z" fill="#ff9ec7" stroke="#c0607f" stroke-width="2" stroke-linejoin="round"/>
<path d="M162 290 Q158 340 152 400 M350 290 Q354 340 360 400" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
<path d="M150 270 C136 160 186 90 256 90 C326 90 376 160 362 270 Q352 240 340 218 Q340 244 328 258 Q324 226 310 206 Q304 234 290 248 Q290 214 276 196 Q268 226 256 244 Q248 220 236 196 Q222 222 222 248 Q208 232 202 206 Q190 230 184 258 Q180 236 172 218 Q164 246 150 270 Z" fill="#ff9ec7" stroke="#c0607f" stroke-width="2" stroke-linejoin="round"/>
<path d="M236 160 Q238 180 236 196 M276 160 Q274 180 276 196 M204 170 Q200 190 202 206 M308 170 Q312 190 310 206 M256 190 Q256 220 256 244 M172 190 Q170 206 172 218 M340 190 Q342 206 340 218" fill="none" stroke="#ed76a7" stroke-width="2" stroke-linecap="round"/>
<path d="M252 92 C244 60 268 42 294 50 C272 56 264 72 262 92 Z" fill="#ff9ec7" stroke="#c0607f" stroke-width="2" stroke-linejoin="round"/>
<path d="M180 158 L196 142 L204 156 L224 136 L234 150 L256 130 L266 146 L288 134 L296 150 L316 140 L332 156 L324 162 L310 152 L294 162 L286 148 L266 158 L256 146 L236 162 L226 150 L206 166 L198 156 L186 166 Z" fill="#ffffff" opacity="0.85"/>
<path d="M150 240 C140 66 372 66 362 240" fill="none" stroke="#3a3048" stroke-width="11" stroke-linecap="round"/>
<path d="M150 240 C140 66 372 66 362 240" fill="none" stroke="#7a6a92" stroke-width="3.5" stroke-linecap="round"/>
<path d="M174 150 L160 62 L222 118 Z" fill="#ffffff" stroke="#3a3048" stroke-width="5" stroke-linejoin="round"/>
<path d="M180 136 L170 86 L208 120 Z" fill="#ffb3d1"/>
<path d="M338 150 L352 62 L290 118 Z" fill="#ffffff" stroke="#3a3048" stroke-width="5" stroke-linejoin="round"/>
<path d="M332 136 L342 86 L304 120 Z" fill="#ffb3d1"/>
<rect x="124" y="226" width="48" height="80" rx="23" fill="#ffffff" stroke="#3a3048" stroke-width="5"/>
<rect x="136" y="240" width="24" height="52" rx="12" fill="#ffb3d1"/>
<rect x="340" y="226" width="48" height="80" rx="23" fill="#ffffff" stroke="#3a3048" stroke-width="5"/>
<rect x="352" y="240" width="24" height="52" rx="12" fill="#ffb3d1"/>
</g><circle cx="256" cy="256" r="250" fill="none" stroke="#111" stroke-width="14"/><g transform="scale(5.12)">${x || ''}</g></svg>`;
const ASSETS = new URL('../assets/', document.currentScript.src).href;
AV.ichika = () => `<img src="${ASSETS}ichika_avatar.png" style="width:100%;height:100%;border-radius:50%;display:block" alt="">`;
window.AV = AV;
window.CROWN = CROWN;

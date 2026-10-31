/**
 * MusicGlyphs.ts - Standard SMuFL (Standard Music Font Layout) Vector Glyphs
 * Authentic vector geometry derived from Bravura / LilyPond engraving specs.
 */

export const SMUFL_GLYPHS = {
  // Treble Clef (G Clef) - centered on 2nd line of treble staff
  gClef: 'M999 -403q219 94 220 309v22q-7 129 -103 219t-225 91h-8q73 -401 116 -641zM176 33v-17q4 -127 66 -221q102 -156 347 -215q95 -22 184 -22t138 16l-110 655q-242 -41 -242 -233v-21q2 -57 51 -121t83 -80q34 -15 34 -38q0 -32 -71 -8q-71 26 -132 98t-86 174q-12 43 -12 90q0 137 95 255t235 159l-51 319q-155 -115 -261 -219t-187 -256t-81 -315zM698 1416q0 -81 2 -93t19 -111q334 252 371 510q4 33 4 45q0 78 -40 121q-41 43 -96 43q-76 -4 -138 -97t-92 -215t-30 -203zM279 -1012q0 62 8 62q8 70 61 119t125 53h14q81 0 141 -56t68 -139v-14q0 -68 -40 -120t-103 -73q-4 -2 -51 -12q-18 -8 -19 -16q0 -10 19 -23q57 -41 170 -41h39q49 0 100 20t85 54t62 102t27 146q0 78 -12 155l-47 287h-11q-59 -8 -167 -8q-245 0 -462 139q-112 72 -193 218t-81 358q0 314 287 622q96 104 167 169t185 163l-24 129q-14 100 -15 209q0 279 92 489t240 277q8 -2 22 -9q14 -8 56 -56q41 -48 76 -130q88 -205 88 -393q0 -418 -414 -801q17 -74 66 -350q8 4 26 4h23q197 0 342 -136t157 -335v-28q0 -169 -99 -303t-273 -199l51 -305q12 -76 12 -166t-35 -176q-35 -84 -93 -128q-111 -84 -234 -92l-47 -2q-311 0 -375 225q-14 49 -14 111z',

  // Bass Clef (F Clef) - centered on 4th line of bass staff (2nd line from top)
  fClef: 'M1165 249q0 45 34 79t80 34t80 -32t34 -80q0 -47 -34 -81t-81 -34t-80 34t-33 80zM1278 -137q47 0 81 -34t34 -81t-34 -81t-80 -34t-80 34t-34 81t33 81t80 34zM508 537h10q34 0 133 -23t186 -82q87 -60 135 -118t81 -151t34 -206v-14q0 -129 -52 -281q-105 -306 -384 -581q-131 -130 -303 -225t-354 -128q-10 -2 -24 4q-13 6 -13 20q-1 14 25 28q26 16 147 82t178 108q315 242 404 502q72 219 71 452q0 322 -125 465q-74 80 -192 80q-27 0 -77 -14q-50 -15 -89 -35t-82 -64t-57 -78q-14 -32 -15 -40q0 -43 50 -43h14q12 2 45 2q88 0 154 -47q66 -46 66 -154t-53 -164q-52 -56 -145 -57h-10q-94 -1 -169 75t-91 209q-2 10 -2 29q0 156 144 302t360 147z',

  // Alto/Tenor Clef (C Clef)
  cClef: 'M262 983v-1966q0 -19 -13 -33t-34 -14h-168q-18 0 -33 14q-14 14 -14 33v1966q0 19 14 33t33 14h168q20 0 34 -14q13 -15 13 -33zM1432 -552q0 -190 -126 -334t-331 -144t-299 73t-94 147t46 129q46 56 110 56q64 1 104 -33q39 -34 39 -94q0 -86 -88 -139q-1 -2 -11 -6t-15 -9t-5 -9t8 -13q47 -47 131 -47q121 0 181 94t61 209v244q0 129 -36 187q-36 59 -131 59t-143 -49q-49 -49 -73 -123t-49 -74q-33 0 -45 59q-63 276 -195 291v-909q0 -19 -12 -31q-11 -12 -31 -12t-33 12q-12 12 -12 31v1972q0 45 45 45q18 0 30 -12t13 -33v-909q133 18 195 293q12 59 45 59q25 0 49 -74t73 -122q48 -50 143 -50t131 58t36 186v246q-1 115 -61 209t-181 94q-84 0 -135 -51q-4 -2 -4 -8t7 -12q7 -5 16 -9t12 -6q84 -66 84 -131q0 -66 -39 -100q-40 -34 -104 -34t-110 57q-46 56 -46 130q0 75 94 147t299 72t331 -144t126 -334t-106 -318t-318 -128q-58 0 -106 16t-58 17q-10 0 -26 -14q-17 -15 -24 -25l-12 -15t-10 -15t-18 -34t-13 -36q1 -12 11 -32l16 -34q47 -78 80 -77q6 0 54 18t106 19q212 0 318 -128t106 -318z',

  // Accidentals
  sharp: 'M352 40q0 95 -8 116q-6 12 -39 12t-86 -27t-55 -51q-6 -25 -6 -133q0 -107 5 -119t35 -12t84 26t62 56q8 32 9 132zM158 534l60 21v145q0 21 -10 21q-12 0 -50 -16v-171zM158 20l60 20v140l-60 -21v-139zM352 795v-138l-74 -26v-142l74 27v-139l-74 -27v-139l74 26v-150q0 -21 11 -21q10 0 49 17v167l63 21v138l-63 -21v140l63 22v138l-63 -22v160q0 23 -11 23q-10 0 -49 -17z',
  flat: 'M119 -197q8 0 20 7q98 61 148 153q35 61 35 121t-33 98q-18 23 -59 23q-41 -1 -85 -43q-45 -42 -50 -58t-5 -133v-168h29zM128 359q47 47 90 47q21 0 32 -16t11 -41q0 -58 -37 -132t-96 -115v257zM35 848q0 23 -14 23q-21 0 -21 -23v-1090q0 -20 14 -20q21 0 21 20v492q53 -40 106 -58t107 -18q71 0 128 39t87 104t30 148q0 86 -44 163t-120 119t-167 42q-52 0 -107 -20v89z',
  natural: 'M76 80v-211q0 -12 34 -12q34 1 96 29t62 55v211q0 10 -28 10t-96 -31t-68 -51zM328 383q16 0 16 -16v-1029q0 -14 -16 -14q-15 0 -44 10v206l-208 -67v-389q0 -14 -16 -14q-16 0 -44 11v1050q0 14 16 14q16 0 44 -11v-207l208 68v388q0 14 16 14q16 0 48 -14z'
};

/**
 * Returns clean SVG markup for a staff clef
 */
export function renderClefSvg(
  clef: string,
  xOffset: number,
  staffY: number,
  lineSpacing: number
): { svg: string; width: number } {
  // 1 staff space = 250 SMuFL font units, so scale = lineSpacing / 250
  const scale = lineSpacing / 250;

  if (clef === 'treble') {
    // Treble Clef sits on G4 (2nd line from bottom = line 3 from top = staffY + 3 * lineSpacing)
    const gLineY = staffY + 3 * lineSpacing;
    return {
      svg: `<g transform="translate(${xOffset}, ${gLineY}) scale(${scale}, -${scale})">
        <path d="${SMUFL_GLYPHS.gClef}" fill="#f8fafc" class="clef-glyph" />
      </g>`,
      width: 42
    };
  } else if (clef === 'bass') {
    // Bass Clef sits on F3 (4th line from bottom = line 1 from top = staffY + lineSpacing)
    const fLineY = staffY + lineSpacing;
    return {
      svg: `<g transform="translate(${xOffset}, ${fLineY}) scale(${scale}, -${scale})">
        <path d="${SMUFL_GLYPHS.fClef}" fill="#f8fafc" class="clef-glyph" />
      </g>`,
      width: 40
    };
  } else {
    // Alto / Tenor Clef (C Clef)
    const cLineY = clef === 'tenor' ? staffY + lineSpacing : staffY + 2 * lineSpacing;
    return {
      svg: `<g transform="translate(${xOffset}, ${cLineY}) scale(${scale}, -${scale})">
        <path d="${SMUFL_GLYPHS.cClef}" fill="#f8fafc" class="clef-glyph" />
      </g>`,
      width: 38
    };
  }
}

/**
 * Renders an accidental symbol (sharp, flat, natural) in SVG
 */
export function renderAccidentalSvg(
  accidental: 'sharp' | 'flat' | 'natural',
  x: number,
  y: number,
  scale: number = 0.038
): string {
  const path = SMUFL_GLYPHS[accidental];
  if (!path) return '';
  return `<g transform="translate(${x}, ${y}) scale(${scale}, -${scale})">
    <path d="${path}" fill="#f8fafc" class="accidental-glyph" />
  </g>`;
}

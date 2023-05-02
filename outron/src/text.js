const FONT1 = {
  A: `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v10.583h2.6458v-5.2917h7.9375v5.2917h2.6458v-10.583c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v2.6458h-7.9375z`,
  B: `m2.6e-6 -2.6667e-7v13.229h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66146-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375zm0 5.2917h7.9375v2.6458h-7.9375z`,
  C: `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h10.583v-2.6458h-10.583v-7.9375h10.583v-2.6458z`,
  D: `m5.9e-6 -1.2667e-6v13.229h10.583c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v7.9375h-7.9375z`,
  E: `m5.9e-6 -1.2667e-6v13.229h13.229v-2.6458h-10.583v-2.6458h7.9375v-2.6458h-7.9375v-2.6458h10.583v-2.6458z`,
  F: `m5.9e-6 -1.2667e-6v13.229h2.6458v-5.2917h7.9375v-2.6458h-7.9375v-2.6458h10.583v-2.6458z`,
  G: `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h9.2604c0.66146 0 1.3229-0.66146 1.3229-1.3229v-6.6146h-7.9375v2.6458h5.2917v2.6458h-7.9375v-7.9375h10.583v-2.6458z`,
  H: `m5.9e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-13.229h-2.6458v5.2917h-7.9375v-5.2917z`,
  I: `m5.2917-1.2667e-6v13.229h2.6458v-13.229z`,
  J: `m10.583-1.2667e-6v10.583h-7.9375v-2.6458h-2.6458v2.6458c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-10.583z`,
  K: `m5.9e-6 -1.2667e-6v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-5.2917l-1.3229-1.3229 1.3229-1.3229v-5.2917h-2.6458v5.2917h-7.9375v-5.2917z`,
  L: `m2.6e-6 -1.2667e-6v13.229h13.229v-2.6458h-10.583v-10.583z`,
  M: `m5.9e-6 -9.6667e-7v13.229h2.6458v-10.583h2.6458v2.6458h2.6458v-2.6458h2.6458v10.583h2.6458v-13.229h-5.2917l-1.3229 1.3229-1.3229-1.3229z`,
  N: `m13.229-9.6667e-7h-2.6458v8.3783c-2.7928-2.7928-5.5855-5.5855-8.3783-8.3783h-2.205v13.229h2.6458v-8.3783c2.7928 2.7928 5.5855 5.5855 8.3783 8.3783h2.205v-2.205z`,
  O: `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm0 2.6458h7.9375v7.9375h-7.9375z`,
  P: `m5.9e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375z`,
  Q: `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h6.6146l-2.6458-2.6458h-3.9688v-7.9375h7.9375v3.9688l2.6458 2.6458v-6.6146c0-1.3229-1.3229-2.6458-2.6458-2.6458zm5.071 5.5123-2.2045 2.2045 5.5118 5.5123 2.205-2.205z`,
  R: `m5.6e-6 -9.6667e-7v13.229h2.6458v-5.2917h7.9375v5.2917h2.6458v-5.2917l-1.3229-1.3229c0.66146 0 1.3229-0.66146 1.3229-1.3229v-2.6458c0-1.3229-1.3229-2.6458-2.6458-2.6458zm2.6458 2.6458h7.9375v2.6458h-7.9375z`,
  S: `m1.3229-2.6667e-7c-0.66146 0-1.3229 0.66146-1.3229 1.3229v5.2917c0 0.66146 0.66146 1.3229 1.3229 1.3229h9.2604v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-5.2917c0-0.66146-0.66146-1.3229-1.3229-1.3229h-9.2604v-2.6458h10.583v-2.6458h-10.583z`,
  T: `m8.6e-6 -9.6667e-7v2.6458h5.2917v10.583h2.6458v-10.583h5.2917v-2.6458z`,
  U: `m5.9e-6 -9.6667e-7v10.583c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-10.583h-2.6458v10.583h-7.9375v-10.583z`,
  V: `m5.9e-6 -9.6667e-7v7.9375l5.2917 5.2917h2.6458l5.2917-5.2917v-7.9375h-2.6458v6.6146l-3.9688 3.9688-2.6458-2.6458-1.3229-1.3229v-6.6146z`,
  W: `m5.9e-6 -1.2667e-6v10.583l2.6458 2.6458h2.6458l1.3229-1.3229 1.3229 1.3229h2.6458l2.6458-2.6458v-10.583h-2.6458v10.583h-2.6458v-2.6458h-2.6458v2.6458h-2.6458v-10.583z`,
  X: `m2.205-1.2667e-6 -2.205 2.205 4.4096 4.4096-4.4096 4.4096 2.205 2.205 4.4096-4.4096 4.4096 4.4096 2.205-2.205-4.4095-4.4096 4.4095-4.4096-2.205-2.205-4.4096 4.4095z`,
  Y: `m5.9e-6 -2.6667e-7v5.2917c0 1.3229 1.3229 2.6458 2.6458 2.6458h2.6458v5.2917h2.6458v-5.2917h2.6458c1.3229 0 2.6458-1.3229 2.6458-2.6458v-5.2917h-2.6458v5.2917h-7.9375v-5.2917z`,
  Z: `m5.9e-6 -1.2667e-6v2.6458h8.3783c-2.7928 2.7928-5.5855 5.5855-8.3783 8.3783v2.205h13.229v-2.6458h-8.3783c2.7928-2.7928 5.5855-5.5855 8.3783-8.3783v-2.205h-2.205z`,
  0: `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v7.9375c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375c1.3229 0 2.6458-1.3229 2.6458-2.6458v-7.9375c0-1.3229-1.3229-2.6458-2.6458-2.6458zm1.7637 2.6458h6.1738v6.1738zm-1.7637 1.7637 6.1738 6.1738h-6.1738z`,
  1: `m5.2917-9.6667e-7 -2.6458 2.6458h2.6458v10.583h2.6458v-13.229z`,
  2: `m5.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-7.9375c-1.3229 0-2.6458 1.3229-2.6458 2.6458v5.2917h13.229v-2.6458h-10.583v-2.6458h9.2604c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458z`,
  3: `m5.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-7.9375v2.6458h7.9375v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66146-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229z`,
  4: `m5.6e-6 -1.2667e-6v7.9375h10.583v5.2917h2.6458v-13.229h-2.6458v5.2917h-7.9375v-5.2917z`,
  5: `m5.9e-6 -1.2667e-6v7.9375h10.583v2.6458h-10.583v2.6458h11.906c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458h-7.9375v-2.6458h10.583v-2.6458z`,
  6: `m2.6458-1.2667e-6c-1.3229 0-2.6458 1.3229-2.6458 2.6458v9.2604c0 0.66146 0.66146 1.3229 1.3229 1.3229h10.583c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-1.3229-1.3229-2.6458-2.6458-2.6458h-7.9375v-2.6458h10.583v-2.6458zm0 7.9375h7.9375v2.6458h-7.9375z`,
  7: `m8.6e-6 -9.6667e-7v2.6458h10.583v2.6458h-5.2917v2.6458h5.2917v5.2917h2.6458v-13.229z`,
  8: `m1.3229-1.2667e-6c-0.66146 0-1.3229 0.66147-1.3229 1.3229v3.9688c0 0.66146 0.66146 1.3229 1.3229 1.3229-0.66146 0-1.3229 0.66146-1.3229 1.3229v3.9688c0 0.66146 0.66146 1.3229 1.3229 1.3229h10.583c0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229 0.66146 0 1.3229-0.66146 1.3229-1.3229v-3.9688c0-0.66145-0.66146-1.3229-1.3229-1.3229zm1.3229 2.6458h7.9375v2.6458h-7.9375zm0 5.2917h7.9375v2.6458h-7.9375z`,
  9: `m2.6458-9.6667e-7c-1.3229 0-2.6458 1.3229-2.6458 2.6458v2.6458c0 1.3229 1.3229 2.6458 2.6458 2.6458h7.9375v5.2917h2.6458v-11.906c0-0.66145-0.66146-1.3229-1.3229-1.3229zm0 2.6458h7.9375v2.6458h-7.9375z`,
  ".": `m5.2917 10.583h2.6458v2.6458h-2.6458z`,
};

function textToSVG({
  text,
  cw = 50,
  ch = 50,
  letterSpacing = 1.3229,
  fill,
  stroke,
  strokeWidth = 0.3,
}) {
  let characters = "";
  let x = 0;
  [...text].forEach((c) => {
    if (c !== " ") {
      characters += `
        <g 
            transform="translate(${x} 0)" 
            fill="${fill || "none"}" 
            ${stroke ? `stroke="${stroke}" stroke-width="${strokeWidth}"` : ""}>
            <path d="${FONT1[c]}" filter="url(#blur-1)"/>
            <path d="${FONT1[c]}"/>   
        </g>
    `;
    }
    x += 13.229 + letterSpacing;
  });

  const svg = `
    <svg version="1.1" viewBox="-5 -5 ${
      (13.229 + letterSpacing) * text.length + 10.0
    } 23.229" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur-1" x="-.091554" y="-.091554" width="1.1831" height="1.1831" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.50465728"/>
      </filter>
      <linearGradient id="gradient-ghost" x1="6.6146" x2="6.6146" y1="-2.6667e-7" y2="13.229" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff" offset="0"/>
        <stop stop-color="#fff" stop-opacity=".035294" offset=".7"/>
        <stop stop-color="#fff" offset="1"/>
      </linearGradient>
      <linearGradient id="gradient-metal" x1="6.6146" x2="6.6146" y1="-2.6667e-7" y2="13.229" gradientUnits="userSpaceOnUse">
        <stop stop-color="#505050" offset="0"/>
        <stop stop-color="#fff" offset=".65517"/>
        <stop stop-color="#4c4c4c" offset=".69655"/>
        <stop stop-color="#fff" offset="1"/>
     </linearGradient>
    </defs>
    ${characters}
    </svg>
    `;
  return svg;
}

const palette1 = [
  [255, 0, 0],
  [32, 32, 32],
  [32, 32, 64],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette1.hit = [255, 128, 128];

const gridPalette1 = [
  [64, 64, 64],
  [100, 100, 100],
  [64, 64, 64],
  [255, 32, 32],

  /*
    [96, 96, 110],
    [96, 96, 110],
    [96, 96, 110],
    [255, 128, 128],
    */
];
gridPalette1.noise = [8, 8, 8];
gridPalette1.accent = [255, 32, 32];
//gridPalette1.bg = [0, 0, 0, 1];
gridPalette1.hit = [255, 128, 128];

const palette2 = [
  [255, 128, 0],
  [0, 0, 0],
  [255, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette2.hit = [255, 255, 128];

const gridPalette2 = [
  [96, 32, 32],
  [128, 32, 32],
  [255, 128, 32],
  [128, 32, 32],
  [96, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
  [32, 32, 32],
];
gridPalette2.accent = [255, 225, 32];
gridPalette2.noise = [128, 32, 32];
gridPalette2.hit = [255, 225, 32];

const palette3 = [
  [0, 64, 250],
  [0, 16, 32],
  [0, 32, 32],
  [0, 0, 32],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette3.hit = [0, 64, 255];

const gridPalette3 = [
  [8, 8, 16],
  [8, 16, 64],
  [8, 32, 128],
  [8, 16, 64],
];
gridPalette3.accent = [255, 16, 16];
gridPalette3.noise = [32, 50, 255];
gridPalette3.hit = [255, 128, 128];
/*
  const gridPalette3 = [
    [0, 32, 150],
    [0, 32, 200],
    [0, 64, 255],
    [0, 32, 200],
    [0, 32, 150],
    [0, 16, 100],
    [0, 16, 50],
    [0, 16, 16],
    [0, 16, 50],
    [0, 16, 100],
  ];
  gridPalette3.accent = [0, 16, 16];
  //gridPalette3.noise = [16, 64, 16];
  */

const palette4 = [
  [0, 0, 0],
  [255, 32, 0],
  [0, 32, 255],

  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette4.hit = [255, 32, 255];

const gridPalette4 = [[32, 32, 255]];
gridPalette4.accent = [255, 32, 32];
gridPalette4.bg = [0, 0, 0, 0.3];
gridPalette4.hit = [255, 32, 32];

const palette5 = [
  [255, 255, 255],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette5.hit = [255, 255, 255];

const gridPalette5 = [
  [255, 255, 255],
  [64, 64, 64],
  [32, 32, 32],
  [64, 64, 64],
  [255, 255, 255],
  [16, 16, 16],
  [255, 255, 255],
  [16, 16, 16],
];
gridPalette5.hit = [255, 225, 255];
//gridPalette4.bg = [32, 32, 32, 0.3];

const palette6 = [
  [255, 128, 0],
  [0, 128, 255],
  [128, 64, 128],
  [0, 0, 0],
  [0, 0, 0],
];
palette6.hit = [255, 255, 255];

//const gridPalette6 = [[32, 54, 96]];
const gridPalette6 = [
  [8, 16, 32],
  [32, 54, 96],
];
//gridPalette6.noise = [32, 128, 200];
gridPalette6.noise = [16, 100, 196];
gridPalette6.accent = [255, 128, 32];
gridPalette6.hit = [255, 255, 255];

const palette7 = [
  [255, 255, 255],
  [0, 0, 0],
];
palette7.hit = [0, 0, 0];

const gridPalette7 = [[255, 255, 255]];
gridPalette7.noise = [255, 255, 255];
gridPalette7.accent = [0, 0, 0];
gridPalette7.hit = [0, 0, 0];

const palette8 = [
  [0, 255, 0],
  [0, 128, 100],
  [0, 0, 0],
];
palette8.hit = [255, 255, 200];

const gridPalette8 = [
  /*
    [0, 255, 0],
    [0, 128, 0],
    [0, 64, 0],
    [0, 32, 0],
    [0, 64, 0],
    [0, 128, 0],*/
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 32, 0],
  [0, 255, 255],
];
gridPalette8.accent = [0, 255, 255];
gridPalette8.noise = [0, 140, 64];
gridPalette8.bg = [0, 128, 0, 1];
gridPalette8.hit = [0, 255, 255];

const palette9 = [
  [255, 0, 255],
  [64, 0, 64],
  [32, 0, 32],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
palette9.hit = [255, 255, 255];

const gridPalette9 = [
  [255, 32, 255],
  [32, 32, 32],
];
gridPalette9.hit = [255, 32, 255];
/*
  const palette10 = [
    [0, 0, 0],
    [255, 32, 32],
    [32, 255, 255],
  ];
  const gridPalette10 = [[0, 0, 0]];
  gridPalette10.accent = [32, 255, 255];
  gridPalette10.noise = [32, 32, 32];
  */
const palette10 = [
  [0, 0, 0],
  [255, 32, 32],
  [32, 255, 255],
  [32, 255, 32],
  [225, 255, 32],
];
palette10.hit = [255, 255, 255];

const gridPalette10 = [
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [128, 255, 255],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [0, 28, 70],
  [255, 28, 128],
];
gridPalette10.bg = [0, 128, 170, 0.4];
gridPalette10.accent = [255, 255, 255];
gridPalette10.hit = [255, 225, 255];
//gridPalette10.noise = [32, 32, 32];

const stripePalettes = [
  palette1,
  palette2,
  palette3,
  palette4,
  palette5,
  palette6,
  palette7,
  palette8,
  palette9,
  palette10,
];

const gridPalettes = [
  gridPalette1,
  gridPalette2,
  gridPalette3,
  gridPalette4,
  gridPalette5,
  gridPalette6,
  gridPalette7,
  gridPalette8,
  gridPalette9,
  gridPalette10,
];

const lightPalette = [
  [1, 1, 1, 1],
  [1.0, 0.47, 0.87, 1],
  [1.0, 0.25, 1.0, 1],
  [1.0, 0.0, 0.0, 1],
  [1.0, 0.4, 0.1, 1],
  [1, 1.0, 0.5, 1],
  [0.1, 1.0, 0.1, 1],
  [0.43, 1.0, 1.0, 1],
  [0.6, 0.6, 1.0, 1],
  [0.3, 0.4, 1.0, 1],
  [0.1, 0.1, 0.1, 1],
];

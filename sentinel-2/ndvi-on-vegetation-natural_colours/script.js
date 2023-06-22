// inspired by Custom script repository
// ndviColorMap taken from NDVI script description
// findColor function taken from ...
// B8A is used for NDVI computation as B8A spectral response is narrower than band B08
// works on L2A data with SCL layer vegetation class
// naturalColour combination B04, B03, B02 with gain adapted to L2A surface reflectance

var naturalColour = [3 * B04, 3 * B03, 3 * B02];

let ndviColorMap = [
  [-1.0, 0x000000],
  [-0.2, 0xa50026],
  [0.0, 0xd73027],
  [0.1, 0xf46d43],
  [0.2, 0xfdae61],
  [0.3, 0xfee08b],
  [0.4, 0xffffbf],
  [0.5, 0xd9ef8b],
  [0.6, 0xa6d96a],
  [0.7, 0x66bd63],
  [0.8, 0x1a9850],
  [0.9, 0x006837],
];

function index(x, y) {
  return (x - y) / (x + y);
}

function toRGB(val) {
  return [val >>> 16, val >>> 8, val].map((x) => (x & 0xff) / 0xff);
}

function findColor(colValPairs, val) {
  let n = colValPairs.length;
  for (let i = 1; i < n; i++) {
    if (val <= colValPairs[i][0]) {
      return toRGB(colValPairs[i - 1][1]);
    }
  }
  return toRGB(colValPairs[n - 1][1]);
}

return SCL == 4 ? findColor(ndviColorMap, index(B8A, B04)) : naturalColour;

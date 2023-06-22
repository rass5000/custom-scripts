//VERSION=3

const colorRamp = [
  [0, 0xffffff],
  [0.2, 0x28b4ec],
  [0.5, 0x192a68],
];
let viz = new ColorRampVisualizer(colorRamp);

var NDWI = (B03 - B08) / (B03 + B08);

return [...viz.process(NDWI), dataMask];

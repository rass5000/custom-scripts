//VERSION=3

// This custom script visualises raw NDVI values

function setup() {
  return {
    input: ["NDVI", "dataMask"],
    output: { bands: 4 },
  };
}
const map = [
  [-1, 0xffffff],
  [-0.5, 0xfefef3],
  [0.0, 0xffffe5],
  [0.1, 0xf7fcb9],
  [0.2, 0xd9f0a3],
  [0.35, 0xaddd8e],
  [0.5, 0x78c679],
  [0.65, 0x41ab5d],
  [0.8, 0x238443],
  [0.9, 0x006837],
  [1.0, 0x004529],
];
const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(sample) {
  let rgbVis = visualizer.process(sample.NDVI * 0.0001);
  return rgbVis.concat(sample.dataMask);
}

//VERSION=3

// This custom script visualises raw FAPAR values

function setup() {
  return {
    input: ["FAPAR", "dataMask"],
    output: { bands: 4 },
  };
}
const map = [
  [0.0, 0xffffe5],
  [0.125, 0xf7fcb9],
  [0.25, 0xd9f0a3],
  [0.375, 0xaddd8e],
  [0.5, 0x78c679],
  [0.625, 0x41ab5d],
  [0.75, 0x238443],
  [0.875, 0x006837],
  [1.0, 0x004529],
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(sample) {
  let rgbVis = visualizer.process(sample.FAPAR * 0.0001);
  return rgbVis.concat(sample.dataMask);
}

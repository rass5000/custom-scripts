//VERSION=3

// This custom script visualises raw LAI values

function setup() {
  return {
    input: ["LAI", "dataMask"],
    output: { bands: 4 },
  };
}
const map = [
  [0.0, 0xffffe5],
  [1.0, 0xf7fcb9],
  [2.0, 0xd9f0a3],
  [3.0, 0xaddd8e],
  [4.0, 0x78c679],
  [5.0, 0x41ab5d],
  [6.0, 0x238443],
  [7.0, 0x006837],
  [8.0, 0x004529],
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(sample) {
  let rgbVis = visualizer.process(sample.LAI * 0.002);
  return rgbVis.concat(sample.dataMask);
}

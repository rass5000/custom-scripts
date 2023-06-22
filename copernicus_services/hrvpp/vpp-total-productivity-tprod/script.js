//VERSION=3

// This custom script visualises TPROD(total productivity)  parameter

function setup() {
  return {
    input: ["TPROD", "dataMask"],
    output: { bands: 4 },
    mosaicking: Mosaicking.TILE,
  };
}
const map = [
  [0.0, 0xffffe5],
  [82.5, 0xfff7bc],
  [165, 0xfee391],
  [247.5, 0xfec44f],
  [330, 0xfe9929],
  [412.5, 0xec7014],
  [495, 0xcc4c02],
  [577.5, 0x993404],
  [660, 0x662506],
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(samples) {
  for (let i = 0; i < samples.length; i++) {
    let sample = samples[i];
    if (sample.dataMask == 1) {
      let rgbVis = visualizer.process(sample.TPROD * 0.1);
      return rgbVis.concat(sample.dataMask);
    }
  }
}

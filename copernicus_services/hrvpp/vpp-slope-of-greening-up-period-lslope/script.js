//VERSION=3

// This custom script visualises VPP LSLOPE (slope of greening up period)  parameter

function setup() {
  return {
    input: ["LSLOPE", "dataMask"],
    output: { bands: 4 },
    mosaicking: Mosaicking.TILE,
  };
}
const map = [
  [0.0, 0x440154],
  [0.005, 0x481668],
  [0.01, 0x482878],
  [0.015, 0x443983],
  [0.02, 0x3e4a89],
  [0.025, 0x375a8c],
  [0.03, 0x31688e],
  [0.035, 0x2b758e],
  [0.04, 0x26828e],
  [0.045, 0x21918c],
  [0.05, 0x1f9e89],
  [0.055, 0x25ab82],
  [0.06, 0x35b779],
  [0.065, 0x4ec36b],
  [0.07, 0x6ccd5a],
  [0.075, 0x8ed645],
  [0.08, 0xb5de2b],
  [0.085, 0xdae319],
  [0.09, 0xfde725],
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(samples) {
  for (let i = 0; i < samples.length; i++) {
    let sample = samples[i];
    if (sample.dataMask == 1) {
      let rgbVis = visualizer.process(sample.LSLOPE * 0.0001);
      return rgbVis.concat(sample.dataMask);
    }
  }
}

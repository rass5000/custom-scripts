//VERSION=3

// This custom script visualises Seasonal Trajectories PPI

function setup() {
  return {
    input: ["PPI", "dataMask"],
    output: { bands: 4 },
    mosaicking: Mosaicking.TILE,
  };
}

const map = [
  [0.0, 0xffffe5],
  [0.375, 0xf7fcb9],
  [0.75, 0xd9f0a3],
  [1.125, 0xaddd8e],
  [1.5, 0x78c679],
  [1.875, 0x41ab5d],
  [2.25, 0x238443],
  [2.625, 0x006837],
  [3.0, 0x004529],
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(samples) {
  for (let i = 0; i < samples.length; i++) {
    let sample = samples[i];
    if (sample.dataMask == 1) {
      let rgbVis = visualizer.process(sample.PPI * 0.0001);
      return rgbVis.concat(sample.dataMask);
    }
  }
}

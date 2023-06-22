//VERSION=3
function setup() {
  return {
    input: ["QC", "dataMask"],
    output: {
      bands: 4,
      sampleType: "Auto",
    },
  };
}

const map = [
  [0, 0x5da400], //0 - High quality
  [1, 0xbdbd5b], //1 - Medium quality
  [2, 0xffc000], //2 - Low quality
  [3, 0xff0000], //3 - Minimal quality
  [255, 0xffffff], //255 - No data
];

const visualizer = new ColorMapVisualizer(map);

function evaluatePixel(sample) {
  let rgbVis = visualizer.process(sample.QC);
  return rgbVis.concat(sample.dataMask);
}

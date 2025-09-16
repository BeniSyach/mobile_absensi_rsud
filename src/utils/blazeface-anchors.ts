// blazeface-anchors.ts

export const anchors: number[][] = [];

const stride = 16;
const inputSize = 128;

for (let y = 0; y < inputSize; y += stride) {
  for (let x = 0; x < inputSize; x += stride) {
    anchors.push([x / inputSize, y / inputSize]);
  }
}

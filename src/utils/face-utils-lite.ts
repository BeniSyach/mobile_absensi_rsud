import * as jpeg from 'jpeg-js';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

export async function imageUriToTensor(
  uri: string,
  targetSize: number,
  normalize: 'zero_one' | 'neg_one_pos_one' = 'zero_one'
): Promise<Float32Array> {
  const resized = await ImageResizer.createResizedImage(
    uri,
    targetSize,
    targetSize,
    'JPEG',
    100
  );

  const base64 = await RNFS.readFile(resized.uri, 'base64');
  const buffer = Buffer.from(base64, 'base64');
  const { data, width, height } = jpeg.decode(buffer, { useTArray: true });

  if (width !== targetSize || height !== targetSize) {
    throw new Error(`Resize mismatch: got ${width}x${height}`);
  }

  const tensor = new Float32Array(width * height * 3);
  let ti = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (normalize === 'neg_one_pos_one') {
      tensor[ti++] = r / 127.5 - 1.0;
      tensor[ti++] = g / 127.5 - 1.0;
      tensor[ti++] = b / 127.5 - 1.0;
    } else {
      tensor[ti++] = r / 255.0;
      tensor[ti++] = g / 255.0;
      tensor[ti++] = b / 255.0;
    }
  }

  return tensor;
}

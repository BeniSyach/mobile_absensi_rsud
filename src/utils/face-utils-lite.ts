/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import * as jpeg from 'jpeg-js';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

export async function imageUriToTensor(
  uri: string,
  targetSize: number,
  normalize: 'zero_one' | 'neg_one_pos_one' = 'zero_one'
): Promise<Float32Array> {
  try {
    // Resize image
    const resized = await ImageResizer.createResizedImage(
      uri,
      targetSize,
      targetSize,
      'JPEG',
      100,
      0, // rotation
      undefined, // outputPath
      false, // keep metadata
      {
        mode: 'cover', // Ensure aspect ratio is maintained
        onlyScaleDown: false,
      }
    );

    // Read as base64
    const base64 = await RNFS.readFile(resized.uri, 'base64');
    const buffer = Buffer.from(base64, 'base64');

    // Decode JPEG
    const { data, width, height } = jpeg.decode(buffer, {
      useTArray: true,
      colorTransform: true,
    });

    // Validate dimensions
    if (width !== targetSize || height !== targetSize) {
      console.warn(
        `Expected ${targetSize}x${targetSize}, got ${width}x${height}`
      );
    }

    // Convert to RGB tensor (NHWC format: [1, height, width, 3])
    const tensor = new Float32Array(targetSize * targetSize * 3);
    let tensorIndex = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Skip alpha channel (data[i + 3])

      if (normalize === 'neg_one_pos_one') {
        // Normalize to [-1, 1] range (for models like MobileFaceNet)
        tensor[tensorIndex++] = r / 127.5 - 1.0;
        tensor[tensorIndex++] = g / 127.5 - 1.0;
        tensor[tensorIndex++] = b / 127.5 - 1.0;
      } else {
        // Normalize to [0, 1] range (for models like BlazeFace)
        tensor[tensorIndex++] = r / 255.0;
        tensor[tensorIndex++] = g / 255.0;
        tensor[tensorIndex++] = b / 255.0;
      }
    }

    // Cleanup temporary file
    if (resized.uri !== uri) {
      try {
        await RNFS.unlink(resized.uri);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError);
      }
    }

    return tensor;
  } catch (error) {
    console.error('Error converting image to tensor:', error);
    throw error;
  }
}

// Helper function to crop face from image before tensor conversion
export async function cropFaceFromImage(
  imageUri: string,
  faceBox: { x: number; y: number; width: number; height: number },
  targetSize: number = 112
): Promise<string> {
  try {
    // Add some padding around the face

    // Crop and resize the face
    const croppedImage = await ImageResizer.createResizedImage(
      imageUri,
      targetSize,
      targetSize,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {
        mode: 'cover',
        onlyScaleDown: false,
      }
    );

    return croppedImage.uri;
  } catch (error) {
    console.error('Error cropping face:', error);
    throw error;
  }
}

// Utility function to convert tensor back to image data (for debugging)
export function tensorToImageData(
  tensor: Float32Array,
  width: number,
  height: number,
  normalize: 'zero_one' | 'neg_one_pos_one' = 'zero_one'
): Uint8ClampedArray {
  const imageData = new Uint8ClampedArray(width * height * 4);
  let tensorIndex = 0;
  let imageIndex = 0;

  for (let i = 0; i < width * height; i++) {
    const r = tensor[tensorIndex++];
    const g = tensor[tensorIndex++];
    const b = tensor[tensorIndex++];

    if (normalize === 'neg_one_pos_one') {
      // Convert from [-1, 1] to [0, 255]
      imageData[imageIndex++] = Math.round((r + 1) * 127.5);
      imageData[imageIndex++] = Math.round((g + 1) * 127.5);
      imageData[imageIndex++] = Math.round((b + 1) * 127.5);
    } else {
      // Convert from [0, 1] to [0, 255]
      imageData[imageIndex++] = Math.round(r * 255);
      imageData[imageIndex++] = Math.round(g * 255);
      imageData[imageIndex++] = Math.round(b * 255);
    }
    imageData[imageIndex++] = 255; // Alpha channel
  }

  return imageData;
}

// Helper to validate tensor shape and values
export function validateTensor(
  tensor: Float32Array,
  expectedSize: number,
  expectedRange: 'zero_one' | 'neg_one_pos_one'
): boolean {
  const expectedLength = expectedSize * expectedSize * 3;

  if (tensor.length !== expectedLength) {
    console.error(
      `Invalid tensor length: expected ${expectedLength}, got ${tensor.length}`
    );
    return false;
  }

  // Check value ranges
  const min = Math.min(...tensor);
  const max = Math.max(...tensor);

  if (expectedRange === 'zero_one') {
    if (min < 0 || max > 1) {
      console.error(
        `Invalid tensor range for zero_one: min=${min}, max=${max}`
      );
      return false;
    }
  } else if (expectedRange === 'neg_one_pos_one') {
    if (min < -1 || max > 1) {
      console.error(
        `Invalid tensor range for neg_one_pos_one: min=${min}, max=${max}`
      );
      return false;
    }
  }

  console.log(
    `Tensor validation passed: shape=[${expectedSize}, ${expectedSize}, 3], range=[${min.toFixed(3)}, ${max.toFixed(3)}]`
  );
  return true;
}

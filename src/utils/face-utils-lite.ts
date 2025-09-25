/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

const LAPLACE_THRESHOLD = 50; // ambang lokal piksel

export async function imageUriToTensor(
  uri: string,
  targetSize: number,
  normalize: 'zero_one' | 'neg_one_pos_one' = 'zero_one'
): Promise<Float32Array> {
  let tempUri: string | null = null;

  try {
    console.log(
      `🔄 Converting image to tensor: ${uri} -> ${targetSize}x${targetSize}`
    );

    // ✅ Resize image dengan mode yang lebih aman untuk face recognition
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
        mode: 'contain', // ✅ Lebih aman untuk face - tidak crop, tapi pad
        onlyScaleDown: false,
      }
    );

    tempUri = resized.uri;

    // ✅ Validate resize result
    if (!resized.uri) {
      throw new Error('Image resizing failed - no output URI');
    }

    console.log(`📏 Resized image: ${resized.width}x${resized.height}`);

    // Read as base64
    const base64 = await RNFS.readFile(resized.uri, 'base64');
    if (!base64) {
      throw new Error('Failed to read resized image as base64');
    }

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0) {
      throw new Error('Empty buffer from base64 conversion');
    }

    // Decode JPEG
    const { data, width, height } = jpeg.decode(buffer, {
      useTArray: true,
      colorTransform: true,
    });

    console.log(
      `🖼️ Decoded image: ${width}x${height}, data length: ${data.length}`
    );

    // ✅ Validate decoded dimensions
    if (!data || data.length === 0) {
      throw new Error('JPEG decode failed - empty data');
    }

    // ✅ Expected data length validation
    const expectedDataLength = width * height * 4; // RGBA
    if (data.length !== expectedDataLength) {
      throw new Error(
        `Data length mismatch. Expected: ${expectedDataLength}, Got: ${data.length}`
      );
    }

    // ✅ Handle dimension mismatch dengan padding strategy
    let processWidth = width;
    let processHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (width !== targetSize || height !== targetSize) {
      console.warn(
        `⚠️ Size mismatch: Expected ${targetSize}x${targetSize}, got ${width}x${height}`
      );

      // Calculate padding/cropping offsets untuk center image
      offsetX = Math.max(0, Math.floor((targetSize - width) / 2));
      offsetY = Math.max(0, Math.floor((targetSize - height) / 2));

      // Limit processing area to actual image size
      processWidth = Math.min(width, targetSize);
      processHeight = Math.min(height, targetSize);
    }

    // ✅ Convert to RGB tensor dengan proper bounds checking
    const tensor = new Float32Array(targetSize * targetSize * 3);

    // Initialize dengan nilai default (hitam atau abu-abu)
    const defaultValue = normalize === 'neg_one_pos_one' ? 0.0 : 0.5; // Gray background
    tensor.fill(defaultValue);

    let tensorIndex = 0;
    let processedPixels = 0;

    for (let y = 0; y < targetSize; y++) {
      for (let x = 0; x < targetSize; x++) {
        // Calculate source coordinates
        const srcX = x - offsetX;
        const srcY = y - offsetY;

        tensorIndex = (y * targetSize + x) * 3;

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          // Within actual image bounds
          const dataIndex = (srcY * width + srcX) * 4;

          if (dataIndex + 2 < data.length) {
            const r = data[dataIndex];
            const g = data[dataIndex + 1];
            const b = data[dataIndex + 2];
            // Skip alpha channel (data[dataIndex + 3])

            if (normalize === 'neg_one_pos_one') {
              // Normalize to [-1, 1] range (for models like MobileFaceNet)
              tensor[tensorIndex] = r / 127.5 - 1.0;
              tensor[tensorIndex + 1] = g / 127.5 - 1.0;
              tensor[tensorIndex + 2] = b / 127.5 - 1.0;
            } else {
              // Normalize to [0, 1] range (for models like BlazeFace)
              tensor[tensorIndex] = r / 255.0;
              tensor[tensorIndex + 1] = g / 255.0;
              tensor[tensorIndex + 2] = b / 255.0;
            }

            processedPixels++;
          }
        }
        // Else: keep default value (padding area)
      }
    }

    console.log(`✅ Tensor conversion complete:`, {
      targetSize: `${targetSize}x${targetSize}`,
      actualSize: `${width}x${height}`,
      processedPixels,
      tensorLength: tensor.length,
      normalization: normalize,
      sampleValues: Array.from(tensor.slice(0, 9)).map((x) => x.toFixed(3)),
    });

    return tensor;
  } catch (error: any) {
    console.error('❌ Error converting image to tensor:', error);
    throw new Error(`Image to tensor conversion failed: ${error.message}`);
  } finally {
    // ✅ Cleanup temporary file
    if (tempUri && tempUri !== uri) {
      try {
        await RNFS.unlink(tempUri);
        console.log(`🗑️ Cleaned up temp file: ${tempUri}`);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup temp file:', cleanupError);
      }
    }
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

export async function imageUriToSpoofTensor(
  uri: string,
  size: number
): Promise<Float32Array> {
  let tempUri: string | null = null;

  try {
    console.log(
      `🔧 Converting image to spoof tensor: ${uri} -> ${size}x${size}`
    );

    // ✅ Resize image (sama seperti imageUriToTensor)
    const resized = await ImageResizer.createResizedImage(
      uri,
      size,
      size,
      'JPEG',
      100,
      0, // rotation
      undefined, // outputPath
      false, // keep metadata
      {
        mode: 'contain', // ✅ Consistent dengan imageUriToTensor
        onlyScaleDown: false,
      }
    );

    tempUri = resized.uri;
    console.log(`📏 Resized image: ${resized.width}x${resized.height}`);

    // ✅ Read as base64 dan decode dengan JPEG decoder (sama seperti imageUriToTensor)
    const base64 = await RNFS.readFile(resized.uri, 'base64');
    if (!base64) {
      throw new Error('Failed to read resized image as base64');
    }

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0) {
      throw new Error('Empty buffer from base64 conversion');
    }

    // ✅ Decode JPEG untuk dapat pixel data
    const { data, width, height } = jpeg.decode(buffer, {
      useTArray: true,
      colorTransform: true,
    });

    console.log(
      `🖼️ Decoded image: ${width}x${height}, data length: ${data.length}`
    );

    // ✅ Validate decoded data
    if (!data || data.length === 0) {
      throw new Error('JPEG decode failed - empty data');
    }

    const expectedDataLength = width * height * 4; // RGBA
    if (data.length !== expectedDataLength) {
      throw new Error(
        `Data length mismatch. Expected: ${expectedDataLength}, Got: ${data.length}`
      );
    }

    // ✅ Handle dimension mismatch dengan padding (sama seperti imageUriToTensor)
    let processWidth = width;
    let processHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (width !== size || height !== size) {
      console.warn(
        `⚠️ Size mismatch: Expected ${size}x${size}, got ${width}x${height}`
      );
      offsetX = Math.max(0, Math.floor((size - width) / 2));
      offsetY = Math.max(0, Math.floor((size - height) / 2));
      processWidth = Math.min(width, size);
      processHeight = Math.min(height, size);
    }

    // ✅ Convert to RGB tensor dengan normalisasi yang benar
    const tensor = new Float32Array(size * size * 3);

    // Initialize dengan nilai default
    const defaultValue = 0.0; // Neutral value untuk [-1, 1] range
    tensor.fill(defaultValue);

    let processedPixels = 0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const srcX = x - offsetX;
        const srcY = y - offsetY;
        const tensorIndex = (y * size + x) * 3;

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const dataIndex = (srcY * width + srcX) * 4;

          if (dataIndex + 2 < data.length) {
            const r = data[dataIndex];
            const g = data[dataIndex + 1];
            const b = data[dataIndex + 2];
            // Skip alpha channel

            // ✅ Consistent normalization dengan imageUriToTensor
            // Normalize to [-1, 1] range
            tensor[tensorIndex] = r / 127.5 - 1.0;
            tensor[tensorIndex + 1] = g / 127.5 - 1.0;
            tensor[tensorIndex + 2] = b / 127.5 - 1.0;

            processedPixels++;
          }
        }
      }
    }

    console.log(`✅ Spoof tensor conversion complete:`, {
      targetSize: `${size}x${size}`,
      actualSize: `${width}x${height}`,
      processedPixels,
      tensorLength: tensor.length,
      sampleValues: Array.from(tensor.slice(0, 9)).map((x) => x.toFixed(4)),
      hasNaN: Array.from(tensor.slice(0, 100)).some((x) => isNaN(x)),
      range: {
        min: Math.min(...Array.from(tensor.slice(0, 1000))),
        max: Math.max(...Array.from(tensor.slice(0, 1000))),
      },
    });

    // ✅ Final validation
    if (Array.from(tensor.slice(0, 100)).some((x) => isNaN(x))) {
      throw new Error('Generated tensor contains NaN values');
    }

    return tensor;
  } catch (error: any) {
    console.error('❌ Error converting image to spoof tensor:', error);
    throw new Error(`Spoof tensor conversion failed: ${error.message}`);
  } finally {
    // ✅ Cleanup temporary file
    if (tempUri && tempUri !== uri) {
      try {
        await RNFS.unlink(tempUri);
        console.log(`🗑️ Cleaned up temp file: ${tempUri}`);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup temp file:', cleanupError);
      }
    }
  }
}

export async function laplacianSharpness(uri: string): Promise<number> {
  // Baca file sebagai buffer
  const raw = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 ke buffer
  const buffer = Buffer.from(raw, 'base64');

  // Decode JPEG → RGBA
  const decoded = jpeg.decode(buffer, { useTArray: true });
  const { data, width, height } = decoded;

  // Grayscale conversion
  const gray: number[] = new Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Kernel Laplacian
  const kernel = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0],
  ];

  let score = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let result = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = gray[(y + ky) * width + (x + kx)];
          result += pixel * kernel[ky + 1][kx + 1];
        }
      }
      if (result > LAPLACE_THRESHOLD) {
        score++;
      }
    }
  }

  return score;
}

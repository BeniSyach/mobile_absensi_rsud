/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
// lib/face-utils.ts
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

interface FacePrediction {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability?: number;
}

interface ProcessingOptions {
  margin?: number; // Default 0.2 (20%)
  targetSize?: [number, number]; // Default [112, 112]
  normalize?: boolean; // Default true
}

export const getFaceEmbedding = async (
  uriOrBase64: string,
  prediction: FacePrediction,
  model: tf.GraphModel,
  options: ProcessingOptions = {}
): Promise<Float32Array | null> => {
  // Default options
  const { margin = 0.2, targetSize = [224, 224], normalize = true } = options;

  let imageTensor: tf.Tensor3D | null = null;
  let batched: tf.Tensor4D | null = null;
  let faceTensor: tf.Tensor4D | null = null;
  let processedTensor: tf.Tensor | null = null;
  let resultTensor: tf.Tensor | tf.Tensor[] | null = null;
  let embeddingTensor: tf.Tensor | null = null;

  try {
    // Validate input
    if (!uriOrBase64 || !prediction || !model) {
      throw new Error('Missing required parameters');
    }

    // Load and decode image
    imageTensor = await loadAndDecodeImage(uriOrBase64);

    if (!imageTensor || imageTensor.shape.length !== 3) {
      throw new Error('Invalid image tensor shape');
    }

    const [imageHeight, imageWidth] = imageTensor.shape;

    // Extract and validate face coordinates
    const { topLeft, bottomRight } = prediction;
    let [x1, y1] = topLeft;
    let [x2, y2] = bottomRight;

    // Validate coordinates
    if (
      x1 < 0 ||
      y1 < 0 ||
      x2 > imageWidth ||
      y2 > imageHeight ||
      x1 >= x2 ||
      y1 >= y2
    ) {
      console.warn('Invalid face coordinates, adjusting...');
      x1 = Math.max(0, Math.min(x1, imageWidth - 1));
      y1 = Math.max(0, Math.min(y1, imageHeight - 1));
      x2 = Math.max(x1 + 1, Math.min(x2, imageWidth));
      y2 = Math.max(y1 + 1, Math.min(y2, imageHeight));
    }

    // Add margin
    const faceWidth = x2 - x1;
    const faceHeight = y2 - y1;

    const marginX = faceWidth * margin;
    const marginY = faceHeight * margin;

    x1 = Math.max(0, x1 - marginX);
    y1 = Math.max(0, y1 - marginY);
    x2 = Math.min(imageWidth, x2 + marginX);
    y2 = Math.min(imageHeight, y2 + marginY);

    // Prepare for cropping - add batch dimension
    batched = imageTensor.expandDims(0) as tf.Tensor4D;

    // Crop and resize face
    faceTensor = tf.image.cropAndResize(
      batched,
      [
        [
          y1 / imageHeight, // normalized y1
          x1 / imageWidth, // normalized x1
          y2 / imageHeight, // normalized y2
          x2 / imageWidth, // normalized x2
        ],
      ],
      [0], // box indices
      targetSize
    );

    // Preprocess for MobileFaceNet
    processedTensor = await preprocessForMobileFaceNet(faceTensor, normalize);

    // Run inference
    resultTensor = await model.executeAsync(processedTensor);

    // Handle different result formats
    if (Array.isArray(resultTensor)) {
      // Multiple outputs, take the first (usually embeddings)
      embeddingTensor = resultTensor[0];
      // Dispose other outputs
      for (let i = 1; i < resultTensor.length; i++) {
        resultTensor[i].dispose();
      }
    } else {
      embeddingTensor = resultTensor;
    }

    // Get embedding data
    const embedding = (await embeddingTensor.data()) as Float32Array;

    // Validate embedding
    if (!embedding || embedding.length === 0) {
      throw new Error('Empty or invalid embedding generated');
    }

    // Optional: L2 normalize embedding for better similarity computation
    const normalizedEmbedding = l2Normalize(embedding);

    console.log(`✅ Face embedding generated: ${normalizedEmbedding.length}D`);
    return normalizedEmbedding;
  } catch (error) {
    console.error('❌ getFaceEmbedding error:', error);
    return null;
  } finally {
    // Comprehensive cleanup
    imageTensor?.dispose();
    batched?.dispose();
    faceTensor?.dispose();
    processedTensor?.dispose();
    embeddingTensor?.dispose();

    // Handle array results cleanup
    if (Array.isArray(resultTensor)) {
      resultTensor.forEach((tensor) => tensor.dispose());
    } else if (resultTensor && resultTensor !== embeddingTensor) {
      resultTensor.dispose();
    }
  }
};

// export const getFaceEmbedding = async (
//   uriOrBase64: string,
//   prediction: FacePrediction,
//   model: tf.GraphModel,
//   options: ProcessingOptions = {}
// ): Promise<Float32Array | null> => {
//   const { margin = 0.2, targetSize = [112, 112] } = options;

//   let imageTensor: tf.Tensor3D | null = null;
//   let batched: tf.Tensor4D | null = null;
//   let faceTensor: tf.Tensor4D | null = null;
//   let processedTensor: tf.Tensor4D | null = null;
//   let embeddingTensor: tf.Tensor | null = null;

//   try {
//     // Load image
//     imageTensor = await loadAndDecodeImage(uriOrBase64);
//     const [imageHeight, imageWidth] = imageTensor.shape;

//     // Validate and add margin to face coordinates
//     let [x1, y1] = prediction.topLeft;
//     let [x2, y2] = prediction.bottomRight;

//     x1 = Math.max(0, Math.min(x1, imageWidth - 1));
//     y1 = Math.max(0, Math.min(y1, imageHeight - 1));
//     x2 = Math.max(x1 + 1, Math.min(x2, imageWidth));
//     y2 = Math.max(y1 + 1, Math.min(y2, imageHeight));

//     const faceWidth = x2 - x1;
//     const faceHeight = y2 - y1;
//     x1 = Math.max(0, x1 - faceWidth * margin);
//     y1 = Math.max(0, y1 - faceHeight * margin);
//     x2 = Math.min(imageWidth, x2 + faceWidth * margin);
//     y2 = Math.min(imageHeight, y2 + faceHeight * margin);

//     // Add batch dimension
//     batched = imageTensor.expandDims(0) as tf.Tensor4D;

//     // Crop & resize face
//     faceTensor = tf.image.cropAndResize(
//       batched,
//       [[y1 / imageHeight, x1 / imageWidth, y2 / imageHeight, x2 / imageWidth]],
//       [0],
//       targetSize
//     );

//     // **Cast to int32 for MobileFaceNet**
//     processedTensor = tf.cast(faceTensor, 'int32');

//     // Run model
//     embeddingTensor = (await model.executeAsync({
//       image_tensor: processedTensor,
//     })) as tf.Tensor;

//     const embedding = (await embeddingTensor.data()) as Float32Array;
//     return l2Normalize(embedding);
//   } catch (error) {
//     console.error('❌ getFaceEmbedding error:', error);
//     return null;
//   } finally {
//     imageTensor?.dispose();
//     batched?.dispose();
//     faceTensor?.dispose();
//     processedTensor?.dispose();
//     embeddingTensor?.dispose();
//   }
// };

// preprocessForMobileFaceNet tidak perlu lagi float32, karena model ini mengharuskan int32

// Helper function to load and decode image
const loadAndDecodeImage = async (
  uriOrBase64: string
): Promise<tf.Tensor3D> => {
  try {
    let buffer: ArrayBuffer;

    // Detect input type more reliably
    if (uriOrBase64.startsWith('data:image/')) {
      // Base64 data URL
      buffer = await fetch(uriOrBase64).then((res) => res.arrayBuffer());
    } else if (
      uriOrBase64.startsWith('file://') ||
      uriOrBase64.startsWith('http')
    ) {
      // File URI or HTTP URL
      const response = await fetch(uriOrBase64);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      buffer = await response.arrayBuffer();
    } else if (uriOrBase64.length > 500 && !uriOrBase64.includes('/')) {
      // Likely base64 string without data URL prefix
      const base64Response = await fetch(
        `data:image/jpeg;base64,${uriOrBase64}`
      );
      buffer = await base64Response.arrayBuffer();
    } else {
      throw new Error('Unsupported image format or invalid URI');
    }

    const uint8Array = new Uint8Array(buffer);
    const imageTensor = decodeJpeg(uint8Array);
    return imageTensor as tf.Tensor3D;
  } catch (error) {
    throw new Error(
      `Image loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Helper function to preprocess tensor for MobileFaceNet
const preprocessForMobileFaceNet = async (
  faceTensor: tf.Tensor4D,
  normalize: boolean
): Promise<tf.Tensor> => {
  try {
    let processed = faceTensor;

    if (normalize) {
      // Normalize to [0, 1] range first
      processed = processed.div(255.0);

      // Then normalize to [-1, 1] range (common for MobileFaceNet)
      processed = processed.sub(0.5).mul(2.0);
    }

    // Convert to appropriate data type
    // Some MobileFaceNet models expect float32, others int32
    // Try float32 first as it's more common
    return processed.toFloat();
  } catch (error) {
    // Fallback to int32 if float32 fails
    console.warn('Float32 preprocessing failed, trying int32:', error);
    return faceTensor.mul(255).toInt();
  }
};

// Helper function to L2 normalize embedding
const l2Normalize = (embedding: Float32Array): Float32Array => {
  // Calculate L2 norm
  let norm = 0;
  for (let i = 0; i < embedding.length; i++) {
    norm += embedding[i] * embedding[i];
  }
  norm = Math.sqrt(norm);

  // Avoid division by zero
  if (norm === 0) {
    console.warn('Zero norm embedding detected');
    return embedding;
  }

  // Normalize
  const normalized = new Float32Array(embedding.length);
  for (let i = 0; i < embedding.length; i++) {
    normalized[i] = embedding[i] / norm;
  }

  return normalized;
};

// Utility function to calculate cosine similarity between embeddings
export const calculateCosineSimilarity = (
  embedding1: Float32Array,
  embedding2: Float32Array
): number => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);

  return magnitude === 0 ? 0 : dotProduct / magnitude;
};

// Utility function to determine if two faces are the same person
export const areSamePerson = (
  embedding1: Float32Array,
  embedding2: Float32Array,
  threshold: number = 0.6
): boolean => {
  const similarity = calculateCosineSimilarity(embedding1, embedding2);
  return similarity >= threshold;
};

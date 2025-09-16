/* eslint-disable max-lines-per-function */
// lib/model-loader.ts
import '@tensorflow/tfjs-react-native';

import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import { Platform } from 'react-native';

interface Models {
  blazefaceModel: blazeface.BlazeFaceModel;
  mobileFaceNet: tf.GraphModel;
}

// State management
let blazefaceModel: blazeface.BlazeFaceModel | null = null;
let mobileFaceNet: tf.GraphModel | null = null;
let initialized = false;
let isLoading = false;

// Promise untuk mencegah multiple loading simultan
let loadingPromise: Promise<Models> | null = null;

export const loadModels = async (): Promise<Models> => {
  // Jika sudah initialized, return langsung
  if (initialized && blazefaceModel && mobileFaceNet) {
    return { blazefaceModel, mobileFaceNet };
  }

  // Jika sedang loading, tunggu promise yang sama
  if (isLoading && loadingPromise) {
    return loadingPromise;
  }

  // Set loading state
  isLoading = true;

  loadingPromise = (async () => {
    try {
      console.log('🔄 Loading AI models...');

      // Initialize TensorFlow backend
      await initializeTensorFlow();

      // Load models secara parallel untuk performa lebih baik
      const [loadedBlazefaceModel, loadedMobileFaceNet] = await Promise.all([
        loadBlazefaceModel(),
        loadMobileFaceNetModel(),
      ]);

      // Cache models
      blazefaceModel = loadedBlazefaceModel;
      mobileFaceNet = loadedMobileFaceNet;
      initialized = true;

      console.log('✅ Models loaded & cached successfully');

      return {
        blazefaceModel: loadedBlazefaceModel,
        mobileFaceNet: loadedMobileFaceNet,
      };
    } catch (error) {
      console.error('❌ Failed to load models:', error);
      // Reset state jika gagal
      initialized = false;
      blazefaceModel = null;
      mobileFaceNet = null;
      throw new Error(
        `Model loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

// Helper function untuk initialize TensorFlow
const initializeTensorFlow = async (): Promise<void> => {
  try {
    // Prioritas backend: rn-webgl -> webgl -> cpu
    const backends = ['rn-webgl', 'webgl', 'cpu'];

    for (const backend of backends) {
      try {
        await tf.setBackend(backend);
        await tf.ready();
        console.log(`✅ TensorFlow backend set to: ${backend}`);
        return;
      } catch (e) {
        console.warn(`⚠️ Failed to set ${backend} backend:`, e);
        continue;
      }
    }

    throw new Error('No suitable TensorFlow backend available');
  } catch (error) {
    throw new Error(
      `TensorFlow initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Helper function untuk load BlazeFace
export const loadBlazefaceModel =
  async (): Promise<blazeface.BlazeFaceModel> => {
    try {
      console.log('📥 Loading BlazeFace model...');
      const model = await blazeface.load();
      console.log('✅ BlazeFace model loaded');
      return model;
    } catch (error) {
      throw new Error(
        `BlazeFace loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

export const loadMobileFaceNetModel = async (): Promise<tf.GraphModel> => {
  if (mobileFaceNet) return mobileFaceNet;
  console.log('📥 Memuat model MobileFaceNet...');

  try {
    let model: tf.GraphModel;

    if (!__DEV__) {
      // Mode production - coba beberapa strategi loading
      console.log('🔍 Mode production: mencoba berbagai metode loading...');

      try {
        // Strategi 1: Coba bundleResourceIO dengan pengecekan file yang tepat
        console.log('🔍 Mencoba loading dengan bundleResourceIO...');

        const modelJson = require('../../android/app/src/main/res/raw/model.json');
        const modelWeights = [
          require('../../android/app/src/main/res/raw/group1_shard1of5.bin'),
          require('../../android/app/src/main/res/raw/group1_shard2of5.bin'),
          require('../../android/app/src/main/res/raw/group1_shard3of5.bin'),
          require('../../android/app/src/main/res/raw/group1_shard4of5.bin'),
          require('../../android/app/src/main/res/raw/group1_shard5of5.bin'),
        ];

        model = await tf.loadGraphModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        console.log('✅ Loading dengan bundleResourceIO berhasil');
      } catch (bundleError) {
        console.warn(
          '⚠️ bundleResourceIO gagal, mencoba metode alternatif:',
          bundleError
        );

        // Strategi 2: Coba loading asset langsung
        try {
          if (Platform.OS === 'android') {
            console.log('🔍 Mencoba loading asset Android...');
            model = await tf.loadGraphModel(
              'file:///android_asset/model/model.json'
            );
          } else {
            console.log('🔍 Mencoba loading bundle iOS...');
            // Fallback ke assets untuk iOS
            const modelJson = require('../../assets/model/model.json');
            const modelWeights = [
              require('../../assets/model/group1_shard1of5.bin'),
              require('../../assets/model/group1_shard2of5.bin'),
              require('../../assets/model/group1_shard3of5.bin'),
              require('../../assets/model/group1_shard4of5.bin'),
              require('../../assets/model/group1_shard5of5.bin'),
            ];
            model = await tf.loadGraphModel(
              bundleResourceIO(modelJson, modelWeights)
            );
          }
          console.log('✅ Metode loading alternatif berhasil');
        } catch (altError) {
          console.error('❌ Semua metode loading production gagal');
          throw new Error(
            `Production loading failed: bundleResourceIO error: ${bundleError}; Alternative method error: ${altError}`
          );
        }
      }
    } else {
      // Mode development - load dari folder assets
      console.log('🔍 Mode development: loading dari assets...');

      try {
        const modelJson = require('../../assets/model/model.json');
        const modelWeights = [
          require('../../assets/model/group1_shard1of5.bin'),
          require('../../assets/model/group1_shard2of5.bin'),
          require('../../assets/model/group1_shard3of5.bin'),
          require('../../assets/model/group1_shard4of5.bin'),
          require('../../assets/model/group1_shard5of5.bin'),
        ];

        model = await tf.loadGraphModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        console.log('✅ Loading assets development berhasil');
      } catch (devError) {
        console.warn(
          '⚠️ Assets bundleResourceIO gagal, mencoba path langsung:',
          devError
        );

        try {
          // Fallback untuk development - coba dari assets folder langsung
          model = await tf.loadGraphModel(
            require('../../assets/model/model.json')
          );
          console.log('✅ Loading langsung development berhasil');
        } catch (directError) {
          throw new Error(
            `Development loading failed: bundleResourceIO error: ${devError}; Direct loading error: ${directError}`
          );
        }
      }
    }

    // Verifikasi model berhasil dimuat
    if (!model) {
      throw new Error('Model null setelah loading');
    }

    // Opsional: Test input/output shapes model
    console.log(
      '🔍 Spek input model:',
      model.inputs.map((input) => ({
        name: input.name,
        shape: input.shape,
      }))
    );

    // Log info model
    console.log('🔍 Info model:', {
      inputs: model.inputs.length,
      outputs: model.outputs.length,
      loadedFrom: __DEV__ ? 'assets' : 'production_bundle',
    });

    mobileFaceNet = model;
    console.log('✅ Model MobileFaceNet berhasil dimuat dan di-cache');
    return mobileFaceNet;
  } catch (error) {
    console.error('❌ Gagal memuat model MobileFaceNet:', error);

    // Enhanced error logging dengan lebih detail
    if (typeof error === 'object' && error !== null) {
      const errorDetails = {
        message: (error as Error).message,
        name: (error as Error).name,
        stack: (error as Error).stack,
        // Sertakan properti tambahan
        ...Object.getOwnPropertyNames(error).reduce((acc, key) => {
          acc[key] = (error as any)[key];
          return acc;
        }, {} as any),
      };

      console.log('DETAIL_ERROR', JSON.stringify(errorDetails, null, 2));

      // Log info platform dan environment
      console.log(
        'INFO_PLATFORM',
        JSON.stringify({
          OS: Platform.OS,
          isDev: __DEV__,
          version: Platform.Version,
          backend: tf.getBackend(),
          ready: tf.ready(),
        })
      );
    }

    // Hapus cached model jika error
    mobileFaceNet = null;

    // Re-throw dengan pesan yang lebih informatif
    throw new Error(
      `MobileFaceNet loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Function untuk cleanup/dispose models (opsional, untuk memory management)
export const disposeModels = (): void => {
  try {
    if (mobileFaceNet) {
      mobileFaceNet.dispose();
      mobileFaceNet = null;
      console.log('🗑️ MobileFaceNet model disposed');
    }

    // BlazeFace model biasanya tidak perlu di-dispose secara manual
    blazefaceModel = null;
    initialized = false;

    console.log('🗑️ All models disposed');
  } catch (error) {
    console.error('❌ Error disposing models:', error);
  }
};

// Function untuk check status
export const getModelsStatus = () => {
  return {
    initialized,
    isLoading,
    blazefaceLoaded: !!blazefaceModel,
    mobileFaceNetLoaded: !!mobileFaceNet,
    tfBackend: tf.getBackend(),
    tfReady: tf.ready(),
  };
};

// Utility functions tambahan
export const preloadModels = async (): Promise<void> => {
  try {
    await loadModels();
    console.log('✅ Models berhasil di-preload');
  } catch (error) {
    console.warn('⚠️ Preload models gagal:', error);
    throw error;
  }
};

export const isMobileFaceNetLoaded = (): boolean => {
  return mobileFaceNet !== null;
};

export const isBlazeFaceLoaded = (): boolean => {
  return blazefaceModel !== null;
};

export const areAllModelsLoaded = (): boolean => {
  return initialized && !!blazefaceModel && !!mobileFaceNet;
};

export interface UseFaceUserResponse {
  status: number;
  message: string;
  photo_path: string | null;
  embedding: Float32Array;
}

export interface FaceRegisterSuccess {
  message: string;
  photo_path?: string | null;
}

export interface FaceRegisterError {
  error: string;
  message: string;
  debug?: string | null;
}

// ✅ Types untuk variabel request
export interface FaceRegisterVariables {
  nik: string;
  embedding: Float32Array;
  photos: {
    uri: string;
    type?: string;
    name?: string;
  }[];
}

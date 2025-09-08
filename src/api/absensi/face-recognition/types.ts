export interface UseFaceUserResponse {
  status: number;
  message: string;
  photo_path: string | null;
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
  photos: {
    uri: string;
    type?: string;
    name?: string;
  }[];
}

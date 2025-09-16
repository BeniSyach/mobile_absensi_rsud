export interface ResetPasswordResponse {
  message: string;
  reset_token: string;
}

export interface OtpRequest {
  otp: number;
}

export interface noHpRequest {
  no_hp: string;
}

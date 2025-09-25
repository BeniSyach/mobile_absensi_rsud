export interface ResetPasswordPayload {
  reset_token: string;
  password: string;
}

export interface ResetPasswordUserResponse {
  message: string;
}

import axios from 'axios';

export const BASE_URL = 'https://apiaci-deliserdangsehat.deliserdangkab.go.id';

export const normalizeAciPhoneNumber = (phone: string) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2);
  } else if (cleaned.length > 0 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

export const normalizeTo62 = (phone: string) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

// Create a specific axios instance for ACI Service
export const aciClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let csrfToken: string | null = null; // Default/Fallback

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

// Function to fetch CSRF token dynamically (Example implementation)
export const fetchCsrfToken = async () => {
  try {
    // Sesuaikan endpoint ini dengan backend Anda (contoh: Sanctum uses /sanctum/csrf-cookie)
    // Atau jika backend mengirim token di header response tertentu
    const _response = await aciClient.get('/sanctum/csrf-cookie');
    // Jika backend mengembalikan cookie XSRF-TOKEN, axios biasanya menanganinya otomatis jika withCredentials=true
    // Tapi jika perlu manual:
    // const token = ... extract from response
    // setCsrfToken(token);
    return true;
  } catch (error) {
    console.log('Failed to fetch CSRF token', error);
    return false;
  }
};

aciClient.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export interface AciUser {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  two_factor_secret: string | null;
  two_factor_recovery_codes: string | null;
  two_factor_confirmed_at: string | null;
  no_wa: string;
  last_login_at: string;
  last_login_ip: string;
  avatar: string;
  nik: string | null;
  upt_id: string | null;
  upt?: { id: number; nama_upt: string };
  avatar_url?: string;
  roles?: { id: number; name: string; guard_name: string }[];
}

export interface AciLoginResponse {
  status: boolean;
  token: string;
  user: AciUser;
}

export interface AciLoginPayload {
  login: string;
  password: string;
}

export interface AciActivity {
  created_at: string;
  description: string;
  ip: string;
  os: string;
  device: string;
}

export interface AciActivityResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: AciActivity[];
}

/**
 * Service khusus untuk Login ACI
 * Menggunakan endpoint: https://apiaci-deliserdangsehat.deliserdangkab.go.id/api/login
 */
export const aciLogin = async (
  data: AciLoginPayload
): Promise<AciLoginResponse> => {
  try {
    const response = await aciClient.post<AciLoginResponse>('/api/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Registrasi Publik ACI
 * Endpoint: /api/pengguna
 */
export interface AciRegisterPayload {
  name: string;
  email?: string | null;
  no_wa: string;
  nik: string;
  password: string;
  password_confirmation?: string;
}

export const aciRegister = async (data: AciRegisterPayload): Promise<any> => {
  try {
    const response = await aciClient.post('/api/pengguna', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Kirim OTP ACI
 * Endpoint: /api/pesan/kirim-otp
 */
export interface AciSendOtpPayload {
  no_wa: string;
  otp: string;
}

export const aciSendOtp = async (data: AciSendOtpPayload): Promise<any> => {
  try {
    const response = await aciClient.post('/api/pesan/kirim-otp', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Kirim OTP Reset Password ACI
 * Endpoint: /api/pesan/kirim-otp-reset
 */
export const aciSendOtpReset = async (
  data: AciSendOtpPayload
): Promise<any> => {
  try {
    const response = await aciClient.post('/api/pesan/kirim-otp-reset', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Update User ACI
 * Endpoint: PUT /api/pengguna/{id}
 */
export const aciUpdateUser = async (id: string, data: any): Promise<any> => {
  try {
    const response = await aciClient.put(`/api/pengguna/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Reset Password ACI
 * Endpoint: /api/password/reset
 */
export interface AciResetPasswordPayload {
  no_wa: string;
  password?: string;
  otp?: string;
}

// ... existing code ...
export const aciResetPassword = async (
  data: AciResetPasswordPayload
): Promise<any> => {
  try {
    const response = await aciClient.post('/api/password/reset', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Forgot Password ACI
 * Endpoint: /api/forgot-password
 */
// ... existing code ...
export const aciForgotPassword = async (data: {
  login: string;
}): Promise<any> => {
  try {
    const response = await aciClient.post('/api/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service untuk Change Password ACI (setelah OTP)
 * Endpoint: /api/change-password
 */
export interface AciChangePasswordPayload {
  login: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export const aciChangePassword = async (
  data: AciChangePasswordPayload
): Promise<any> => {
  try {
    const response = await aciClient.post('/api/change-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const aciLogout = async (token: string): Promise<any> => {
  // ... existing code ...
  try {
    const response = await aciClient.post(
      '/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Profile Services ---

export const getAciProfile = async (token: string): Promise<any> => {
  try {
    const response = await aciClient.get('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAciProfile = async (
  token: string,
  data: Partial<AciUser>
): Promise<any> => {
  try {
    const response = await aciClient.put('/api/me', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciSecurityPayload {
  email: string;
  current_password?: string;
  new_password?: string;
  new_confirm_password?: string;
}

export const updateAciSecurity = async (
  token: string,
  data: AciSecurityPayload
): Promise<any> => {
  try {
    const response = await aciClient.put('/api/security', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciLoginSession {
  created_at: string;
  description: string;
  ip: string;
  os: string;
  device: string;
}

export interface AciLoginSessionResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: AciLoginSession[];
}

export const getAciLoginSessions = async (
  token: string
): Promise<AciLoginSessionResponse> => {
  try {
    const response = await aciClient.get<AciLoginSessionResponse>(
      '/api/login-session',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAciActivities = async (
  token: string
): Promise<AciActivityResponse> => {
  try {
    const response = await aciClient.get<AciActivityResponse>('/api/activity', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciUsersResponse {
  status: number;
  message: string;
  data: AciUser[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export const getAciUsers = async (
  token: string,
  params: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciUsersResponse> => {
  try {
    const response = await aciClient.get<AciUsersResponse>('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciUserDetailResponse {
  status: number;
  message: string;
  data: AciUser;
}

// ... existing code ...
export const getAciUserDetail = async (
  token: string,
  id: string
): Promise<AciUserDetailResponse> => {
  try {
    const response = await aciClient.get<AciUserDetailResponse>(
      `/api/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciPermission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface AciRole {
  id: number;
  name: string;
  guard_name: string;
  permissions?: AciPermission[];
  created_at: string;
  updated_at: string;
}

export interface AciRolesResponse {
  status: number;
  message: string;
  data: AciRole[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export const getAciRoles = async (
  token: string,
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciRolesResponse> => {
  try {
    const response = await aciClient.get<AciRolesResponse>('/api/roles', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciPermissionsResponse {
  status: number;
  message: string;
  data: AciPermission[];
}

export const getAciPermissions = async (
  token: string
): Promise<AciPermissionsResponse> => {
  try {
    const response = await aciClient.get<AciPermissionsResponse>(
      '/api/permissions',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciRoleDetailResponse {
  status: number;
  message: string;
  data: AciRole;
}

export const getAciRoleDetail = async (
  token: string,
  id: string | number
): Promise<AciRoleDetailResponse> => {
  try {
    const response = await aciClient.get<AciRoleDetailResponse>(
      `/api/roles/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciCreateRolePayload {
  name: string;
  guard_name?: string;
  permissions: number[];
}

export const createAciRole = async (
  token: string,
  data: AciCreateRolePayload
): Promise<any> => {
  try {
    console.log('Creating role with payload:', data);
    const response = await aciClient.post('/api/roles', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Create role response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create role error:', error.response?.data || error.message);
    throw error;
  }
};

export interface AciUpdateRolePayload {
  name: string;
  guard_name?: string;
  permissions: number[];
}

export const updateAciRole = async (
  token: string,
  id: string | number,
  data: AciUpdateRolePayload
): Promise<any> => {
  try {
    console.log('Updating role with payload:', data);
    const response = await aciClient.put(`/api/roles/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update role response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update role error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAciRole = async (
  token: string,
  id: string | number
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/roles/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciCreateUserPayload {
  name: string;
  email: string;
  password: string;
  no_wa: string;
  nik: string;
  upt_id?: string | number;
  roles: number;
}

// ... existing code ...
export const createAciUser = async (
  token: string,
  data: AciCreateUserPayload
): Promise<any> => {
  try {
    console.log('Creating user with payload:', data);
    const response = await aciClient.post('/api/users', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Create user response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create user error:', error.response?.data || error.message);
    throw error;
  }
};

export interface AciUpdateUserPayload {
  name: string;
  email: string;
  no_wa: string;
  nik?: string;
  upt_id?: string | number | null;
  roles?: number;
  password?: string;
}

export interface AciUpdateUserResponse {
  status: number;
  message: string;
  data: AciUser;
}

export const updateAciUser = async (
  token: string,
  id: string,
  data: AciUpdateUserPayload
): Promise<AciUpdateUserResponse> => {
  try {
    console.log('Updating user with payload:', data);
    const response = await aciClient.put<AciUpdateUserResponse>(
      `/api/users/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Update user response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update user error:', error.response?.data || error.message);
    throw error;
  }
};

export interface AciDeleteResponse {
  status: number;
  message: string;
}

export const deleteAciUser = async (
  token: string,
  id: string
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAciAvatar = async (
  token: string,
  userId: string,
  formData: FormData
): Promise<any> => {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(`${BASE_URL}/api/acount/${userId}/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getAvatarSource = (user: AciUser | null, token?: string) => {
  if (user?.avatar_url) {
    return { uri: user.avatar_url };
  }
  if (user?.id && user?.avatar) {
    const uri = `${BASE_URL}/api/acount/${user.id}/avatar?v=${user.avatar}`;
    if (token) {
      return {
        uri,
        headers: { Authorization: `Bearer ${token}` },
      };
    }
    return { uri };
  }
  return {
    uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  };
};

// --- Masyarakat (Public Users) Services ---

export interface AciMasyarakatResponse {
  status: number;
  message: string;
  data: AciUser[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export const getAciMasyarakat = async (
  token: string,
  params: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciMasyarakatResponse> => {
  try {
    const response = await aciClient.get<AciMasyarakatResponse>(
      '/api/pengguna',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAciMasyarakat = async (
  token: string,
  data: AciCreateUserPayload
): Promise<any> => {
  try {
    const response = await aciClient.post('/api/pengguna', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAciMasyarakatDetail = async (
  token: string,
  id: string
): Promise<AciUserDetailResponse> => {
  try {
    const response = await aciClient.get<AciUserDetailResponse>(
      `/api/pengguna/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAciMasyarakat = async (
  token: string,
  id: string,
  data: AciUpdateUserPayload
): Promise<AciUpdateUserResponse> => {
  try {
    const response = await aciClient.put<AciUpdateUserResponse>(
      `/api/pengguna/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAciMasyarakat = async (
  token: string,
  id: string
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/pengguna/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// --- UPT (Unit Pelaksana Teknis) Services ---

export interface AciUpt {
  id: number;
  nama_upt: string;
  created_at: string;
  updated_at: string;
}

export interface AciUptResponse {
  status: number;
  message: string;
  data: AciUpt[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export const getAciUpts = async (
  token: string,
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciUptResponse> => {
  try {
    const response = await aciClient.get<AciUptResponse>('/api/upt', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciUptDetailResponse {
  status: number;
  message: string;
  data: AciUpt;
}

export const getAciUptDetail = async (
  token: string,
  id: string | number
): Promise<AciUptDetailResponse> => {
  try {
    const response = await aciClient.get<AciUptDetailResponse>(
      `/api/upt/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciCreateUptPayload {
  nama_upt: string;
}

export const createAciUpt = async (
  token: string,
  data: AciCreateUptPayload
): Promise<any> => {
  try {
    console.log('Creating UPT with payload:', data);
    const response = await aciClient.post('/api/upt', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Create UPT response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create UPT error:', error.response?.data || error.message);
    throw error;
  }
};

export interface AciUpdateUptPayload {
  nama_upt: string;
}

export const updateAciUpt = async (
  token: string,
  id: string | number,
  data: AciUpdateUptPayload
): Promise<any> => {
  try {
    console.log('Updating UPT with payload:', data);
    const response = await aciClient.put(`/api/upt/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update UPT response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update UPT error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAciUpt = async (
  token: string,
  id: string | number
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/upt/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- SKPD (Satuan Kerja Perangkat Daerah) Services ---

export interface AciSkpd {
  id: string | number;
  nama_skpd: string;
  kode_skpd?: string;
  kepala_skpd?: string | null;
  nip_kepala?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  isAktif?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AciSkpdResponse {
  status: number;
  message: string;
  data: AciSkpd[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export const getAciSkpds = async (
  token: string,
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciSkpdResponse> => {
  try {
    const response = await aciClient.get<AciSkpdResponse>('/api/skpd', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciSkpdDetailResponse {
  status: number;
  message: string;
  data: AciSkpd;
}

export const getAciSkpdDetail = async (
  token: string,
  id: string | number
): Promise<AciSkpdDetailResponse> => {
  try {
    const response = await aciClient.get<AciSkpdDetailResponse>(
      `/api/skpd/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciCreateSkpdPayload {
  nama_skpd: string;
  kode_skpd?: string;
  kepala_skpd?: string;
  nip_kepala?: string;
  latitude?: string | number;
  longitude?: string | number;
}

export const createAciSkpd = async (
  token: string,
  data: AciCreateSkpdPayload
): Promise<any> => {
  try {
    console.log('Creating SKPD with payload:', data);
    const response = await aciClient.post('/api/skpd', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Create SKPD response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create SKPD error:', error.response?.data || error.message);
    throw error;
  }
};

export interface AciUpdateSkpdPayload {
  nama_skpd: string;
  kode_skpd?: string;
  kepala_skpd?: string;
  nip_kepala?: string;
  latitude?: string | number;
  longitude?: string | number;
}

export const updateAciSkpd = async (
  token: string,
  id: string | number,
  data: AciUpdateSkpdPayload
): Promise<any> => {
  try {
    console.log('Updating SKPD with payload:', data);
    const response = await aciClient.put(`/api/skpd/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update SKPD response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update SKPD error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAciSkpd = async (
  token: string,
  id: string | number
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/skpd/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Kategori Services ---

export interface AciKategori {
  id: number;
  nm_kategori: string;
  nama_kategori?: string;
  created_at: string;
  updated_at: string;
}

export interface AciKecamatan {
  id: number;
  nm_kecamatan: string;
  nama_kecamatan?: string;
  name?: string;
  nama?: string;
  wilayah_kabupaten_id?: number;
}

export interface AciKelurahan {
  id: number;
  nm_kelurahan: string;
  nama_kelurahan?: string;
  name?: string;
  nama?: string;
  nm_desa?: string;
  nama_desa?: string;
  kecamatan_id: number;
}

export interface AciKategoriResponse {
  status: number;
  message: string;
  data: AciKategori[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export interface AciKecamatanResponse {
  status: number;
  message: string;
  data: AciKecamatan[];
}

export interface AciKabupaten {
  id: number;
  nama: string;
}

export interface AciKabupatenResponse {
  status: number;
  message: string;
  data: AciKabupaten[];
}

export interface AciKelurahanResponse {
  status: number;
  message: string;
  data: AciKelurahan[];
}

export const getAciKategoris = async (
  token: string,
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }
): Promise<AciKategoriResponse> => {
  try {
    const response = await aciClient.get<AciKategoriResponse>('/api/kategori', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciKategoriDetailResponse {
  status: number;
  message: string;
  data: AciKategori;
}

export const getAciKategoriDetail = async (
  token: string,
  id: string | number
): Promise<AciKategoriDetailResponse> => {
  try {
    const response = await aciClient.get<AciKategoriDetailResponse>(
      `/api/kategori/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciCreateKategoriPayload {
  nm_kategori: string;
}

export const createAciKategori = async (
  token: string,
  data: AciCreateKategoriPayload
): Promise<any> => {
  try {
    console.log('Creating Kategori with payload:', data);
    const response = await aciClient.post(
      '/api/kategori',
      {
        nm_kategori: data.nm_kategori,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Create Kategori response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      'Create Kategori error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export interface AciUpdateKategoriPayload {
  nm_kategori: string;
}

export const updateAciKategori = async (
  token: string,
  id: string | number,
  data: AciUpdateKategoriPayload
): Promise<any> => {
  try {
    console.log('Updating Kategori with payload:', data);
    const response = await aciClient.put(
      `/api/kategori/${id}`,
      {
        nm_kategori: data.nm_kategori,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Update Kategori response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      'Update Kategori error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteAciKategori = async (
  token: string,
  id: string | number
): Promise<AciDeleteResponse> => {
  try {
    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/kategori/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAciKabupatens = async (
  token: string,
  params?: { per_page?: number; search?: string }
): Promise<AciKabupatenResponse | AciKabupaten[]> => {
  try {
    const res = await aciClient.get('/api/wilayah-kabupaten', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (error: any) {
    console.error('getAciKabupatens error:', error.message);
    throw error;
  }
};

export const getAciKecamatans = async (
  token: string,
  params?: {
    per_page?: number;
    wilayah_kabupaten_id?: string | number;
    kabupaten_id?: string | number;
    id_kabupaten?: string | number;
    search?: string;
  }
): Promise<AciKecamatanResponse | AciKecamatan[]> => {
  try {
    const res = await aciClient.get('/api/wilayah-kecamatan', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    console.log(
      'API /api/wilayah-kecamatan res keys:',
      res.data ? Object.keys(res.data) : 'null'
    );
    return res.data;
  } catch (error: any) {
    console.error('getAciKecamatans error:', error.message);
    throw error;
  }
};

export const getAciKelurahans = async (
  token: string,
  kecamatanId: number,
  params?: { per_page?: number; search?: string }
): Promise<AciKelurahanResponse | AciKelurahan[]> => {
  try {
    const res = await aciClient.get('/api/wilayah-desa', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...params,
        // The user suggests 'search' is the filter key for parent ID
        search: params?.search || kecamatanId.toString(),
        // We keep these just in case, but the user emphasized 'search'
        kecamatan_id: kecamatanId,
      },
    });
    console.log(
      'API /api/wilayah-desa res keys:',
      res.data ? Object.keys(res.data) : 'null'
    );
    return res.data;
  } catch (error: any) {
    console.error('getAciKelurahans error:', error.message);
    throw error;
  }
};

// Based on actual API response which seems to be standard paginated response, not DataTables
export interface AciWilayahDesaResponse {
  status: number;
  message: string;
  data: AciKelurahan[];
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
  // Keep DataTables fields optional just in case
  draw?: number;
  recordsTotal?: number;
  recordsFiltered?: number;
}

export const getAciWilayahDesaDatatables = async (
  token: string,
  params?: {
    draw?: number; // Keep for compatibility if hybrid
    start?: number;
    length?: number;
    per_page?: number; // Add per_page
    search?: { value?: string };
    [key: string]: any;
  }
): Promise<AciWilayahDesaResponse> => {
  try {
    const response = await aciClient.get<AciWilayahDesaResponse>(
      '/api/wilayah-desa/datatables',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Laporan (Report) Services ---

export interface AciLaporan {
  id: number;
  user_id: number;
  kategori_id: number;
  judul: string;
  deskripsi: string;
  alamat?: string;
  lokasi?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  prioritas?: 'rendah' | 'sedang' | 'tinggi';
  tanggal_laporan: string;
  tanggal_selesai?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  file_masyarakat?: string | null;
  kecamatan_id?: number | null;
  kelurahan_id?: number | null;
  status_laporan?: number | string;
  catatan_admin?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    no_wa?: string;
  };
  kategori?: {
    id: number;
    nm_kategori: string;
  };
}

export interface AciLaporanResponse {
  status: number;
  message: string;
  data: AciLaporan[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    search: string;
  };
}

export interface AciLaporanDetailResponse {
  status: number;
  message: string;
  data: AciLaporan;
}

export interface AciLaporanDataTablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: AciLaporan[];
}

export interface AciCreateLaporanPayload {
  kategori_laporan_id: number;
  judul: string;
  deskripsi: string;
  alamat: string;
  kecamatan_id: number;
  kelurahan_id: number;
  latitude?: string | number;
  longitude?: string | number;
  prioritas?: 'rendah' | 'sedang' | 'tinggi';
  file_masyarakat?: File | any; // For file upload
}

export interface AciUpdateLaporanPayload {
  kategori_id?: number;
  kategori_laporan_id?: number; // Alias for consistency with API
  judul?: string;
  deskripsi?: string;
  lokasi?: string;
  alamat?: string; // Alias
  kecamatan_id?: number;
  kelurahan_id?: number;
  latitude?: string | number;
  longitude?: string | number;
  status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  prioritas?: 'rendah' | 'sedang' | 'tinggi';
  catatan_admin?: string;
  file_masyarakat?: File | any; // For file upload
}

/**
 * Get list of Laporan with pagination and search
 * GET /api/laporan
 */
export const getAciLaporans = async (
  token: string,
  params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    kategori_id?: number;
    upt_id?: number | string;
  }
): Promise<AciLaporanResponse> => {
  try {
    const response = await aciClient.get<AciLaporanResponse>('/api/laporan', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Laporan detail by ID
 * GET /api/laporan/{id}
 */
export const getAciLaporanDetail = async (
  token: string,
  id: string | number
): Promise<AciLaporanDetailResponse> => {
  try {
    const response = await aciClient.get<AciLaporanDetailResponse>(
      `/api/laporan/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new Laporan Masyarakat
 * POST /api/laporan
 */
const createLaporanFormData = (data: AciCreateLaporanPayload) => {
  const formData = new FormData();
  formData.append('kategori_laporan_id', String(data.kategori_laporan_id));
  formData.append('judul', data.judul);
  formData.append('deskripsi', data.deskripsi);
  formData.append('alamat', data.alamat);
  formData.append('kecamatan_id', String(data.kecamatan_id));
  formData.append('kelurahan_id', String(data.kelurahan_id));

  if (data.latitude !== undefined && data.latitude !== null) {
    formData.append('latitude', String(data.latitude));
  }
  if (data.longitude !== undefined && data.longitude !== null) {
    formData.append('longitude', String(data.longitude));
  }
  if (data.prioritas) formData.append('prioritas', data.prioritas);

  if (data.file_masyarakat) {
    const file = data.file_masyarakat;
    formData.append('file_masyarakat', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'upload.jpg',
    } as any);
  }
  return formData;
};

/**
 * Helper to create Laporan with file upload using fetch and multipart/form-data
 */
const createAciLaporanWithFile = async (
  token: string,
  data: AciCreateLaporanPayload
): Promise<any> => {
  const formData = createLaporanFormData(data);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
  if (csrfToken) headers['X-CSRF-TOKEN'] = csrfToken;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${BASE_URL}/api/laporan`, {
      method: 'POST',
      headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Raw Server Response (HTML?):', responseText);
      const statusText = `Status: ${response.status} ${response.statusText}`;
      const bodySnippet = responseText
        .substring(0, 100)
        .replace(/<[^>]*>/g, '');
      throw new Error(
        `Gagal memproses respon server (${statusText}).\nRespon: ${bodySnippet}...`
      );
    }

    if (!response.ok) {
      console.error('Create Laporan failed:', responseData);
      if (responseData.errors) {
        const firstErr = Object.values(responseData.errors)[0] as string[];
        throw new Error(`${responseData.message}: ${firstErr[0]}`);
      }
      throw new Error(responseData.message || 'Create laporan failed');
    }
    return responseData;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(
        'Pengiriman terlalu lama (Timeout). Pastikan koneksi internet stabil dan coba lagi.'
      );
    }
    if (error.message === 'Network request failed') {
      throw new Error(
        'Koneksi terputus saat mengirim. Silakan periksa jaringan internet Anda.'
      );
    }
    throw error;
  }
};

export const createAciLaporan = async (
  token: string,
  data: AciCreateLaporanPayload
): Promise<any> => {
  try {
    console.log(
      'Creating Laporan with payload:',
      JSON.stringify(data, null, 2)
    );

    if (data.file_masyarakat) {
      return await createAciLaporanWithFile(token, data);
    }

    const res = await aciClient.post('/api/laporan', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error(
        'Create ACI Laporan Error Response:',
        JSON.stringify(error.response.data, null, 2)
      );
    }
    console.error('Create ACI Laporan Error:', error.message);
    throw error;
  }
};

const createUpdateLaporanFormData = (data: AciUpdateLaporanPayload) => {
  const formData = new FormData();
  if (data.kategori_id)
    formData.append('kategori_id', String(data.kategori_id));
  if (data.kategori_laporan_id)
    formData.append('kategori_laporan_id', String(data.kategori_laporan_id));
  if (data.kecamatan_id)
    formData.append('kecamatan_id', String(data.kecamatan_id));
  if (data.kelurahan_id)
    formData.append('kelurahan_id', String(data.kelurahan_id));
  if (data.judul) formData.append('judul', data.judul);
  if (data.deskripsi) formData.append('deskripsi', data.deskripsi);
  if (data.lokasi) formData.append('lokasi', data.lokasi);
  if (data.alamat) formData.append('alamat', data.alamat);
  if (data.latitude) formData.append('latitude', String(data.latitude));
  if (data.longitude) formData.append('longitude', String(data.longitude));
  if (data.status) formData.append('status', data.status);
  if (data.prioritas) formData.append('prioritas', data.prioritas);
  if (data.catatan_admin) formData.append('catatan_admin', data.catatan_admin);
  if (data.file_masyarakat) {
    const file = data.file_masyarakat;
    formData.append('file_masyarakat', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'upload.jpg',
    } as any);
  }

  return formData;
};

/**
 * Update Laporan (upload ulang file)
 * POST /api/laporan/{id}
 */
export const updateAciLaporan = async (
  token: string,
  id: string | number,
  data: AciUpdateLaporanPayload
): Promise<any> => {
  try {
    console.log(
      'Updating Laporan with payload:',
      JSON.stringify(data, null, 2)
    );

    // If file is included, use FormData with POST method
    if (data.file_masyarakat) {
      const formData = createUpdateLaporanFormData(data);
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };

      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch(`${BASE_URL}/api/laporan/${id}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Update laporan failed');
      }

      console.log('Update Laporan response:', responseData);
      return responseData;
    } else {
      // Regular PUT request without file
      const response = await aciClient.put(`/api/laporan/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update Laporan response:', response.data);
      return response.data;
    }
  } catch (error: any) {
    console.error(
      'Update Laporan error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Delete Laporan
 * DELETE /api/laporan/{id}
 */
export const deleteAciLaporan = async (
  token: string,
  id: string | number
): Promise<AciDeleteResponse> => {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await aciClient.delete<AciDeleteResponse>(
      `/api/laporan/${id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Laporan list for DataTables
 * GET /api/laporan/datatables
 */
export const getAciLaporanDataTables = async (
  token: string,
  params?: {
    draw?: number;
    start?: number;
    length?: number;
    search?: { value?: string };
    order?: { column?: number; dir?: string }[];
    columns?: { data?: string; searchable?: boolean }[];
  }
): Promise<AciLaporanDataTablesResponse> => {
  try {
    const response = await aciClient.get<AciLaporanDataTablesResponse>(
      '/api/laporan/datatables',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Dashboard Statistics
 * GET /api/dashboard
 */
export interface AciDashboardResponse {
  status: boolean;
  message: string;
  rekap_status: {
    pengajuan: number;
    diterima: number;
    diverifikasi: number;
    dalam_penanganan: number;
    selesai: number;
    ditolak: number;
  };
  total: number;
  rekap_tanggal: {
    tanggal: string;
    total: number;
  }[];
  data_terbaru: any[];
}

export const getAciDashboard = async (
  token: string,
  params?: { days?: number }
): Promise<AciDashboardResponse> => {
  try {
    const response = await aciClient.get<AciDashboardResponse>(
      '/api/dashboard',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAciDashboardMasyarakat = async (
  token: string,
  params?: { days?: number }
): Promise<AciDashboardResponse> => {
  try {
    const response = await aciClient.get<AciDashboardResponse>(
      '/api/dashboard/masyarakat',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReportImageSource = (report: any) => {
  if (!report) return null;

  if (report.file_url) return { uri: report.file_url };

  const path = report.file_masyarakat || report.file_path;

  if (path) {
    if (path.startsWith('http')) return { uri: path };

    // Update based on user feedback: add report ID as subfolder after 'masyarakat/'
    const reportId = report.id;
    if (reportId) {
      return {
        uri: `${BASE_URL}/storage/laporan/masyarakat/${reportId}/${path}`,
      };
    }

    return { uri: `${BASE_URL}/storage/laporan/masyarakat/${path}` };
  }

  return null;
};

// --- Update Laporan Status Service ---

export interface AciUpdateLaporanStatusPayload {
  status_laporan: number;
  penerima_keterangan?: string;
  penerima_keterangan_tolak?: string;
  verif_keterangan?: string;
  verif_keterangan_tolak?: string;
  verif_file?: any; // File
  penanganan_keterangan?: string;
  penanganan_keterangan_tolak?: string;
  selesai_keterangan?: string;
  selesai_keterangan_tolak?: string;
}

const createUpdateStatusFormData = (data: AciUpdateLaporanStatusPayload) => {
  const formData = new FormData();
  formData.append('status_laporan', data.status_laporan.toString());

  if (data.penerima_keterangan)
    formData.append('penerima_keterangan', data.penerima_keterangan);
  if (data.penerima_keterangan_tolak)
    formData.append(
      'penerima_keterangan_tolak',
      data.penerima_keterangan_tolak
    );
  if (data.verif_keterangan)
    formData.append('verif_keterangan', data.verif_keterangan);
  if (data.verif_keterangan_tolak)
    formData.append('verif_keterangan_tolak', data.verif_keterangan_tolak);
  if (data.penanganan_keterangan)
    formData.append('penanganan_keterangan', data.penanganan_keterangan);
  if (data.penanganan_keterangan_tolak)
    formData.append(
      'penanganan_keterangan_tolak',
      data.penanganan_keterangan_tolak
    );
  if (data.selesai_keterangan)
    formData.append('selesai_keterangan', data.selesai_keterangan);
  if (data.selesai_keterangan_tolak)
    formData.append('selesai_keterangan_tolak', data.selesai_keterangan_tolak);
  if (data.verif_file) {
    formData.append('verif_file', data.verif_file);
  }
  return formData;
};

export const updateAciLaporanStatus = async (
  token: string,
  id: string | number,
  data: AciUpdateLaporanStatusPayload
): Promise<any> => {
  try {
    const formData = createUpdateStatusFormData(data);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(
      `${BASE_URL}/api/laporan/update-status/${id}`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Update Laporan Status failed:', responseData);
      throw new Error(responseData.message || 'Update status laporan failed');
    }

    return responseData;
  } catch (error: any) {
    console.error('Update Laporan Status error:', error.message);
    throw error;
  }
};

// --- Rekap (Summary) Services ---

export interface AciRekapFilters {
  tanggal_awal?: string;
  tanggal_akhir?: string;
  kecamatan_id?: number | string;
  status_laporan?: number | string;
}

export interface AciRekapStatusItem {
  status_laporan: number;
  label: string;
  total: number;
}

export interface AciRekapStatusResponse {
  status: boolean;
  message: string;
  rekap: AciRekapStatusItem[];
  laporan: AciLaporan[];
  total: number;
}

export const getAciRekapStatus = async (
  token: string,
  params?: AciRekapFilters
): Promise<AciRekapStatusResponse> => {
  try {
    const response = await aciClient.get<AciRekapStatusResponse>('/api/rekap', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciRekapKecamatanItem {
  kecamatan_id: number;
  nama_kecamatan: string;
  total: number;
  per_status: {
    status_label: string;
    total: number;
  }[];
}

export interface AciRekapKecamatanResponse {
  status: boolean;
  message: string;
  kecamatan_id?: string;
  rekap_status?: Record<string, number>;
  total?: number;
  data?: any[];
  rekap?: AciRekapKecamatanItem[];
}

export const getAciRekapKecamatan = async (
  token: string,
  params?: AciRekapFilters
): Promise<AciRekapKecamatanResponse> => {
  try {
    const response = await aciClient.get<AciRekapKecamatanResponse>(
      '/api/rekap/kecamatan',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface AciRekapTanggalItem {
  tanggal: string;
  total: number;
}

export interface AciRekapTanggalResponse {
  status: boolean;
  message: string;
  rekap_tanggal: AciRekapTanggalItem[];
  rekap_status: Record<string, number>;
  total: number;
  data: any[];
}

export const getAciRekapTanggal = async (
  token: string,
  params?: AciRekapFilters
): Promise<AciRekapTanggalResponse> => {
  try {
    const response = await aciClient.get<AciRekapTanggalResponse>(
      '/api/rekap/tanggal',
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- PDF Rekap Services ---

export const getAciRekapPdfUrl = (
  type: 'kecamatan' | 'tanggal' | 'status',
  // token is no longer used in URL for security and to match Postman
  params?: {
    tanggal_awal?: string;
    tanggal_akhir?: string;
    kecamatan_id?: number | string;
    status_laporan?: number | string;
  }
) => {
  const endpoints = {
    kecamatan: '/api/rekap/by-kecamatan/pdf',
    tanggal: '/api/rekap/per-tanggal/pdf',
    status: '/api/rekap/status/pdf',
  };

  const queryParams = [];

  if (params) {
    if (params.status_laporan !== undefined && params.status_laporan !== null) {
      queryParams.push(`status_laporan=${params.status_laporan}`);
    }
    if (params.tanggal_awal)
      queryParams.push(`tanggal_awal=${params.tanggal_awal}`);
    if (params.tanggal_akhir)
      queryParams.push(`tanggal_akhir=${params.tanggal_akhir}`);
    if (params.kecamatan_id)
      queryParams.push(`kecamatan_id=${params.kecamatan_id}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  return `${BASE_URL}${endpoints[type]}${queryString}`;
};

export default function Ignored() {
  return null;
}

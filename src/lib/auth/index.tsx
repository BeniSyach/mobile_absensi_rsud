import { jwtDecode } from 'jwt-decode';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';

import { LogoutUser } from '@/api/auth/logout/use-logout';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, setToken } from './utils';
const storage = new MMKV();
interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  isTokenExpired: (token: TokenType) => boolean;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },
  signOut: async () => {
    try {
      await LogoutUser.mutationFn();
    } catch (error) {
      console.error('Logout API error 2:', error);
    }
    storage.clearAll();
    set({ status: 'signOut', token: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        get().signIn(userToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      console.error('Error during hydration:', e);
      get().signOut();
    }
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    const decoded: any = jwtDecode(token.access);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const isTokenExpired = (token: TokenType) =>
  _useAuth.getState().isTokenExpired(token);

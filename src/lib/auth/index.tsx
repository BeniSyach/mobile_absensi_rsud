import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  isTokenExpired: (token: TokenType) => boolean;
  isTokenNearExpiration: (token: TokenType) => boolean;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },
  signOut: () => {
    removeToken();
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
      // catch error here
      // Maybe sign_out user!
    }
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    const decoded: any = jwtDecode(token.access);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },
  isTokenNearExpiration: (token) => {
    if (!token) return false;
    const decoded: any = jwtDecode(token.access);
    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;
    const refreshThreshold = 10 * 60; // 10 menit sebelum kadaluarsa
    return timeLeft <= refreshThreshold; // Jika token kurang dari 10 menit untuk kadaluarsa
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const isTokenExpired = (token: TokenType) =>
  _useAuth.getState().isTokenExpired(token);
export const isTokenNearExpiration = (token: TokenType) =>
  _useAuth.getState().isTokenNearExpiration(token);

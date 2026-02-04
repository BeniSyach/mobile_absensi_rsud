export type LocationSelectListener = (lat: number, lng: number) => void;

let listener: LocationSelectListener | null = null;

export const setLocationListener = (fn: LocationSelectListener | null) => {
  listener = fn;
};

export const emitLocationSelected = (lat: number, lng: number) => {
  if (listener) {
    listener(lat, lng);
  }
};

export default function Ignored() {
  return null;
}

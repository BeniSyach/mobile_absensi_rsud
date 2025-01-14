export type Location = {
  id: number;
  place_name: string;
  division_name: string;
  latitude: string; // Disimpan sebagai string, sesuai dengan data JSON
  longitude: string; // Disimpan sebagai string, sesuai dengan data JSON
  radius: number;
  created_at: string;
  updated_at: string;
};

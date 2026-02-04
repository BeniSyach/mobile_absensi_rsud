import { useState } from 'react';

export const useLaporFormState = () => {
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    kategoriId: null as number | null,
    lokasi: '',
    latitude: null as number | null,
    longitude: null as number | null,
    prioritas: 'sedang' as 'rendah' | 'sedang' | 'tinggi',
    image: null as any,
  });

  const setFormField = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, setForm, setFormField };
};

export default function Ignored() {
  return null;
}

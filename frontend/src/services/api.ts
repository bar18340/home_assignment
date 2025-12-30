import axios from 'axios';
import type { Design } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const designsAPI = {
  uploadSVG: async (file: File) => {
    const formData = new FormData();
    formData.append('svg', file);
    const response = await api.post('/designs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllDesigns: async (): Promise<Design[]> => {
    const response = await api.get<Design[]>('/designs');
    return response.data;
  },

  getDesignById: async (id: string): Promise<Design> => {
    const response = await api.get<Design>(`/designs/${id}`);
    return response.data;
  },
};

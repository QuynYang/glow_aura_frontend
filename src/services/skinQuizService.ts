import apiClient from './apiClient';

export type SkinQuizAnswerPayload = {
  userId?: number | null;
  answers: { questionId: number; selectedOptionId: string }[];
};

export const skinQuizService = {
  getQuestions: async () => {
    const response = await apiClient.get('/skinquiz/questions');
    return response.data;
  },

  analyzeSkin: async (payload: SkinQuizAnswerPayload) => {
    const response = await apiClient.post('/skinquiz/analyze', payload);
    return response.data;
  },

  getSkinTypeDetails: async (skinType: string) => {
    const response = await apiClient.get(`/skinquiz/skin-types/${encodeURIComponent(skinType)}`);
    return response.data;
  },

  getRecommendations: async (skinType: string, take = 12) => {
    const response = await apiClient.get(`/skinquiz/recommendations/${encodeURIComponent(skinType)}`, {
      params: { take },
    });
    const data = response.data;
    if (data?.products && Array.isArray(data.products)) return data.products;
    return Array.isArray(data) ? data : [];
  },

  getQuizStatus: async (userId: number) => {
    const response = await apiClient.get(`/skinquiz/status/${userId}`);
    return response.data;
  },
};
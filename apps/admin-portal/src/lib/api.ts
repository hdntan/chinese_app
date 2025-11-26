import axios from 'axios';

export interface HskLevel {
  id: number;
  level: number;
  name: string;
  description?: string;
}

export interface Lesson {
  id: number;
  levelId: number;
  level?: HskLevel;
  title: string;
  description?: string;
  type: 'VOCABULARY' | 'GRAMMAR' | 'CONVERSATION';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFree: boolean;
  orderIndex: number;
  mediaUrl?: string;
}

export interface Vocabulary {
  id: number;
  lessonId: number;
  lesson?: Lesson;
  hanzi: string;
  pinyin: string;
  meaningVn: string;
  audioUrl?: string;
  strokeOrderSvg?: string;
  exampleHanzi?: string;
  exampleMeaning?: string;
}

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getLevels = async (): Promise<HskLevel[]> => {
  const response = await api.get('/levels');
  return response.data;
};

export const createLevel = async (data: Omit<HskLevel, 'id'>) => {
  const response = await api.post('/levels', data);
  return response.data;
};

export const deleteLevel = async (id: number) => {
  const response = await api.delete(`/levels/${id}`);
  return response.data;
};

// Lessons
export const getLessons = async (): Promise<Lesson[]> => {
  const response = await api.get('/lessons');
  return response.data;
};

export const createLesson = async (data: Omit<Lesson, 'id' | 'level'>) => {
  const response = await api.post('/lessons', data);
  return response.data;
};

export const deleteLesson = async (id: number) => {
  const response = await api.delete(`/lessons/${id}`);
  return response.data;
};

// Vocabularies
export const getVocabularies = async (): Promise<Vocabulary[]> => {
  const response = await api.get('/vocabularies');
  return response.data;
};

export const createVocabulary = async (data: Omit<Vocabulary, 'id' | 'lesson'>) => {
  const response = await api.post('/vocabularies', data);
  return response.data;
};

export const deleteVocabulary = async (id: number) => {
  const response = await api.delete(`/vocabularies/${id}`);
  return response.data;
};

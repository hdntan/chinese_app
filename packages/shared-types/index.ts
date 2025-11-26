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

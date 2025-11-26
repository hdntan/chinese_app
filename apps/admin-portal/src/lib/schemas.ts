import { z } from 'zod';

export const levelSchema = z.object({
  level: z.coerce.number().min(1, 'Level must be at least 1').max(6, 'Level must be at most 6'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const lessonSchema = z.object({
  levelId: z.coerce.number().min(1, 'Level is required'),
  title: z.string().min(1, 'Title is required'),
  orderIndex: z.coerce.number().min(1, 'Order index must be at least 1'),
});

export const vocabularySchema = z.object({
  lessonId: z.coerce.number().min(1, 'Lesson is required'),
  hanzi: z.string().min(1, 'Hanzi is required'),
  pinyin: z.string().min(1, 'Pinyin is required'),
  meaningVn: z.string().min(1, 'Meaning (VN) is required'),
});

export const dialogueLineSchema = z.object({
  lessonId: z.coerce.number().min(1, 'Lesson is required'),
  roleName: z.string().min(1, 'Role name is required'),
  contentHanzi: z.string().min(1, 'Content (Hanzi) is required'),
  contentPinyin: z.string().min(1, 'Content (Pinyin) is required'),
  meaningVn: z.string().min(1, 'Meaning (VN) is required'),
  orderIndex: z.coerce.number().min(1, 'Order index must be at least 1'),
});

export type LevelFormData = z.infer<typeof levelSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type VocabularyFormData = z.infer<typeof vocabularySchema>;
export type DialogueLineFormData = z.infer<typeof dialogueLineSchema>;

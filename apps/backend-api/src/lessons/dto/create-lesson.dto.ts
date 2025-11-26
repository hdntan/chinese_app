import { LessonType, ContentStatus } from '@prisma/client';

export class CreateLessonDto {
  levelId: number;
  title: string;
  description?: string;
  type?: LessonType;
  status?: ContentStatus;
  isFree?: boolean;
  orderIndex: number;
  mediaUrl?: string;
}

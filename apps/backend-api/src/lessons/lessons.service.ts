import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: createLessonDto,
    });
  }

  findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { level: true },
    });
  }

  findOne(id: number) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: { level: true, vocabularies: true },
    });
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  remove(id: number) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}

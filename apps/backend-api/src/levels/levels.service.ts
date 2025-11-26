import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  create(createLevelDto: CreateLevelDto) {
    return this.prisma.hskLevel.create({
      data: createLevelDto,
    });
  }

  findAll() {
    return this.prisma.hskLevel.findMany({
      orderBy: { level: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.hskLevel.findUnique({
      where: { id },
      include: { lessons: true },
    });
  }

  update(id: number, updateLevelDto: UpdateLevelDto) {
    return this.prisma.hskLevel.update({
      where: { id },
      data: updateLevelDto,
    });
  }

  remove(id: number) {
    return this.prisma.hskLevel.delete({
      where: { id },
    });
  }
}

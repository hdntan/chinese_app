import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabulariesService {
  constructor(private prisma: PrismaService) {}

  create(createVocabularyDto: CreateVocabularyDto) {
    return this.prisma.vocabulary.create({
      data: createVocabularyDto,
    });
  }

  findAll() {
    return this.prisma.vocabulary.findMany({
      include: { lesson: true },
    });
  }

  findOne(id: number) {
    return this.prisma.vocabulary.findUnique({
      where: { id },
      include: { lesson: true },
    });
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return this.prisma.vocabulary.update({
      where: { id },
      data: updateVocabularyDto,
    });
  }

  remove(id: number) {
    return this.prisma.vocabulary.delete({
      where: { id },
    });
  }
}

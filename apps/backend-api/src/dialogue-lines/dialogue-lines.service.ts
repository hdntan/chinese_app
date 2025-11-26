import { Injectable } from '@nestjs/common';
import { CreateDialogueLineDto } from './dto/create-dialogue-line.dto';
import { UpdateDialogueLineDto } from './dto/update-dialogue-line.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DialogueLinesService {
  constructor(private prisma: PrismaService) {}

  create(createDialogueLineDto: CreateDialogueLineDto) {
    return this.prisma.dialogueLine.create({
      data: createDialogueLineDto,
    });
  }

  findAll() {
    return this.prisma.dialogueLine.findMany({
      include: { lesson: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.dialogueLine.findUnique({
      where: { id },
      include: { lesson: true },
    });
  }

  update(id: number, updateDialogueLineDto: UpdateDialogueLineDto) {
    return this.prisma.dialogueLine.update({
      where: { id },
      data: updateDialogueLineDto,
    });
  }

  remove(id: number) {
    return this.prisma.dialogueLine.delete({
      where: { id },
    });
  }
}

import { Module } from '@nestjs/common';
import { DialogueLinesService } from './dialogue-lines.service';
import { DialogueLinesController } from './dialogue-lines.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DialogueLinesController],
  providers: [DialogueLinesService],
})
export class DialogueLinesModule {}

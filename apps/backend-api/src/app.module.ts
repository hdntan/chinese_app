import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LevelsModule } from './levels/levels.module';
import { VocabulariesModule } from './vocabularies/vocabularies.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [LevelsModule, LessonsModule, VocabulariesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

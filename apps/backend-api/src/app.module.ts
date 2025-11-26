import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LevelsModule } from './levels/levels.module';
import { LessonsModule } from './lessons/lessons.module';
import { VocabulariesModule } from './vocabularies/vocabularies.module';
import { DialogueLinesModule } from './dialogue-lines/dialogue-lines.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    LevelsModule,
    LessonsModule,
    VocabulariesModule,
    DialogueLinesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

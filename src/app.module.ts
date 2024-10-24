import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { DatabaseModule } from './database/database.module';
import { QuestionScheduler } from './scheduler/question.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 3600, max: 100 }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, QuestionScheduler],
})
export class AppModule {}

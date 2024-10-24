import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/database/entities/question.entity';
import { QuestionRepository } from './questions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRepository],
  exports: [QuestionsService],
})
export class QuestionsModule {}

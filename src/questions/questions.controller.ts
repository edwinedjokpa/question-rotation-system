/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  async getQuestion(@Query('region') region: string) {
    return await this.questionsService.getAssignedQuestion(region);
  }
}

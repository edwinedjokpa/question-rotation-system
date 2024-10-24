/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Question } from 'src/database/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionRepository extends Repository<Question> {}

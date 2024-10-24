/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/database/entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionRepository } from './questions.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: QuestionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const newQuestion = this.questionsRepository.create({
      ...createQuestionDto,
    });

    return await this.questionsRepository.save(newQuestion);
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionsRepository.find();
  }

  async getAssignedQuestion(region: string): Promise<Question | string> {
    const cacheKey = `assigned_question_${region}`;
    const cachedQuestion = await this.cacheManager.get<Question>(cacheKey);

    if (cachedQuestion) {
      return cachedQuestion;
    }

    // Fetch the question based on region and current cycle
    const currentCycle = await this.getCurrentCycle();

    const question = await this.questionsRepository.findOne({
      where: { region: region, assignedCycle: currentCycle },
    });

    if (!question) {
      return `No question found for the current cycle: ${currentCycle}`;
    }

    if (question) {
      await this.cacheManager.set(cacheKey, question, 3600);
    }

    return question;
  }

  private async getCurrentCycle(): Promise<number> {
    // Get the default cycle start date from the configuration
    const defaultCycleStartDate =
      this.configService.get<string>('CYCLE_START_DATE');

    const defaultCycleDuration =
      this.configService.get<number>('CYCLE_DURATION');

    // Parse the start date
    const startDate = new Date(defaultCycleStartDate);

    // Parse the cycle duration
    const cycleDuration = +defaultCycleDuration;

    // Get the current date
    const now = new Date();

    // Parse the current date to Singapore time
    const nowInSGT = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
    );

    // Calculate the difference in milliseconds
    const diffInMilliseconds = nowInSGT.getTime() - startDate.getTime();

    // Calculate the number of milliseconds in a week
    const millisecondsInAWeek = cycleDuration * 24 * 60 * 60 * 1000;

    // Calculate the current cycle (weeks since start date)
    const currentCycle =
      Math.floor(diffInMilliseconds / millisecondsInAWeek) + 1;

    // Ensure cycle starts from 1
    return Math.max(currentCycle, 1);
  }

  private getNewQuestionsForCycle(
    questions: Question[],
    currentCycle: number,
  ): Question[] {
    return questions.filter(
      (question) => question.assignedCycle === currentCycle,
    );
  }

  public async updateAssignments() {
    // Get the current cycle
    const currentCycle = await this.getCurrentCycle();

    // Fetch all questions
    const questions = await this.getAllQuestions();

    // Filter or select new questions for the current cycle
    const newQuestions = this.getNewQuestionsForCycle(questions, currentCycle);

    for (const question of newQuestions) {
      // Invalidate or update cache for this region
      const cacheKey = `assigned_question_${question.region}`;
      await this.cacheManager.set(cacheKey, question, 3600);
    }
  }
}

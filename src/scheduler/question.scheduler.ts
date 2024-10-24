/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class QuestionScheduler {
  private readonly logger = new Logger(QuestionScheduler.name);
  constructor(private readonly questionsService: QuestionsService) {}

  // Every Monday at 7 PM SGT
  @Cron('0 19 * * 1', { timeZone: 'Asia/Singapore' })
  async handleCron() {
    try {
      await this.questionsService.updateAssignments();
      this.logger.verbose('Cron Executed Successfully');
    } catch (error) {
      this.logger.error('Error executing cron job');
      console.log(error);
    }
  }
}

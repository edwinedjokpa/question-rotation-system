/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsInt()
  assignedCycle: number;
}

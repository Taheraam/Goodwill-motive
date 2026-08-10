import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswerItem {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  selectedOption: number;
}

export class SubmitQuizAttemptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerItem)
  answers: QuizAnswerItem[];
}

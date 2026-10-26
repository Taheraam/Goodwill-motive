import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswerItem {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsInt()
  @Min(0)
  selectedOption: number;
}

export class SubmitQuizAttemptDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerItem)
  answers: QuizAnswerItem[];
}

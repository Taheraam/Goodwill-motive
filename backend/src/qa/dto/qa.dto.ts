import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(5000)
  content: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty({ message: 'Question ID is required' })
  questionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Answer content is required' })
  @MaxLength(5000)
  content: string;
}

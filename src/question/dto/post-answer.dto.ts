import { IsNotEmpty } from 'class-validator';

export class PostAnswerDto {
  @IsNotEmpty()
  readonly answer: string;
  @IsNotEmpty()
  readonly username: string;
}

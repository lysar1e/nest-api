import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AddQuestionDto } from './dto/add-question.dto';
import { PostAnswerDto } from './dto/post-answer.dto';
import { LikeAnswerDto } from './dto/like-answer.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('add')
  addQuestion(@Body() addQuestionDto: AddQuestionDto) {
    return this.questionService.createQuestion(addQuestionDto);
  }

  @Get()
  getAllQuestions(@Query('page') page: string) {
    return this.questionService.getAllQuestions(page);
  }

  @Get(':id')
  getQuestionById(@Param('id') id: string) {
    return this.questionService.getQuestionById(id);
  }

  @Post('answer/:id')
  postAnswer(@Param('id') id: string, @Body() postAnswerDto: PostAnswerDto) {
    return this.questionService.answerQuestion(id, postAnswerDto);
  }

  @Post('like-answer/:id')
  likeAnswer(@Param('id') id: string, @Body() likeAnswerDto: LikeAnswerDto) {
    return this.questionService.likeAnswer(id, likeAnswerDto);
  }
}

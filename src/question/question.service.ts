import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { AddQuestionDto } from './dto/add-question.dto';
import { PostAnswerDto } from './dto/post-answer.dto';
import { LikeAnswerDto } from './dto/like-answer.dto';
const uniqid = require('uniqid');

interface LikeAnswerOptions {
  answer: string;
  username: string;
  likes: Array<string>;
  id: string;
}

interface AnswerOptions extends LikeAnswerOptions {}
@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async createQuestion(addQuestionDto: AddQuestionDto) {
    const { question, tags, description, owner } = addQuestionDto;
    const questionObject = {
      question,
      tags,
      description,
      owner,
    };
    const quest = await new this.questionModel(questionObject);
    return quest.save();
  }

  async getAllQuestions(page) {
    const PAGE_SIZE = 5;
    const pages = parseInt(page);
    const total = await this.questionModel.countDocuments();
    const questions = await this.questionModel
      .find()
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * pages);
    return { questions, totalPages: Math.ceil(total / PAGE_SIZE) };
  }

  async getQuestionById(id: string) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('Вопрос не найден!', 404);
      return;
    }
    question.views++;
    question.save();
    return question;
  }

  async answerQuestion(questionId: string, postAnswerDto: PostAnswerDto) {
    const question = await this.questionModel.findById(questionId);
    const id = await uniqid();
    if (!question) {
      throw new HttpException('Вопрос не найден!', 404);
      return;
    }
    const answerObject: AnswerOptions = {
      answer: postAnswerDto.answer,
      username: postAnswerDto.username,
      likes: [],
      id,
    };

    // @ts-ignore
    question.answers.push(answerObject);
    return question.save();
  }

  async likeAnswer(id: string, likeAnswerDto: LikeAnswerDto) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('Вопрос не найден!', 404);
      return;
    }
    const answer = question.answers.filter(
      (item: LikeAnswerOptions) => item.id === likeAnswerDto.answerId,
    );
    if (!answer) {
      return;
    }
    answer.forEach((item: LikeAnswerOptions) => {
      const isLiked = item.likes.includes(likeAnswerDto.username);
      if (isLiked) {
        const index = item.likes.indexOf(likeAnswerDto.username);
        item.likes.splice(index, 1);
      } else {
        item.likes.push(likeAnswerDto.username);
      }
    });
    question.markModified('answers');
    return question.save();
  }
}

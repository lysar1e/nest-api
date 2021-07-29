import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';
export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  tags: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ defaultValue: [] })
  answers: [];

  @Prop({ default: 0 })
  views: number;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);

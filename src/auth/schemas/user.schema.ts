import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {IsEmail, Min} from "class-validator";
export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required:true})
    @IsEmail()
    email: string;

    @Prop()
    username: string;

    @Prop({required: true})
    @Min(6)
    password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

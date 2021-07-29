import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly username: string;
    @MinLength(6)
    readonly password: string;
}
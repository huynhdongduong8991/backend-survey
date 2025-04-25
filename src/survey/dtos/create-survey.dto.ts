import { IsString, IsNotEmpty, IsJSON, IsEmail } from 'class-validator';

export class CreateSurveyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsJSON()
    questions: any;
}

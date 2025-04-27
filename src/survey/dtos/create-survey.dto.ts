import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateSurveyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsJSON()
    questions: any;
}

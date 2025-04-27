import { IsNotEmpty, IsNumber } from "class-validator";

export class SubmissionDto {
    @IsNotEmpty()
    @IsNumber()
    surveyId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
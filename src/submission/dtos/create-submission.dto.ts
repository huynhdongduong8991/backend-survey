import { IsJSON, IsInt } from 'class-validator';

export class CreateSubmissionDto {
    @IsJSON()
    answers: any;

    @IsInt()
    surveyId: number;
}

import { IsString } from "class-validator";

export class SurveysQueryDto {
    @IsString()
    email: string;
}
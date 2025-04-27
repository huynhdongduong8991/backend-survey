import constants from "@src/config/constants";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SurveysQueryDto {
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    title: string;

    @Transform(({ value }) => Number(value) || null)
    @IsNumber()
    @IsOptional()
    page?: number = 1;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    limit?: number = constants.DEFAULT.LIST_LIMIT;
}
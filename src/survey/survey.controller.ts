import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@src/auth/guard/jwt.guard';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { Request } from 'express';
import { UserService } from '@src/user/user.service';
import { successResponse } from '@src/utils/response';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { SurveysQueryDto } from './dtos/surveys.dto';

@Controller('surveys')
export class SurveyController {
    constructor(
        private surveyService: SurveyService,
        private userService: UserService,
    ) {}

    @UseGuards(JwtGuard)
    @Post()
    async create(@GetUser() userReq, @Body() surveyDto: CreateSurveyDto) {
        const user = await this.userService.findByOptions({
            email: userReq.email,
        });
        if (!user) {
            throw new BadRequestException('User not exists.');
        }
        const data = await this.surveyService.create(surveyDto, user);
        return successResponse({ data });
    }

    @Get()
    async surveys(@Query() surveysDto: SurveysQueryDto) {
        const user = await this.userService.findByOptions({
            email: surveysDto.email,
        });
        if (!user) {
            throw new BadRequestException('User not exists.');
        }
        const data = await this.surveyService.surveys(user.id);
        return successResponse({ data });
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    async surveyDetails(@Param('id') id: string, @GetUser() userReq) {
        const user = await this.userService.findByOptions({
            email: userReq.email,
        });
        if (!user) {
            throw new BadRequestException('User not exists.');
        }
        const data = await this.surveyService.surveyDetails(+id, user);
        return successResponse({ data });
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateSurveyDto: CreateSurveyDto,
        @Req() req,
    ) {
        return this.surveyService.update(+id, updateSurveyDto, req.user);
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.surveyService.remove(+id, req.user);
    }
}

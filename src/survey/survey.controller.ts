import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
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

@Controller('surveys')
@UseGuards(JwtGuard)
export class SurveyController {
    constructor(
        private surveyService: SurveyService,
        private userService: UserService,
    ) {}

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
    findAll(@Req() req) {
        return this.surveyService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.surveyService.findOne(+id, req.user);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateSurveyDto: CreateSurveyDto,
        @Req() req,
    ) {
        return this.surveyService.update(+id, updateSurveyDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.surveyService.remove(+id, req.user);
    }
}

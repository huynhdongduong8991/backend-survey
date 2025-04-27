import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { JwtGuard } from '@src/auth/guard/jwt.guard';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { successResponse } from '@src/utils/response';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { UserService } from '@src/user/user.service';
import { SubmissionDto } from './dtos/submission.dto';
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';

@Controller('submissions')
@UseGuards(JwtGuard)
export class SubmissionController {
    constructor(
        private submissionService: SubmissionService,
        private userService: UserService,
    ) {}

    @Post()
    async create(
        @Body() createSubmissionDto: CreateSubmissionDto,
        @GetUser() userReq,
    ) {
        const user = await this.userService.findByOptions({
            email: userReq.email,
        });
        if (!user) {
            throw new RecordNotFoundException('User not exists.');
        }
        const data = await this.submissionService.create(
            createSubmissionDto,
            user,
        );
        return successResponse({ data });
    }

    @Get()
    async submissions(@Body() submissionDto: SubmissionDto) {
        const { surveyId, userId } = submissionDto;
        const data = await this.submissionService.submissions(surveyId, userId);
        return successResponse({ data });
    }
}

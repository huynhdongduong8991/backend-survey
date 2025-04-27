import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { JwtGuard } from '@src/auth/guard/jwt.guard';
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';
import { UserService } from '@src/user/user.service';
import { Response } from 'express';
import { ReportService } from './report.service';

@Controller('report')
@UseGuards(JwtGuard)
export class ReportController {
    constructor(
        private reportService: ReportService,
        private userService: UserService,
    ) {}

    @Get(':surveyId')
    async generateReport(
        @Param('surveyId') surveyId: string,
        @GetUser() userReq,
        @Res() res: Response,
    ) {
        const { email } = userReq;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new RecordNotFoundException('User not exists.');
        }
        const buffer = await this.reportService.generateReport(+surveyId, user.id);
        const suffixFilename = Date.now();
        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename=survey_report_${suffixFilename}.docx`,
        });
        res.send(buffer);
    }
}

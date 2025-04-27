import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ConfigModule } from '@nestjs/config';
import { SubmissionModule } from '@src/submission/submission.module';
import { UserModule } from '@src/user/user.module';

@Module({
    imports: [
        SubmissionModule,
        ConfigModule,
        UserModule
    ],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}

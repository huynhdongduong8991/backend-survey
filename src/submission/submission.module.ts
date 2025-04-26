import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionEntity } from '@src/entities';
import { SurveyModule } from '@src/survey/survey.module';
import { UserModule } from '@src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubmissionEntity]),
        SurveyModule,
        UserModule,
    ],
    providers: [SubmissionService],
    controllers: [SubmissionController],
})
export class SubmissionModule {}

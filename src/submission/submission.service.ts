import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyService } from '../survey/survey.service';
import { SubmissionEntity, UsersEntity } from '@src/entities';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(SubmissionEntity)
        private submissionRepository: Repository<SubmissionEntity>,
        private surveyService: SurveyService,
    ) {}

    async create(submissionDto: CreateSubmissionDto, user: UsersEntity) {
        const survey = await this.surveyService.surveyDetails(
            submissionDto.surveyId,
            user,
        );
        const submission = this.submissionRepository.create({
            ...submissionDto,
            survey,
            user,
        });
        return await this.submissionRepository.save(submission);
    }

    async submissions(surveyId: number, userId: number) {
        const submissions = await this.submissionRepository.find({
            where: { surveyId, userId },
            relations: ['survey']
        })

        if (!submissions) {
            throw new RecordNotFoundException('Submission not found.');
        }
        return submissions;
    }
}

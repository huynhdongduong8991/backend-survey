import { UsersEntity } from '@src/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyEntity } from '@src/entities';
import { Repository } from 'typeorm';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';
import { SurveysQueryDto } from './dtos/surveys.dto';

@Injectable()
export class SurveyService {
    constructor(
        @InjectRepository(SurveyEntity)
        private surveyRepository: Repository<SurveyEntity>,
    ) {}

    async create(createSurveyDto: CreateSurveyDto, user: UsersEntity) {
        const survey = this.surveyRepository.create({
            title: createSurveyDto.title,
            questions: createSurveyDto.questions,
            userId: user.id,
        });
        return await this.surveyRepository.save(survey);
    }

    async surveys(query: SurveysQueryDto, userId: number) {
        let { title, page, limit } = query;
        title = !title ? "" : title;

        const surveyQuery = this.surveyRepository
            .createQueryBuilder('survey')
            .leftJoin('users', 'user', 'user.id = survey.userId')
            .where('user.id = :userId', { userId: userId })
            .andWhere(`survey.title LIKE '%${title}%'`);

        const totalItem = await surveyQuery.getCount();
        const offset = (page - 1) * limit;
        const surveys = await surveyQuery.offset(offset).limit(limit).getMany();

        return { surveys, totalItem };
    }

    async surveyDetails(id: number, user: UsersEntity) {
        const survey = await this.surveyRepository.findOneBy({
            id,
            user: { id: user.id },
        });
        if (!survey) {
            throw new RecordNotFoundException('Survey not found');
        }
        return survey;
    }

    async update(id: number, updateSurveyDto: CreateSurveyDto, user: UsersEntity) {
        const survey = await this.surveyDetails(id, user);
        return await this.surveyRepository.save({ ...survey, ...updateSurveyDto });
    }

    async remove(id: number, user: UsersEntity) {
        const survey = await this.surveyDetails(id, user);
        return await this.surveyRepository.remove(survey);
    }
}

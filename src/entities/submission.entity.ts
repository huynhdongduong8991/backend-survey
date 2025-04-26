import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { UsersEntity, SurveyEntity } from './index';

@Entity('submission')
export class SubmissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    answers: any;

    @Column({ name: 'survey_id' })
    surveyId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => SurveyEntity, (survey) => survey.submissions)
    @JoinColumn({ name: 'survey_id', referencedColumnName: 'id' })
    survey: SurveyEntity;

    @ManyToOne(() => UsersEntity, (user) => user.submissions)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UsersEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}

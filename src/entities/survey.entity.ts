import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { UsersEntity } from './user.entity';
import { SubmissionEntity } from './submission.entity';

@Entity('survey')
export class SurveyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'title', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'questions', type: 'json' })
    questions: any;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => UsersEntity, (user) => user.surveys)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UsersEntity;

    @OneToMany(() => SubmissionEntity, (submission) => submission.survey)
    @JoinColumn({ name: 'submission_id' })
    submissions: SubmissionEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}

import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { UsersEntity } from './user.entity';

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

    @OneToOne(() => UsersEntity, (user) => user.surveys)
    user: UsersEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}

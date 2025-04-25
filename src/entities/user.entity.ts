import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { SurveyEntity } from './survey.entity';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'google_id', type: 'varchar', length: 255, unique: true, nullable: true })
    googleId: string;

    @Column({ name: 'user_id', type: 'varchar', length: 255, unique: true, nullable: true })
    userId: string;

    @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: true })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ name: 'username', type: 'varchar', length: 255, nullable: true })
    username: string;

    @OneToMany(() => SurveyEntity, (survey) => survey.userId)
    @JoinColumn({ name: 'user_id' })
    surveys: SurveyEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}

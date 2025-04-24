import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'google_id', type: 'varchar', length: 255, unique: true })
    googleId: string;

    @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ name: 'username', type: 'varchar', length: 255, nullable: true })
    username: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}

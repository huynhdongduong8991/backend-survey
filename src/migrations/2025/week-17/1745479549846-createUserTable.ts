import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1745479549846 implements MigrationInterface {
    name?: string = 'CreateUserTable' + '1745479549846';
    transaction?: boolean;

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                google_id VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );    
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`DROP TABLE IF EXISTS users;`);
    }
}

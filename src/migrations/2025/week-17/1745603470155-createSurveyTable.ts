import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSurveyTable1745603470155 implements MigrationInterface {
    name?: string = 'CreateSurveyTable' + '1745603470155';
    transaction?: boolean;
    
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            CREATE TABLE IF NOT EXISTS survey (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) DEFAULT NULL,
                questions JSON DEFAULT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );    
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            ALTER TABLE survey DROP FOREIGN KEY fk_user_id;    
        `);
        await queryRunner.manager.query(`
            DROP TABLE IF EXISTS survey;
        `);
    }
}

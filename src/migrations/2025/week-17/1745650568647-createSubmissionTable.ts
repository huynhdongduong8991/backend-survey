import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubmissionTable1745650568647 implements MigrationInterface {
    name?: string = 'CreateSubmissionTable' + '1745650568647';
    transaction?: boolean;

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            CREATE TABLE IF NOT EXISTS submission (
                id INT AUTO_INCREMENT PRIMARY KEY,
                answers JSON DEFAULT NULL,
                survey_id INT NOT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_survey_id FOREIGN KEY (survey_id) REFERENCES survey(id) ON DELETE CASCADE,
                CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            ALTER TABLE submission DROP CONSTRAINT fk_survey_id;
        `);
        await queryRunner.manager.query(`
            ALTER TABLE submission DROP CONSTRAINT fk_users_id;
        `);
        await queryRunner.manager.query(`
            DROP TABLE IF EXISTS submission;
        `);
    }

}

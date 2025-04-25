import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserTable1745579485236 implements MigrationInterface {
    name?: string = 'ModifyUserTable' + '1745579485236';
    transaction?: boolean;

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            ALTER TABLE users MODIFY COLUMN google_id VARCHAR(255) DEFAULT NULL UNIQUE;
        `);
        await queryRunner.manager.query(`
            ALTER TABLE users ADD COLUMN user_id VARCHAR(225) DEFAULT NULL UNIQUE AFTER google_id;
        `);
        await queryRunner.manager.query(`
            ALTER TABLE users ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER email;
        `);
    }
    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`
            ALTER TABLE users MODIFY COLUMN google_id VARCHAR(255) NOT NULL UNIQUE;
        `);
        await queryRunner.manager.query(`
            ALTER TABLE users DROP COLUMN user_id;
        `);
        await queryRunner.manager.query(`
            ALTER TABLE users DROP COLUMN password;
        `);
    }
}

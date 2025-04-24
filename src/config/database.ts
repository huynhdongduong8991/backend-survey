import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

export const defaultConnection = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: ['src/migrations/2025/week-17/1745479549846-createUserTable.ts'],
    entities: ['src/entities/*.ts'],
    synchronize: false,
    migrationsTransactionMode: 'each',
});

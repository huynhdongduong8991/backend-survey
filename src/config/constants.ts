import { config } from 'dotenv';
config();

export default {
    LOGIN_ROUTE: process.env.LOGIN_ROUTE ?? '/login',
    SALT_ROUNDS: 10,
};

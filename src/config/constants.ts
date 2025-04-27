import { config } from 'dotenv';
config();

export default {
    DEFAULT: {
        LIST_LIMIT: 10,
    },
    LOGIN_ROUTE: process.env.LOGIN_ROUTE ?? '/login',
    SALT_ROUNDS: 10,
};

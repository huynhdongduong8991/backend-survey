export default () => ({
    defaultConnection: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        migrations: ['dist/migrations/*.js'],
        entities: ['dist/entities/*.js'],
        synchronize: false,
    },
});

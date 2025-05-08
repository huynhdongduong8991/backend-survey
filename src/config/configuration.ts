export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        expirationTime: parseInt(process.env.JWT_EXPIRATION_TIME) || 60 * 60 * 24,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecrect: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY,
    },
    frontendEndpoint: process.env.FRONTEND_ENDPOINT,
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
        ssl: { rejectUnauthorized: false },
    },
});

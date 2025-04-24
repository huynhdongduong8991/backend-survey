import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        bodyParser: false,
    });

    const rawBodyBuffer = (req, res, buffer, encoding) => {
        if (buffer && buffer.length) {
            req.rawBody = buffer.toString(encoding || 'utf8');
        }
    };

    app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, limit: '50mb', extended: true }));
    app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '50mb' }));

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: false,
        }),
    );
    await app.listen(3000);
}

bootstrap();

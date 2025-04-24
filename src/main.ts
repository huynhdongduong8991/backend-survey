import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

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

    app.use(
        bodyParser.urlencoded({
            verify: rawBodyBuffer,
            limit: '50mb',
            extended: true,
        }),
    );
    app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '50mb' }));

    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: false,
        }),
    );
    await app.listen(3000, () => console.log('Server started on port 3000'));
}

bootstrap();

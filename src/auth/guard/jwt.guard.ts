import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ApplicationErrorException } from '../../exceptions';

export class JwtGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const authorization = request.headers['authorization'];
        const isBearerToken = authorization?.search('Bearer ') === 0;
        if (!authorization || !isBearerToken) {
            throw new ApplicationErrorException('E-00000', undefined, HttpStatus.UNAUTHORIZED);
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            if (info instanceof TokenExpiredError || info.name === 'TokenExpiredError') {
                throw new ApplicationErrorException('E-00001', undefined, HttpStatus.UNAUTHORIZED);
            }
            if (info instanceof JsonWebTokenError || info.name === 'JsonWebTokenError') {
                throw new ApplicationErrorException('E-00002', undefined, HttpStatus.UNAUTHORIZED);
            }
            throw err || info;
        }
        return user;
    }
}

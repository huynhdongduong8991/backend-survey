import { TestBed, Mocked } from '@suites/unit';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import configuration from '@src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import constants from '@src/config/constants';
import { Request, Response } from 'express';
import { ApplicationErrorException } from '@src/exceptions';
import { HttpStatus } from '@nestjs/common';

const _config = configuration();

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: Mocked<JwtService>;
    let config: Mocked<ConfigService>;

    beforeEach(async () => {
        const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

        authService = unit;
        jwtService = unitRef.get(JwtService);
        config = unitRef.get(ConfigService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(config).toBeDefined();
    });

    describe('logout', () => {
        it('should call request.logout and redirect to client URL with error', async () => {
            const requestMock = {
                logout: jest.fn((callback) => callback(
                    new ApplicationErrorException(
                        undefined,
                        'Application Error Exception',
                        HttpStatus.BAD_REQUEST,
                    )
                )),
                session: {
                    destroy: jest.fn((callback) => callback()),
                },
            } as unknown as Request;
            
            const responseMock = { redirect: jest.fn() } as unknown as Response;

            await expect(authService.logout(requestMock, responseMock))
                .rejects
                .toThrow(
                    new ApplicationErrorException(
                        undefined,
                        'Application Error Exception',
                        HttpStatus.BAD_REQUEST,
                    ),
                );

        });

        it('should call request.logout and redirect to client URL', async () => {
            const requestMock = {
                logout: jest.fn((callback) => callback()),
                session: {
                    destroy: jest.fn((callback) => callback()),
                },
            } as unknown as Request;

            const responseMock = { redirect: jest.fn() } as unknown as Response;

            config.get.mockReturnValue(_config.frontendEndpoint);

            await authService.logout(requestMock, responseMock);

            expect(requestMock.logout).toHaveBeenCalled();
            expect(requestMock.session.destroy).toHaveBeenCalled();
            expect(responseMock.redirect).toHaveBeenCalledWith(`${_config.frontendEndpoint}${constants.LOGIN_ROUTE}`);
        });
    });

    describe('signToken', () => {
        it('should sign a token with the provided payload', async () => {
            const payloadMock = {
                sub: 'googleId',
                username: 'username',
                email: 'email',
            };

            config.get.mockReturnValueOnce(_config.jwt.secret);
            config.get.mockReturnValueOnce(_config.jwt.expirationTime);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

            const { accessToken } = await authService.signToken(
                payloadMock.sub,
                payloadMock.username,
                payloadMock.email,
            );
            
            expect(jwtService.signAsync).toHaveBeenCalledWith(payloadMock, {
                expiresIn: _config.jwt.expirationTime,
                secret: _config.jwt.secret,
            });
            expect(accessToken).toEqual('accessToken');
        });
    });

    describe('googleLogin', () => {
        it('should call signToken with the provided userDto', async () => {
            const userDtoMock = {
                googleId: 'googleId',
                username: 'username',
                email: 'email',
            };

            jest.spyOn(authService, 'signToken').mockResolvedValue({ accessToken: 'accessToken' });

            const { accessToken } = await authService.googleLogin(userDtoMock);

            expect(authService.signToken).toHaveBeenCalledWith(
                userDtoMock.googleId,
                userDtoMock.username,
                userDtoMock.email,
            );
            expect(accessToken).toEqual('accessToken');
        });
    });
});

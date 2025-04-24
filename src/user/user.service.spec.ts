import { Mocked, TestBed } from "@suites/unit";
import { UserService } from "./user.service";
import { DataSource, QueryFailedError, QueryRunner, Repository } from "typeorm";
import { Users } from "@src/entities";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockDataSource, mockQueryRunner } from "@src/utils/test";
import { HttpStatus } from "@nestjs/common";
import { ApplicationErrorException } from "@src/exceptions";

describe('userService', () => {
    let dataSource: DataSource;
    let queryRunner: QueryRunner;
    let userService: UserService;
    let userRepo: Mocked<Repository<Users>>;

    beforeEach(async () => {
        queryRunner = mockQueryRunner();
        dataSource = mockDataSource(queryRunner);

        const { unit, unitRef } = await TestBed.solitary(UserService).compile();

        userService = unit;
        userRepo = unitRef.get(getRepositoryToken(Users) as string);

        userService['dataSource'] = dataSource;
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
        expect(userRepo).toBeDefined();
    });

    describe('findByGoogleId', () => {
        it('should return a user', async () => {
            const userMock = {
                id: 1,
                googleId: '1234567890',
                email: 'email',
            } as Users;

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(userMock);

            const user = await userService.findByGoogleId('1234567890');

            expect(user).toEqual(userMock);
            expect(userRepo.findOne).toHaveBeenCalledWith({
                where: { googleId: '1234567890' },
            });
        });

        it('should return null if user not found', async () => {
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

            const user = await userService.findByGoogleId(null);

            expect(user).toBeNull();
            expect(userRepo.findOne).toHaveBeenCalledWith({
                where: { googleId: null },
            });
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createDto = {
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            };

            const userMock = {
                id: 1,
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            } as Users;

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepo, 'create').mockReturnValue(userMock);
            jest.spyOn(userRepo, 'save').mockResolvedValue(userMock);

            const user = await userService.create(createDto);

            expect(user).toEqual(userMock);
            expect(userRepo.findOne).toHaveBeenCalledWith({
                where: { googleId: createDto.googleId },
            });
            expect(userRepo.create).toHaveBeenCalledWith({
                googleId: createDto.googleId,
                email: createDto.email,
                username: createDto.username,
            });
            expect(userRepo.save).toHaveBeenCalledWith(userMock);
        });

        it('should return an existing user', async () => {
            const createDto = {
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            };

            const userMock = {
                id: 1,
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            } as Users;

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(userMock);

            const user = await userService.create(createDto);

            expect(user).toEqual(userMock);
            expect(userRepo.findOne).toHaveBeenCalledWith({
                where: { googleId: createDto.googleId },
            });
        });

        it('should throw an error if user creation fails', async () => {
            const createDto = {
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            };

            const userMock = {
                id: 1,
                googleId: '1234567890',
                email: 'email',
                username: 'username',
            } as Users;

            const queryFailedError = new QueryFailedError('query', [], new Error('Query failed'));

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepo, 'create').mockReturnValue(userMock);
            jest.spyOn(userRepo, 'save').mockRejectedValue(queryFailedError);
            jest.spyOn(queryRunner, 'rollbackTransaction').mockResolvedValue();

            await expect(userService.create(createDto))
                .rejects
                .toThrow(new ApplicationErrorException(
                    undefined, 
                    'Query failed', 
                    HttpStatus.INTERNAL_SERVER_ERROR
                ));

            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });

});

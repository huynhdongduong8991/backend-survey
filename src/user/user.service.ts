import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@src/entities';
import { ApplicationErrorException } from '@src/exceptions';
import { DataSource, FindOptions, FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { CreateGoogleUserDto, CreateUserDto } from './dtos/create.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import constants from '@src/config/constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
        private dataSource: DataSource,
    ) {}

    async findByGoogleId(googleId: string): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: { googleId },
        });
    }

    async findByEmail(email: string): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: { email },
        });
    }

    async findByOptions(options: FindOptionsWhere<UsersEntity>): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: options
        });
    }

    async createGoogleUser(createDto: CreateGoogleUserDto): Promise<UsersEntity> {
        let user = await this.findByGoogleId(createDto.googleId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!user) {
                user = this.usersRepository.create({
                    googleId: createDto.googleId,
                    email: createDto.email,
                    username: createDto.username,
                });
                await this.usersRepository.save(user);
            }
            await queryRunner.commitTransaction();
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof QueryFailedError) {
                throw new ApplicationErrorException(
                    undefined,
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    async createUser(createDto: CreateUserDto): Promise<UsersEntity> {
        const user = await this.findByEmail(createDto.email);

        if (user) {
            throw new ApplicationErrorException('E-00003', undefined, HttpStatus.BAD_REQUEST);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const userId = uuidv4();
            const password = await bcrypt.hash(createDto.password, constants.SALT_ROUNDS);
            const newUser = this.usersRepository.create({
                userId: userId,
                email: createDto.email,
                password: password,
                username: createDto.username,
            });
            await this.usersRepository.save(newUser);
            await queryRunner.commitTransaction();
            return newUser;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof QueryFailedError) {
                throw new ApplicationErrorException(
                    undefined,
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, payload: { password: string }): Promise<void> {
        await this.usersRepository.update(id, { password: payload.password });
    }
}

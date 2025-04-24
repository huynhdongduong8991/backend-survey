import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@src/entities';
import { ApplicationErrorException } from '@src/exceptions';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private dataSource: DataSource,
    ) {}

    async findByGoogleId(googleId: string): Promise<Users> {
        return await this.usersRepository.findOne({
            where: { googleId },
        });
    }

    async create(createDto: CreateUserDto): Promise<Users> {
        let user = await this.findByGoogleId(createDto.googleId);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!user)  {
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
}

import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "@src/entities";
import { UserController } from './user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "@src/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
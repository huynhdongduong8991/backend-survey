import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "@src/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
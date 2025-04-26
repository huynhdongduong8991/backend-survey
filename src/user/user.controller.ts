import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '@src/auth/decorator/get-user.decorator';
import { JwtGuard } from '@src/auth/guard/jwt.guard';
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';
import { successResponse } from '@src/utils/response';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get("")
    async getUserToken(@GetUser() userReq) {
        const data = await this.userService.findByEmail(userReq.email);
        if (!data) {
            throw new RecordNotFoundException('User not found.');
        }
        
        delete data.password;
        return successResponse({ data });
    }
}

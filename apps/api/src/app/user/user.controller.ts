import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getLoginUser(@CurrentUser() user: User): Omit<User, 'hashedPassword'> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (user as any).hashedPassword;
        return user;
    }

    @Patch()
    updateUser(
        @CurrentUser() user: User,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<User, 'hashedPassword'>> {
        return this.userService.updateUser(user.id, dto);
    }
}

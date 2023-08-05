import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async updateUser(
        userId: number,
        dto: UpdateUserDto,
    ): Promise<Omit<User, 'hashedPassword'>> {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (user as any).hashedPassword;    // do not wanto to display the hashedPassword
        return user;
    }
}

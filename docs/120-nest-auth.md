## install packages
```shell
yarn add @nestjs/config @nestjs/jwt @nestjs/passport 
yarn add cookie-parser csurf passport passport-jwt bcrypt class-validator class-transformer
yarn add -D @types/express @types/cookie-parser @types/csurf @types/passport-jwt @types/bcrypt
```

## main.ts

- add ValidationPipe
- add enableCors
- add cookieParser

*main.ts*  
```ts
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  ...
　app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  app.use(cookieParser());
  ...
}
```
> http://localhost:3000 is frontend(in this case Next.js)

## prisma.service

- import ConfigService
- import PrismaClient
- set datasources

*prisma.service.ts*  
```ts
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }
}
```

*prisma.module.ts*  
exports => add PrismaService

> and then, import PrismaModule, after that can use PrismaService in any module. 

## add authentication

### setup JwtModule

*Reference URL*
https://jwt.io/  

- add JwtModule  
*auth.module.ts*   
```ts
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
```

- add JWT_SECRET in .env

### create dto, interfaces
- create auth/dto/auth.dto.ts
*auth.dto.ts*  
```ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password!: string;
}
```

- create auth/interfaces/auth.interface.ts
*auth.interface.ts*  
```ts
export interface Msg {
    message: string;
}

export interface Csrf {
    csrfToken: string;
}

export interface Jwt {
    accessToken: string;
}
```

### update auth.service
*auth.service.ts*  
```ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async signUp(dto: AuthDto): Promise<Msg> {
        const hashed = await bcrypt.hash(dto.password, 12);
        try {
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hashedPassword: hashed,
                }
            });
            return {
                message: 'ok',
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('This email is already taken');
                }
            }
            throw error;
        }
    }

    async login(dto: AuthDto): Promise<Jwt> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new ForbiddenException('Email or password incorrect');
        }
        const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
        if (!isValid) {
            throw new ForbiddenException('Email or password incorrect');
        }
        return this.generateJwt(user.id, user.email);
    }

    async generateJwt(userId: number, email: string): Promise<Jwt> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: secret,
        });
        return { accessToken: token };
    }
}
```

### update auth.controller
*auth.controller.ts*  
```ts
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() dto: AuthDto): Promise<Msg> {
        return this.authService.signUp(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() dto: AuthDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<Msg> {
        const jwt = await this.authService.login(dto);
        res.cookie('access_token', jwt.accessToken, {
            httpOnly: true,
            secure: false,      // true for production 
            sameSite: 'none',
            path: '/',
        });
        return {
            message: 'ok',
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response): Msg {
        res.cookie('access_token', '', {
            httpOnly: true,
            secure: false,      // true for production 
            sameSite: 'none',
            path: '/',
        });
        return {
            message: 'ok',
        };
    }
}
```

## AuthGuard jwt

add UseGuards to controller  

*ex. user.controller.ts*  
```ts
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
}
```

create jwt strategy  

*auth/strategy/jwt.strategy.ts*  
```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let jwt = null;
                    if (req && req.cookies) {
                        jwt = req.cookies['access_token'];
                    }
                    return jwt;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        });
    }

    async validate(payload: { sub: number; email: string; }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (user as any).hashedPassword;
        return user;
    }
}
```

add JwtStrategy to providers in auth.module.ts  

*auth.module.ts*
```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
@Module({
  imports: [PrismaModule, JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
```

## current user decorator

install graphql @nestjs/graphql  
```shell
yarn add @nestjs/graphql
```

*auth/current-user.decorator.ts*  
```ts
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
    // for http
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }

    // for graphql
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) =>
        getCurrentUserByContext(context)
);
```

*user.contoller.ts*  
```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
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
}
```
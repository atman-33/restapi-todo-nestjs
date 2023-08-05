import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { COOKIE_SECURE } from '../../consts';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('csrf')
    getCsrfToken(@Req() req: Request): Csrf {
        return { csrfToken: req.csrfToken() };
    }

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
            secure: COOKIE_SECURE,      // true for production 
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
            secure: COOKIE_SECURE,      // true for production 
            sameSite: 'none',
            path: '/',
        });
        return {
            message: 'ok',
        };
    }
}

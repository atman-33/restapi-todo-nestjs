## add csurf

add app.use csurf

*main.ts*
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false,  // true for production
      },
      value: (req: Request) => {
        return req.header('csrf-token') as string;
      }
    })
  );
  ...
```

add csrf endpoint  

*auth.controller.ts*
```ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
    ...
```

for production, change cookie secure to *true*
- main.ts
- auth.controller.ts
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


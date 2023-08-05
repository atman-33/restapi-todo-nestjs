## install prisma

If use NX and exist NestJS project in same monorepo, not need following.

```shell
yarn add -D prisma
yarn add @prisma/client
npx prisma init
```

create .env file and add DATABASE_URL  

*ex. .env*  
```text
DATABASE_URL="postgresql://udemy:udemy@localhost:5434/udemy?schema=public"
```

```shell
npx prisma db pull
npx prisma generate
```
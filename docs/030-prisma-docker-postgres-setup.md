## install prisma
```shell
yarn add -D prisma
yarn add @prisma/client
npx prisma init
```

## setup postgres by docker

create docker-compose.yml  

start db  
```shell
docker compose up -d
```

check docker running  
```shell
docker ps
```

add model in prisma/schema.prisma  

migration  
```shell
npx prisma migrate dev
```
> migration name => ex. v0  
> After migration, the changes will be reflected when you restart Prisma Studio.

run prisma studio  
```shell
npx prisma studio
```

generate Prisma Client  
```shell
npx prisma generate
```
## change to your choice of directory
open shell
```shell
cd ~/Sites
```
> ~/Sites is example

## install yarn
```shell
npm i -g yarn
```

## create nx workspace Next.js app
```shell
npx create-nx-workspace@latest

✔ Where would you like to create your workspace? · restapi-todo-nestjs
✔ Which stack do you want to use? · react
✔ What framework would you like to use? · nextjs
✔ Integrated monorepo, or standalone project? · integrated
✔ Application name · web
✔ Would you like to use the App Router (recommended)? · Yes
✔ Default stylesheet format · styled-components
✔ Enable distributed caching to make your CI faster · No
```

## add NestJS
```shell
yarn add -D @nx/nest
```

```shell
nx g @nx/nest:app api --frontendProject web
```
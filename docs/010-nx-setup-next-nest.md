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

## setup proxy

add rewites() in next.config.js  
*next.config.js*  
```ts
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  compiler: {
    // For other options, see https://styled-components.com/docs/tooling#babel-plugin
    styledComponents: true,
  },

  // add following insted of proxy config
  async rewrites() {
    return [
      {
        source: '/api',
        destination: 'http://localhost:3005/',
      },
    ];
  },
};
```

*web/project.json*
```ts
    "serve": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "web:build",
        "dev": true,
-       "proxyConfig": "apps/web/proxy.conf.json"
+       "port": 3000
      },
      "configurations": {
        "development": {
          "buildTarget": "web:build:development",
          "dev": true
        },
        "production": {
          "buildTarget": "web:build:production",
          "dev": false
        }
      }
    },
```

## add scripts
*package.json*
```json
  "scripts": {
    "dev": "nx run-many -t serve web api"
  },
```
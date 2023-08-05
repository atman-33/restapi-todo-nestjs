## setup tsconfig.json

*api/tsconfig.json*
```json
  "compilerOptions": {
    "esModuleInterop": true,
+   "strict": true,
+   "noImplicitAny": true
  }
```

## port

change default port(3000 => 3005)  
*main.ts*  
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api'; 
  app.setGlobalPrefix(globalPrefix);
 
- const port = process.env.PORT || 3000;
+ const port = process.env.PORT || 3005;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}
```
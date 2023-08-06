## reference URL
https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs  

## nextjs 13 migration

*_app.tsx, _document.tsx*   
  => app/layout.tsx *some provider files, after that to layout.tsx

*components/Layout.tsx*  
  => app/layout.tsx

- app/emotion.tsx => css style

## flow memo
- create .env.local file
- update app/layout.tsx
  * add type Props, Head and css class etc.
  * add const gueryClient
  * add axios credentials, getCsrfToken
  * add QeuryClientProvider
  * add ReactQueryDevtools

- update app/page.tsx
  
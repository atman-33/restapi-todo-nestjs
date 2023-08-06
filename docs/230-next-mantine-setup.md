## install necessary packages
```shell
yarn add @tanstack/react-query @tanstack/react-query-devtools
yarn add @mantine/core @mantine/hooks @mantine/form @mantine/next @emotion/server @emotion/react
yarn add @heroicons/react @tabler/icons-react yup axios zustand
```

## create emotion.tsx

*app/emotion.tsx*  
```ts
"use client";
import { CacheProvider } from "@emotion/react";
import { MantineProvider, useEmotionCache } from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";

export default function RootStyleRegistry({
    children
}: {
    children: React.ReactNode;
}) {
    const cache = useEmotionCache();
    cache.compat = true;

    useServerInsertedHTML(() => (
        <style
            data-emotion={
                `${cache.key} ${Object.keys(cache.inserted).join(" ")}`
            }
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(" "),
            }}
        />
    ));

    return (
        <CacheProvider value={cache}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS theme={{
                    colorScheme: 'dark', fontFamily: 'Verdana, sans-serif'
                }}>
                {children}
            </MantineProvider>
        </CacheProvider>
    );
}
```

delete app/registry.tsx  

update layout.tsx  
*app/layout.tsx*  
```tsx
import React from 'react';
import RootStyleRegistry from './emotion';
import './global.css';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en-US">
      <head />
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}
```
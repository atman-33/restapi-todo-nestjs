'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import Head from 'next/head';
import { ReactNode, useEffect } from 'react';
import RootStyleRegistry from './emotion';
import './global.css';

type Props = {
  title: string;
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

export default function RootLayout({ children, title = 'Nextjs' }: Props) {
  // need to use cookie with backend
  axios.defaults.withCredentials = true;

  // get csrf token
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/csrf`
      );
      axios.defaults.headers.common['csrf-token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <html lang="en-US">
      <head />
      <body>
        <QueryClientProvider client={queryClient}>
          <RootStyleRegistry>
            <div className='flex min-h-screen flex-col items-center justify-center'>
              <Head>
                <title>{title}</title>
              </Head>
              <main className='flex w-screen flex-1 flex-col items-center justify-center'>
                {children}
              </main>
            </div>
          </RootStyleRegistry>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </body>
    </html>
  );
}
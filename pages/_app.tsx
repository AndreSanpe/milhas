import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider as AuthContextProvider } from '../contexts/auth';
import { Provider as TraineesContextProvider } from '../contexts/trainees';
import { Provider as TraineeContextProvider } from '../contexts/trainee';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <SessionProvider session={session}>
      <AuthContextProvider>
        <TraineesContextProvider>
          <TraineeContextProvider>
            <Component {...pageProps} />
          </TraineeContextProvider>
        </TraineesContextProvider>
      </AuthContextProvider>
    </SessionProvider>
  ) 
}

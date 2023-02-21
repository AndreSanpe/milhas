import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider as AuthContextProvider } from '../contexts/auth';
import { Provider as AccountsContextProvider } from '../contexts/accounts';
import { Provider as InputBuyContextProvider } from '../contexts/inputBuy';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <SessionProvider session={session}>
      <AuthContextProvider>
        <AccountsContextProvider>
          <InputBuyContextProvider>
            <Component {...pageProps} />
          </InputBuyContextProvider>
        </AccountsContextProvider>
      </AuthContextProvider>
    </SessionProvider>
  ) 
}

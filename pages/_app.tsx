import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Provider as AuthContextProvider } from '../contexts/auth';
import { Provider as AccountsContextProvider } from '../contexts/accounts';
import { Provider as InputBuyContextProvider } from '../contexts/inputBuy';
import { useState } from 'react';
import Loader from '../components/Loader';


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const [ loading, setLoading ] = useState<boolean>(false);

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
  });

  Router.events.on('routeChangeComplete',(url) => {
    setLoading(false)
  });

  return (<>

    {loading && <Loader />}

    <SessionProvider session={session}>
      <AuthContextProvider>
        <AccountsContextProvider>
          <InputBuyContextProvider>
            <Component {...pageProps} />
          </InputBuyContextProvider>
        </AccountsContextProvider>
      </AuthContextProvider>
    </SessionProvider>
  </>) 
}

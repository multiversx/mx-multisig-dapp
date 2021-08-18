import React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as Dapp from '@elrondnetwork/dapp';
import * as config from './config';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { englishTranslations } from 'i18n/en';
import { germanTranslations } from 'i18n/de';
import { ContextProvider } from './context';
import Layout from './components/Layout';
import routes, { routeNames } from './routes';
import PageNotFoud from './components/PageNotFoud';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: englishTranslations,
    },
    de: {
      translation: germanTranslations,
    },
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default function App() {
  return (
    <ContextProvider>
      <Dapp.Context config={config}>
        <Layout>
          <Switch>
            <Route
              path={routeNames.unlock}
              component={() => (
                <Dapp.Pages.Unlock
                  callbackRoute={routeNames.dashboard}
                  title={`${config.dAppName} Template`}
                  lead="Please select your login method:"
                  ledgerRoute={routeNames.ledger}
                  walletConnectRoute={routeNames.walletconnect}
                />
              )}
              exact={true}
            />
            <Route
              path={routeNames.ledger}
              component={() => <Dapp.Pages.Ledger callbackRoute={routeNames.dashboard} />}
              exact={true}
            />
            <Route
              path={routeNames.walletconnect}
              component={() => (
                <Dapp.Pages.WalletConnect
                  callbackRoute={routeNames.dashboard}
                  logoutRoute={routeNames.home}
                  title="Maiar Login"
                  lead="Scan the QR code using Maiar"
                />
              )}
              exact={true}
            />

            {routes.map((route, i) => (
              <Route
                path={route.path}
                key={route.path + i}
                component={route.component}
                exact={true}
              />
            ))}
            <Route component={PageNotFoud} />
          </Switch>
        </Layout>
      </Dapp.Context>
    </ContextProvider>
  );
}

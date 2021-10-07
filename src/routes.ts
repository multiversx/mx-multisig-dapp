import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { dAppName } from "config";
import Unlock, { Ledger, Maiar } from "pages/Unlock";
import withPageTitle from "./components/PageTitle";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MultisigDetailsPage from "./pages/MultisigDetails/MultisigDetailsPage";

type RouteType = Dapp.RouteType & { title: string };

export type BackgroundRoutesType =
  | "home"
  | "dashboard"
  | "multisig"
  | "multisigAddress"
  | "unlock";
export type ModalRoutesType = "walletconnect" | "ledger";

export const backgroundRoutes: Record<BackgroundRoutesType, RouteType> = {
  home: {
    path: "/",
    title: "Home",
    component: Home,
  },
  dashboard: {
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  },
  multisigAddress: {
    path: "/multisig/:multisigAddressParam",
    title: "Multisig",
    component: MultisigDetailsPage,
  },
  multisig: {
    path: "/multisig",
    title: "Multisig Details",
    component: Dashboard,
  },
  unlock: {
    path: "/unlock",
    title: "Unlock",
    component: Unlock,
  },
};

export const modalRoutes: Record<ModalRoutesType, RouteType> = {
  walletconnect: {
    path: "/walletconnect",
    title: "Maiar Login",
    component: Maiar,
  },
  ledger: {
    path: "/ledger",
    title: "Ledger Login",
    component: Ledger,
  },
};

export const backgroundRouteNames = Object.keys(backgroundRoutes).reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: backgroundRoutes[cur as BackgroundRoutesType].path,
  }),
  {} as Record<BackgroundRoutesType, string>,
);

export const modalRouteNames = Object.keys(modalRoutes).reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: modalRoutes[cur as ModalRoutesType].path,
  }),
  {} as Record<ModalRoutesType, string>,
);

export const foregoundRouteNames = {
  doesNotExist: "/fixesBug",
};

export const routeNames = {
  ...backgroundRouteNames,
  ...modalRouteNames,
  ...foregoundRouteNames,
};

const routes: RouteType[] = [
  ...Object.keys(modalRoutes).map((route) => {
    const { path, title, authenticatedRoute, component } =
      modalRoutes[route as ModalRoutesType];
    return { path, title, authenticatedRoute, component };
  }),

  ...Object.keys(backgroundRoutes).map((route) => {
    const { path, title, authenticatedRoute } =
      backgroundRoutes[route as BackgroundRoutesType];
    return {
      path,
      title,
      authenticatedRoute,
      component: () => null,
    };
  }),
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title
      ? `${route.title} • Elrond ${dAppName}`
      : `Elrond ${dAppName}`;
    return {
      path: route.path,
      authenticatedRoute: Boolean(route.authenticatedRoute),
      component: withPageTitle(
        title,
        route.component,
      ) as any as React.ComponentClass<any, any>,
    };
  });

export default wrappedRoutes();

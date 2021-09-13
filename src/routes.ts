import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { dAppName } from "config";
import withPageTitle from "./components/PageTitle";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MultisigDetailsPage from "./pages/MultisigDetails/MultisigDetailsPage";

type RouteType = Dapp.RouteType & { title: string };

export const routeNames = {
  home: "/",
  dashboard: "/dashboard",
  unlock: "/unlock",
  ledger: "/ledger",
  walletconnect: "/walletconnect",
};

const routes: RouteType[] = [
  {
    path: "/",
    title: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  },
  {
    path: "/multisig/:multisigAddressParam",
    title: "Multisig",
    component: MultisigDetailsPage,
  },
  {
    path: "/multisig",
    title: "Multisig Details",
    component: Dashboard,
  },
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

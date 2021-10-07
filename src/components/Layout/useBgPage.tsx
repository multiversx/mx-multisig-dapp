import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router-dom";

import { multisigOriginSelector } from "redux/selectors/appConfigSelector";
import { setMultisigOrigin } from "redux/slices/appConfigSlice";

import {
  backgroundRouteNames,
  backgroundRoutes,
  BackgroundRoutesType,
  foregoundRouteNames,
  modalRouteNames,
  routeNames,
} from "routes";

const useMatchPath = () => {
  const { pathname } = useLocation();

  return (path: string) =>
    matchPath(pathname, {
      path,
      exact: true,
      strict: false,
    }) !== null;
};

const useBgPage = () => {
  const pathMatch = useMatchPath();
  const dispatch = useDispatch();

  const multisigOrigin = useSelector(multisigOriginSelector);
  const { pathname, search } = useLocation();
  const [lastOrigin, setLastOrigin] = React.useState("");
  const [BgPage, setBgPage] = React.useState<React.ReactNode>(() => null);

  const isForegroundRoute = () =>
    Object.values(foregoundRouteNames).some((path) => pathMatch(path));

  const [hideBgPage, setHideBgPage] = React.useState<React.ReactNode>(
    isForegroundRoute(),
  );

  const setOrigin = (path: string) => {
    dispatch(
      setMultisigOrigin({
        pathname: path,
        search: /^\?[A-Za-z0-9=&]+$/.test(search) ? search : "",
      }),
    );
    setLastOrigin(path);
  };

  const handleSetMultisigOrigin = () => {
    const foundBgPath = Object.values(backgroundRouteNames).find((path) =>
      pathMatch(path),
    );

    const isModalPath = Object.values(modalRouteNames).some((path) =>
      pathMatch(path),
    );

    if (foundBgPath && foundBgPath !== multisigOrigin.pathname) {
      setOrigin(pathname);
    }

    setHideBgPage(isForegroundRoute() || (!foundBgPath && !isModalPath));

    return () => {
      if (foundBgPath || lastOrigin) {
        let newPathname = pathname || lastOrigin;
        newPathname = pathname === routeNames.unlock ? lastOrigin : newPathname;
        dispatch(
          setMultisigOrigin({
            pathname: newPathname,
            search: /^\?[A-Za-z0-9=]+$/.test(search) ? search : "",
          }),
        );
      }
    };
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(handleSetMultisigOrigin, [pathname, search, lastOrigin]);

  const setMultisigBackground = () => {
    const found = Object.entries(backgroundRouteNames).find(
      ([, path]) => multisigOrigin.pathname === path || pathMatch(path),
    );
    if (found) {
      const [routeName] = found;
      const Component =
        backgroundRoutes[routeName as BackgroundRoutesType].component;
      setBgPage(() => <Component />);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(setMultisigBackground, [multisigOrigin.pathname]);

  return { BgPage, hideBgPage };
};

export default useBgPage;

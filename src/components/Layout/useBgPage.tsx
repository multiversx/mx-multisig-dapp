import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useMatchPath from "helpers/useMatchPath";
import { multisigOriginSelector } from "redux/selectors/appConfigSelector";
import { setMultisigOrigin } from "redux/slices/appConfigSlice";

import {
  backgroundRouteNames,
  backgroundRoutes,
  BackgroundRoutesType,
  foregroundRouteNames,
  modalRouteNames,
  routeNames,
} from "routes";

const useBgPage = () => {
  const matchPath = useMatchPath();
  const dispatch = useDispatch();

  const multisigOrigin = useSelector(multisigOriginSelector);
  const { pathname, search } = useLocation();
  const [lastOrigin, setLastOrigin] = React.useState("");
  const [BgPage, setBgPage] = React.useState<React.ReactNode>(() => null);

  const isForegroundRoute = () =>
    Object.values(foregroundRouteNames).some((path) => matchPath(path));

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
      matchPath(path),
    );

    const isModalPath = Object.values(modalRouteNames).some((path) =>
      matchPath(path),
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
  React.useEffect(handleSetMultisigOrigin, [pathname, search]);

  const setMultisigBackground = () => {
    const found = Object.entries(backgroundRouteNames).find(
      ([, path]) => multisigOrigin.pathname === path || matchPath(path),
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

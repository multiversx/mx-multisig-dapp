import * as React from "react";
import { useSetNonce, useContext as useDappContext } from "@elrondnetwork/dapp";
import { Address } from "@elrondnetwork/erdjs";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faHourglass } from "@fortawesome/free-solid-svg-icons/faHourglass";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import {
  toastSignSessionsSelector,
  transactionToastsSelector,
} from "redux/selectors/toastSelector";
import {
  addToast,
  addToastSignSession,
  setTransactionToasts,
  updateToast,
  updateToastsRefetch,
} from "redux/slices/toastsSlice";
import storage from "storage";
import {
  TransactionToastType,
  TransactionToastDescriptionType,
} from "types/toasts";
import { CustomToastDisplayType } from "types/toasts";
import switchTrue from "../../helpers/switchTrue";

const Toast = ({
  toastSignSession,
  transactions,
  startTime,
  endTime,
  successMessage,
  errorMessage,
  processingMessage,
}: TransactionToastType) => {
  const toastSignSessions = useSelector(toastSignSessionsSelector);
  const transactionToasts = useSelector(transactionToastsSelector);
  const dispatch = useDispatch();
  const setNonce = useSetNonce();
  const { dapp, address } = useDappContext();
  const [sessionRefetch, setSessionRefetch] = React.useState<string[]>([]);
  const isSuccessful =
    transactions &&
    Object.values(transactions).every((status) => status.isSuccessful);
  const isFailed =
    transactions != null &&
    Object.values(transactions).some(
      (status) => status?.isInvalid || status?.isFailed,
    );

  const descriptionProps: TransactionToastDescriptionType = {
    type: CustomToastDisplayType.TransactionToast,
    props: {
      transactions: Object.keys(transactions).map((hash) => ({
        hash,
        status: transactions[hash],
      })),
      toastSignSession,
      pending: !isSuccessful && !isFailed,
    },
  };

  const progress = { startTime, endTime };

  const successToast = {
    id: toastSignSession,
    title: successMessage ?? "Request was successful",
    descriptionProps,
    iconClassName: "bg-success",
    icon: faCheck,
    expires: 30000,
    hasCloseButton: true,
  };

  const pendingToast = {
    id: toastSignSession,
    title: processingMessage,
    descriptionProps,
    iconClassName: "bg-warning",
    icon: faHourglass,
    expires: false,
    hasCloseButton: false,
    progress,
  };

  const failedToast = {
    id: toastSignSession,
    title: errorMessage ?? "Something went wrong",
    descriptionProps,
    iconClassName: "bg-danger",
    icon: faTimes,
    hasCloseButton: true,
  };

  const toastBody = switchTrue({
    [`${isSuccessful}`]: successToast,
    [`${isFailed}`]: failedToast,
    default: pendingToast,
  });

  const setStatus = () => {
    if (transactions != null && !toastSignSessions.includes(toastSignSession)) {
      dispatch(addToast(toastBody));
      dispatch(addToastSignSession(toastSignSession));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(setStatus, [
    toastSignSession,
    transactions,
    toastSignSessions,
  ]);

  React.useEffect(() => {
    if (
      transactions &&
      Object.values(transactions).some((status) => status.isPending)
    ) {
      dispatch(
        updateToast({
          id: toastSignSession,
          descriptionProps,
          hasCloseButton: false,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const updateStatus = () => {
    switch (true) {
      case isSuccessful: {
        dispatch(updateToast(successToast));
        removeTransactionToast();

        if (!sessionRefetch.includes(toastSignSession)) {
          dispatch(updateToastsRefetch());
          setSessionRefetch((existing) => [...existing, toastSignSession]);
        }

        break;
      }

      case isFailed: {
        dispatch(updateToast(failedToast));
        dapp.proxy
          .getAccount(new Address(address))
          .then((account) => {
            setNonce(account.nonce.valueOf());
          })
          .catch(() => {
            console.log("Unable to get account");
          });
        removeTransactionToast();
        if (!sessionRefetch.includes(toastSignSession)) {
          dispatch(updateToastsRefetch());
          setSessionRefetch((existing) => [...existing, toastSignSession]);
        }
        break;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(updateStatus, [transactions, sessionRefetch, address]);

  const removeTransactionToast = () => {
    dispatch(
      setTransactionToasts(
        transactionToasts.filter(
          (toast) => toast.toastSignSession !== toastSignSession,
        ),
      ),
    );
  };

  return null;
};

export default Toast;

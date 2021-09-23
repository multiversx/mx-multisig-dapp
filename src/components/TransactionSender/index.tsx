import * as React from "react";
import { useContext as useDappContext, useSetNonce } from "@elrondnetwork/dapp";
import { TransactionStatus } from "@elrondnetwork/erdjs";
import { Address, TransactionHash } from "@elrondnetwork/erdjs/out";
import { Signature } from "@elrondnetwork/erdjs/out/signature";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons/faExclamationTriangle";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import { transactionStatuses } from "helpers/constants";
import newTransaction from "helpers/newTransaction";
import getPlainTransactionStatus from "helpers/plainObjects";
import {
  toastSignSessionsSelector,
  transactionToastsSelector,
} from "redux/selectors/toastSelector";
import { signStatusSelector } from "redux/selectors/transactionsSelector";
import { setTxSubmittedModal } from "redux/slices/modalsSlice";
import { addToast, setTransactionToasts } from "redux/slices/toastsSlice";
import { clearSignTransactions } from "redux/slices/transactionsSlice";
import { PlainTransactionStatus } from "types/toasts";
import Toast from "./Toast";

const failedToast = {
  id: "batch-failed",
  title: "Unable to send",
  description: "Failed sending transactions. Please refresh the page.",
  icon: faExclamationTriangle,
  iconClassName: "bg-warning",
  expires: false,
};

const TransactionSender = () => {
  const toastSignSessions = useSelector(toastSignSessionsSelector);
  const transactionToasts = useSelector(transactionToastsSelector);
  const {
    address,
    account,
    dapp: { proxy },
  } = useDappContext();
  const setNonce = useSetNonce();
  const signedTransactions = useSelector(signStatusSelector);
  const [sending, setSending] = React.useState<boolean>();

  const dispatch = useDispatch();

  const clearSignInfo = () => {
    dispatch(clearSignTransactions());
    setSending(false);
  };

  async function handleSendTransactions() {
    const [sessionId] = Object.keys(signedTransactions);
    try {
      if (
        sessionId != null &&
        signedTransactions[sessionId].status === transactionStatuses.signed &&
        !sending
      ) {
        const { transactions } = signedTransactions[sessionId];

        const batchNotSent = transactionToasts.every(
          ({ toastSignSession }) => String(toastSignSession) !== sessionId,
        );
        if (batchNotSent) {
          if (transactions != null) {
            setSending(true);
            const transactionsPromises = transactions.map((t) => {
              const transactionObject = newTransaction(t);
              transactionObject.applySignature(
                Signature.fromHex(t.signature),
                new Address(t.sender),
              );
              return proxy.sendTransaction(transactionObject);
            });
            const responseHashes = await Promise.all(transactionsPromises);

            const withoutCurrent = transactionToasts.filter(
              ({ toastSignSession }) => String(toastSignSession) !== sessionId,
            );

            const newTransactions: {
              [hash: string]: PlainTransactionStatus;
            } = (responseHashes as TransactionHash[]).reduce((acc, tx) => {
              acc[Buffer.from(tx.hash).toString("hex")] =
                getPlainTransactionStatus(new TransactionStatus("pending"));
              return acc;
            }, {} as any);
            setNonce(account.nonce.valueOf() + transactions.length);
            const newToast = {
              toastSignSession: sessionId,
              processingMessage: "Processing transaction",
              successMessage: "Transaction successful",
              errorMessage: "Transaction failed",
              submittedMessage: "Transaction submitted",
              submittedMessageShown: true,
              transactions: newTransactions,
              startTime: moment().unix(),
              endTime: moment().add(10, "seconds").unix(),
            };
            const newToasts = [...withoutCurrent, newToast];
            dispatch(
              setTxSubmittedModal({
                sessionId,
                submittedMessage: "submitted",
              }),
            );

            dispatch(setTransactionToasts(newToasts));
            clearSignInfo();
            history.pushState({}, document.title, "?");
          }
        }
      } else {
        if (
          sessionId &&
          (signedTransactions[sessionId].status ===
            transactionStatuses.cancelled ||
            signedTransactions[sessionId].status === transactionStatuses.failed)
        ) {
          dispatch(clearSignTransactions());
        }
      }
    } catch (err: any) {
      console.error("Unable to send transactions", err);
      dispatch(addToast(failedToast));
      clearSignInfo();
    } finally {
      setSending(false);
    }
  }

  React.useEffect(
    () => {
      handleSendTransactions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signedTransactions, address],
  );

  const addCancelToast = () => {
    if (signedTransactions) {
      const [sessionId] = Object.keys(signedTransactions);
      if (signedTransactions.status === transactionStatuses.failed) {
        dispatch(
          addToast({
            id: sessionId,
            title: "Failed",
            description: "Request was not successful.",
            iconClassName: "bg-danger",
            icon: faTimes,
            expires: 6000,
          }),
        );
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(addCancelToast, [signedTransactions, toastSignSessions]);
  return (
    <>
      {sending === false
        ? transactionToasts.map((props, i) => {
            const key = Object.values(props.transactions)
              .map((status) => status.toString())
              .join("");
            return <Toast key={props.toastSignSession + key + i} {...props} />;
          })
        : null}
    </>
  );
};

export default TransactionSender;

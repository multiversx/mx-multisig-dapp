import * as React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Transaction, Address, Nonce } from "@elrondnetwork/erdjs";
import { useDispatch, useSelector } from "react-redux";
import { transactionStatuses } from "helpers/constants";
import newTransaction from "helpers/newTransaction";
import { transactionsToSignSelector } from "redux/selectors/transactionsSelector";
import { updateSignStatus } from "redux/slices/transactionsSlice";
import { replyUrl, useSearchTransactions } from "./helpers";
import { walletSignSession } from "./helpers/constants";

import getProviderType from "./helpers/getProviderType";
import SignWithExtensionModal from "./SignWithExtensionModal";
import SignWithLedgerModal from "./SignWithLedgerModal";
import SignWithWalletConnectModal from "./SignWithWalletConnectModal";

interface SignTransactionsType {
  transactions: Transaction[];
  callbackRoute: string;
  sessionId: string;
}

export default function SignTransactions() {
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [newTransactions, setNewTransactions] = React.useState<Transaction[]>();
  const [newCallbackRoute, setNewCallbackRoute] = React.useState("");
  const [newSessionId, setNewSessionId] = React.useState("");
  const [error, setError] = React.useState("");
  const {
    dapp: { provider, proxy },
    address,
    account: contextAccount,
  } = useDappContext();
  const transactionsToSign = useSelector(transactionsToSignSelector);
  const dispatch = useDispatch();

  useSearchTransactions();

  const providerType = getProviderType(provider);

  const handleClose = () => {
    setNewTransactions(undefined);
    setNewCallbackRoute("");
    setError("");
    setShowSignModal(false);
  };

  const signTransactions = ({
    sessionId,
    transactions,
    callbackRoute,
  }: SignTransactionsType) => {
    const showError = (e: string) => {
      setShowSignModal(true);
      setError(e);
    };
    setNewCallbackRoute(callbackRoute);
    setNewSessionId(sessionId);

    if (provider) {
      proxy
        .getAccount(new Address(address))
        .then((account) => {
          const latestNonce = Math.max(
            account.nonce.valueOf(),
            contextAccount.nonce.valueOf(),
          );
          transactions.forEach((tx, i) => {
            tx.setNonce(new Nonce(latestNonce + i));
          });
          switch (providerType) {
            case "wallet":
              const callbackUrl = replyUrl({
                callbackUrl: `${window.location.origin}${callbackRoute}`,
                urlParams: { [walletSignSession]: sessionId },
              });

              provider.signTransactions(transactions, {
                callbackUrl: encodeURIComponent(callbackUrl),
              });

              break;
            case "extension":
            case "ledger":
            case "walletconnect":
              setNewTransactions(transactions);
              setShowSignModal(true);
              break;
          }
        })
        .catch((e) => {
          console.error("error when signing", e);
          dispatch(
            updateSignStatus({
              [sessionId]: {
                status: transactionStatuses.cancelled,
              },
            }),
          );
          showError(e);
        });
    } else {
      setShowSignModal(true);
      setError(
        "You need a singer/valid signer to send a transaction, use either WalletProvider, LedgerProvider or WalletConnect",
      );
    }
  };

  React.useEffect(() => {
    if (transactionsToSign?.sessionId) {
      signTransactions({
        ...transactionsToSign,
        transactions: transactionsToSign.transactions.map((tx) =>
          newTransaction(tx),
        ),
      });
    }
  }, [transactionsToSign]);

  const signProps = {
    handleClose,
    error,
    setError,
    sessionId: newSessionId,
    show: showSignModal,
    transactions: newTransactions || [],
    providerType,
    callbackRoute: newCallbackRoute,
  };

  return (
    <React.Fragment>
      {providerType === "ledger" && <SignWithLedgerModal {...signProps} />}
      {providerType === "walletconnect" && (
        <SignWithWalletConnectModal {...signProps} />
      )}
      {providerType === "extension" && (
        <SignWithExtensionModal {...signProps} />
      )}
    </React.Fragment>
  );
}

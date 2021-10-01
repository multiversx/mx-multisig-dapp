import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { operations, validation } from "@elrondnetwork/dapp-utils";
import { Transaction } from "@elrondnetwork/erdjs";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons/faExclamationTriangle";
import BigNumber from "bignumber.js";
import { useDispatch } from "react-redux";
import { gasPerDataByte, gasPriceModifier } from "config";
import { setNotificationModal } from "redux/slices/modalsSlice";
import { setTransactionsToSign } from "redux/slices/transactionsSlice";

const defaultMinGasLimit = 50000000;
function calcTotalFee(transactions: Transaction[], minGasLimit: number) {
  let totalFee = new BigNumber(0);

  transactions.forEach((tx) => {
    const fee = operations.calculateFeeLimit({
      minGasLimit: String(minGasLimit),
      gasPerDataByte: gasPerDataByte,
      gasPriceModifier: gasPriceModifier,
      gasLimit: tx.getGasLimit().valueOf().toString(),
      gasPrice: tx.getGasPrice().valueOf().toString(),
      data: tx.getData().toString(),
      chainId: tx.getChainID().valueOf(),
    });
    totalFee = totalFee.plus(new BigNumber(fee));
  });

  return totalFee;
}

export default function useSendTransactions() {
  const dispatch = useDispatch();
  const {
    account: { balance },
  } = useDappContext();

  return (
    transactionPayload: Transaction[] | Transaction,
    minGasLimit = defaultMinGasLimit,
  ) => {
    //this will make sure that we can send single transactions to be signed
    const transactions = Array.isArray(transactionPayload)
      ? transactionPayload
      : [transactionPayload];
    const bNtotalFee = calcTotalFee(transactions, minGasLimit);
    const bNbalance = new BigNumber(
      validation.stringIsFloat(balance) ? balance : "0",
    );

    if (bNbalance.minus(bNtotalFee).isGreaterThan(0)) {
      const sessionId = Date.now().toString();

      dispatch(
        setTransactionsToSign({
          transactions: transactions.map((tx) => tx.toPlainObject()),
          sessionId,
          callbackRoute: window.location.pathname,
        }),
      );
    } else {
      dispatch(
        setNotificationModal({
          title: "Insufficient EGLD funds",
          description:
            "Current EGLD balance cannot cover the transaction fees.",
          icon: faExclamationTriangle,
          iconClassName: "text-warning",
        }),
      );
    }
  };
}

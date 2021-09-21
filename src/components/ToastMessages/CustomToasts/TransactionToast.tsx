import React from "react";

import TxDetails from "components/TransactionSender/TxDetails";
import { ToastType, TransactionToastDescriptionType } from "types/toasts";
import ToastMessage from "../ToastMessage";

const TransactionToast = ({ toast }: { toast: ToastType }) => {
  const { transactions, pending } = toast?.descriptionProps
    ?.props as TransactionToastDescriptionType["props"];
  const extendedToast = {
    ...toast,
    description: <TxDetails transactions={transactions} />,
  };
  if (pending) {
    extendedToast.title = toast.title ?? "Processing";
  }
  return <ToastMessage toast={extendedToast} />;
};

export default TransactionToast;

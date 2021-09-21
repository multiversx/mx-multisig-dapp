import * as React from "react";
import { transactionStatuses } from "helpers/constants";

const useUnload = ({
  status,
  sequential,
}: {
  status?: string;
  sequential?: boolean;
}) => {
  React.useEffect(() => {
    if (status === transactionStatuses.pending) {
      window.addEventListener("beforeunload", handleUnload);
      window.addEventListener("unload", handleUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [status, sequential]);

  const handleUnload = (e: any) => {
    const message = "Please wait for transactions to execute.";
    (e || window.event).returnValue = message; //Gecko + IE
    return message;
  };
};

export default useUnload;

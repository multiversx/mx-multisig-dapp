import React from "react";
import "./trustedBadge.scss";
import { getIsContractTrusted } from "../../apiCalls/multisigContractsCalls";
import TrustedBadgeIcon from "assets/img/trusted-badge.svg";

interface TrustedBadgePropsType {
  contractAddress: string;
  initialValue?: boolean;
  onVerificationComplete?: (trusted: boolean) => void;
}

function TrustedBadge({
  contractAddress,
  initialValue,
  onVerificationComplete,
}: TrustedBadgePropsType) {
  const [isTrusted, setIsTrusted] = React.useState(initialValue);

  async function validateContractHash() {
    const isContractTrusted = await getIsContractTrusted(contractAddress);
    setIsTrusted(isContractTrusted);
    onVerificationComplete?.(isContractTrusted);
  }

  React.useEffect(() => {
    validateContractHash();
  }, []);

  return (
    <>
      {isTrusted && (
        <span className="mr-2">
          <img src={TrustedBadgeIcon} alt="trusted-badge" />
        </span>
      )}
    </>
  );
}

export default TrustedBadge;

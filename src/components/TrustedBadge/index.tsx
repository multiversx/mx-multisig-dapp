import React from "react";
import "./trustedBadge.scss";
import { getIsContractTrusted } from "../../apiCalls/multisigContractsCalls";

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
        <span className="trusted-badge badge badge-secondary">Trusted</span>
      )}
    </>
  );
}

export default TrustedBadge;

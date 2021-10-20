import React from "react";
import { Address } from "@elrondnetwork/erdjs";
import { useTranslation } from "react-i18next";
import CopyButton from "components/CopyButton";
import { SelectedOptionType } from "redux/slices/modalsSlice";

interface ProposeRemoveUserType {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
}

const ProposeRemoveUser = ({
  selectedOption,
  handleSetAddress,
}: ProposeRemoveUserType) => {
  const { t } = useTranslation();
  const address = "address" in selectedOption! ? selectedOption?.address : "";

  React.useEffect(() => {
    if (address != null) {
      handleSetAddress(new Address(address));
    }
  }, []);
  if (selectedOption == undefined) {
    return null;
  }

  return (
    <div className="modal-control-container">
      <label>{t("Address")} </label>
      <div className="h6 mb-spacer copy-address" data-testid="delegateSubTitle">
        <p className="address"> {address} </p>
        <span className={"copy-btn"}>
          <CopyButton text={address} />
          {/* <ExplorerLink page={`accounts/${address}`} className="ml-2" /> */}
        </span>
      </div>
    </div>
  );
};

export default ProposeRemoveUser;

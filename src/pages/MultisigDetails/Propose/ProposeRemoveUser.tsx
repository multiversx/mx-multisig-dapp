import React from "react";
import { Address } from "@elrondnetwork/erdjs";
import { useTranslation } from "react-i18next";
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
      <input
        type="text"
        className="form-control"
        value={address}
        autoComplete="off"
        disabled={true}
      />
    </div>
  );
};

export default ProposeRemoveUser;

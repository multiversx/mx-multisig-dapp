import React, { useState } from "react";
import { Address } from "@elrondnetwork/erdjs/out";
import { useTranslation } from "react-i18next";

interface ProposeInputAddressType {
  handleParamsChange: (params: Address) => void;
}

const ProposeInputAddress = ({
  handleParamsChange,
}: ProposeInputAddressType) => {
  const [address, setAddress] = useState("");
  const { t } = useTranslation();

  const handleAddressChanged = (event: any) => {
    setAddress(event.target.value);

    handleParamsChange(new Address(event.target.value));
  };

  return (
    <div className="modal-control-container">
      <span>{t("Address")}: </span>
      <input
        type="text"
        className="form-control"
        value={address}
        autoComplete="off"
        onChange={handleAddressChanged}
      />
    </div>
  );
};

export default ProposeInputAddress;

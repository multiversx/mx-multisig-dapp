import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProposeDeployContractType {
  handleParamsChange: (params: string) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeDeployContract = ({
  handleParamsChange,
  setSubmitDisabled,
}: ProposeDeployContractType) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const handleAddressChanged = (e: any) => {
    try {
      const newName = e.target.value;
      if (newName.length < 1) {
        setError(true);
        setSubmitDisabled(true);
        return;
      }
      setError(false);
      setName(newName);
      handleParamsChange(newName);
      setSubmitDisabled(false);
    } catch (err) {
      setSubmitDisabled(true);
      setError(true);
    }
  };

  return (
    <div className="modal-control-container">
      <label>{t("Contract name")} </label>
      <input
        type="text"
        className="form-control"
        value={name}
        autoComplete="off"
        onChange={handleAddressChanged}
      />
      {error && <p className="text-danger">{t("Name cannot be empty")}</p>}
    </div>
  );
};

export default ProposeDeployContract;

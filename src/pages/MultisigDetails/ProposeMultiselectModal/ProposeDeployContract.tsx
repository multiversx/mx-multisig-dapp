import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MultisigDeployContract } from "types/MultisigDeployContract";

interface ProposeDeployContractType {
  handleChange: (proposal: MultisigDeployContract) => void;
}

const ProposeDeployContract = ({ handleChange }: ProposeDeployContractType) => {
  const { t } = useTranslation();

  const [amount, setAmount] = useState(0);
  const [code, setCode] = useState("");
  const [upgradeable, setUpgradeable] = useState(false);
  const [payable, setPayable] = useState(false);
  const [readable, setReadable] = useState(false);

  const getProposal = (): MultisigDeployContract | null => {
    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const result = new MultisigDeployContract(amountNumeric, code);
    result.upgradeable = upgradeable;
    result.payable = payable;
    result.readable = readable;

    return result;
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onCodeChanged = (event: any) => {
    setCode(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [name, amount, code, upgradeable, payable, readable]);

  return (
    <div>
      <div className="modal-control-container">
        <p className={"form-label"}>{t(" Amount")}: </p>
        <input
          className="form-control"
          value={amount}
          autoComplete="off"
          onChange={onAmountChanged}
        />
      </div>
      <div className="modal-control-container my-5">
        <p className={"form-label"}>{t("Code")}: </p>
        <textarea
          className="form-control"
          value={code}
          autoComplete="off"
          onChange={onCodeChanged}
        />
      </div>
      <div className="modal-control-container my-2">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="upgradeableCheckBox"
            checked={upgradeable}
            onChange={(e) => setUpgradeable(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="upgradeableCheckBox">
            {t("Upgradeable")}
          </label>
        </div>
      </div>
      <div className="modal-control-container">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="payableCheckBox"
            checked={payable}
            onChange={(e) => setPayable(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="payableCheckBox">
            {t("Payable")}
          </label>
        </div>
      </div>
      <div className="modal-control-container my-2">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="readableCheckBox"
            checked={readable}
            onChange={(e) => setReadable(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="readableCheckBox">
            {t("Readable")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProposeDeployContract;

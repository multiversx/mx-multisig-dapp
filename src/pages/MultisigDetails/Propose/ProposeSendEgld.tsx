import React, { useContext, useMemo, useState } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import { BigUIntValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useTranslation } from "react-i18next";
import denominate from "components/Denominate/denominate";
import { denomination } from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { MultisigSendEgld } from "types/MultisigSendEgld";

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
}

const ProposeSendEgld = ({ handleChange }: ProposeSendEgldType) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState("");
  const { multisigBalance } = useContext(MultisigDetailsContext);
  const { t } = useTranslation();

  const denominatedValue = useMemo(
    () =>
      denominate({
        input: multisigBalance.toString(),
        denomination: denomination,
        decimals: 4,
        showLastNonZeroDecimal: true,
      }),
    [multisigBalance],
  );

  const getProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(address);

      const amountNumeric = Number(amount);
      if (isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(addressParam, amountParam, data);
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onDataChanged = (event: any) => {
    setData(event.target.value);
  };

  const onSetMaxAmount = () => {
    setAmount(denominatedValue);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [address, amount, data]);

  return (
    <div>
      <div className="modal-control-container">
        <label>{t("Send to")} </label>
        <input
          type="text"
          className="form-control"
          value={address}
          autoComplete="off"
          onChange={onAddressChanged}
        />
      </div>
      <div className="modal-control-container">
        <label>{t("Amount")} </label>
        <div className="input-wrraper">
          <input
            type="text"
            className="form-control"
            value={amount}
            autoComplete="off"
            onChange={onAmountChanged}
          />

          <span onClick={onSetMaxAmount}>Max</span>
        </div>
        <span>{`Balance: ${denominatedValue} EGLD`} </span>
      </div>
      <div className="modal-control-container">
        <label>{t("Data")} </label>
        <textarea
          className="form-control"
          value={data}
          autoComplete="off"
          onChange={onDataChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;

import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import MultisigDetailsContext from "context/MultisigDetailsContext";

interface ProposeChangeQuorumType {
  handleParamsChange: (params: number) => void;
}

const ProposeChangeQuorum = ({
  handleParamsChange,
}: ProposeChangeQuorumType) => {
  const { quorumSize, totalBoardMembers } = useContext(MultisigDetailsContext);
  const { t } = useTranslation();

  const [newQuorumSize, setNewQuorumSize] = useState(1);
  const [error, setError] = useState(false);

  const handleNewQuorumSizeChanged = (event: any) => {
    const newQuorum = Number(event.target.value);
    if (newQuorum > totalBoardMembers || newQuorum < 1) {
      setError(true);
      return;
    }
    setError(false);
    setNewQuorumSize(newQuorum);
    handleParamsChange(newQuorum);
  };

  useEffect(() => {
    setNewQuorumSize(quorumSize);
  }, [quorumSize]);

  return (
    <div className="d-flex flex-column modal-control-container">
      <div className="group-center">
        <label>{t("Quorum Size")}: </label>
        <input
          style={{ width: 250 }}
          type="number"
          min={1}
          className="form-control"
          value={newQuorumSize}
          autoComplete="off"
          onChange={handleNewQuorumSizeChanged}
        />
        {error && (
          <p className="text-danger">
            {t("Quorum cannot be bigger than the number of board members")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProposeChangeQuorum;

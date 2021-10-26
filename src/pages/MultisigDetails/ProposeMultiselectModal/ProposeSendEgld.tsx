import React, { useMemo } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import { BigUIntValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { TestContext } from "yup";
import denominate from "components/Denominate/denominate";
import { denomination } from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { MultisigSendEgld } from "types/MultisigSendEgld";

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeSendEgld = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendEgldType) => {
  const { multisigBalance } = React.useContext(MultisigDetailsContext);

  const { t } = useTranslation();

  React.useEffect(() => {
    setSubmitDisabled(true);
  }, []);

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

  const validationSchema = Yup.object().shape({
    receiver: Yup.string()
      .min(2, "Too Short!")
      .max(500, "Too Long!")
      .required("Required")
      .test(validateRecipient),
    amount: Yup.string()
      .required("Required")
      .transform((value) => value.replace(",", "."))
      .test(validateAmount),
    data: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      receiver: "",
      amount: 0,
      data: "",
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
  });

  React.useEffect(() => {
    refreshProposal();
  }, [formik.values]);

  const getProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(formik.values.receiver);

      const amountNumeric = Number(formik.values.amount);
      if (isNaN(amountNumeric)) {
        setSubmitDisabled(true);
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(
        addressParam,
        amountParam,
        formik.values.data,
      );
    } catch (err) {
      setSubmitDisabled(true);
      return null;
    }
  };

  function refreshProposal() {
    if (Object.keys(formik.errors).length > 0) {
      setSubmitDisabled(true);
      return;
    }
    const proposal = getProposal();
    if (proposal !== null) {
      setSubmitDisabled(false);
      handleChange(proposal);
    }
  }

  function validateRecipient(value?: string) {
    try {
      new Address(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function validateAmount(value?: string, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
    const amount = Number(value);
    if (Number.isNaN(amount)) {
      return (
        testContext?.createError({
          message: "Invalid amount",
        }) ?? false
      );
    }
    if (amount < 0) {
      formik.setFieldValue("amount", 0);
    }
    if (amount > Number(multisigBalance.toDenominated())) {
      setSubmitDisabled(true);
      return (
        testContext?.createError({
          message:
            "There are not enough money in the organization for this transaction",
        }) ?? false
      );
    }
    return true;
  }

  const { touched, errors } = formik;

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;

  return (
    <div>
      <div className="modal-control-container">
        <label>{t("Send to")} </label>
        <div className="input-wrapper">
          <Form.Control
            id="receiver"
            name="receiver"
            type="text"
            isInvalid={receiverError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.receiver}
          />
          {receiverError != null && (
            <Form.Control.Feedback type={"invalid"}>
              {receiverError}
            </Form.Control.Feedback>
          )}
        </div>
      </div>
      <div className="modal-control-container">
        <label>{t("Amount")} </label>
        <div className="input-wrapper">
          <Form.Control
            id="amount"
            name="amount"
            isInvalid={amountError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
          />

          {amountError != null && (
            <Form.Control.Feedback type={"invalid"}>
              {amountError}
            </Form.Control.Feedback>
          )}
        </div>
        <span>{`Balance: ${denominatedValue} EGLD`} </span>
      </div>
      <div className="modal-control-container">
        <label>{t("Data")} </label>
        <Form.Control
          id="data"
          name="data"
          type="data"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.data}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;

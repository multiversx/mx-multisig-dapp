import React, { useEffect, useMemo } from "react";
import { Address, Balance, BigUIntValue } from "@elrondnetwork/erdjs/out";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { TestContext } from "yup";
import denominate from "components/Denominate/denominate";
import { denomination } from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { FormikInputField } from "helpers/formikFields";
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
    functionName: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      receiver: "",
      amount: 0,
      functionName: "",
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  const { touched, errors, values } = formik;
  const { amount, receiver, functionName } = values;

  useEffect(() => {
    refreshProposal();
  }, [formik.values, formik.errors]);

  useEffect(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [formik.errors]);

  const getProposal = (): MultisigSendEgld | null => {
    try {
      const addressParam = new Address(formik.values.receiver);

      const amountNumeric = Number(formik.values.amount);
      if (isNaN(amountNumeric)) {
        return null;
      }

      const amountParam = new BigUIntValue(
        Balance.egld(amountNumeric).valueOf(),
      );

      return new MultisigSendEgld(addressParam, amountParam, functionName);
    } catch (err) {
      return null;
    }
  };

  function refreshProposal() {
    if (Object.keys(formik.errors).length > 0) {
      return;
    }
    const proposal = getProposal();
    if (proposal !== null) {
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
      return (
        testContext?.createError({
          message:
            "There are not enough money in the organization for this transaction",
        }) ?? false
      );
    }
    return true;
  }

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;
  return (
    <div>
      <FormikInputField
        label={t("Send to")}
        name={"receiver"}
        value={receiver}
        error={receiverError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <div className="modal-control-container">
        <label>{t("Amount")} </label>
        <div className="input-wrapper">
          <Form.Control
            id="amount"
            name="amount"
            isInvalid={amountError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={amount}
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
        <label>{t("function name (optional)")} </label>
        <Form.Control
          id="functionName"
          name="functionName"
          type="functionName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={functionName}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;

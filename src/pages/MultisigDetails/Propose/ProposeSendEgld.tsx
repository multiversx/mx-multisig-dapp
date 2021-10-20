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
}

const ProposeSendEgld = ({ handleChange }: ProposeSendEgldType) => {
  const { multisigBalance } = React.useContext(MultisigDetailsContext);

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

  const validationSchema = Yup.object().shape({
    receiver: Yup.string()
      .min(2, "Too Short!")
      .max(500, "Too Long!")
      .required("Required")
      .test(validateRecipient),
    amount: Yup.number()
      .min(-1, "Too Short!")
      .required("Required")
      .test(validateAccount),
    data: Yup.string().required("Required"),
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
    validate: refreshProposal,
  });

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

      return new MultisigSendEgld(
        addressParam,
        amountParam,
        formik.values.data,
      );
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

  function validateAccount(value?: number, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
    if (Number(value) < 0) {
      formik.setFieldValue("amount", 0);
    }
    if (Number(value) > Number(multisigBalance.toDenominated())) {
      return (
        testContext?.createError({
          message:
            "There are not enough money in the organization for this transaction",
        }) ?? false
      );
    }
    return true;
  }

  const onSetMaxAmount = () => {
    formik.setFieldValue("amount", denominatedValue);
  };

  const { touched, errors } = formik;

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;

  return (
    <div>
      <div className="modal-control-container">
        <label>{t("Send to")} </label>
        <div className="input-wrraper">
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
        <div className="input-wrraper">
          <Form.Control
            id="amount"
            name="amount"
            type="number"
            min={0}
            isInvalid={amountError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
          />
          <span onClick={onSetMaxAmount}>Max</span>

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
          onBlur={formik.handleBlur}
          value={formik.values.data}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;

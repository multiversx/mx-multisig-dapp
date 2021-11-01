import React, { useMemo } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import {
  BigUIntValue,
  BytesValue,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { TestContext } from "yup";
import denominate from "components/Denominate/denominate";
import { denomination } from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { FormikInputField } from "helpers/formikFields";
import { MultisigSmartContractCall } from "types/MultisigSmartContractCall";

interface ProposeSmartContractCallType {
  handleChange: (proposal: MultisigSmartContractCall) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeSmartContractCall = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSmartContractCallType) => {
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
    amount: Yup.string()
      .required("Required")
      .transform((value) => value.replace(",", "."))
      .test(validateAmount),
    data: Yup.string().required().test(validateData),
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
    validateOnMount: true,
  });

  React.useEffect(() => {
    refreshProposal();
  }, [formik.values]);

  const getProposal = (): MultisigSmartContractCall | null => {
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

      try {
        const [endpointName, ...dataArgs] = formik.values.data.split("@");
        if (endpointName == null || dataArgs.length < 1) {
          throw new Error("endpoint is required");
        }
        const args = dataArgs.map((arg) => BytesValue.fromHex(arg));
        setSubmitDisabled(false);
        return new MultisigSmartContractCall(
          addressParam,
          amountParam,
          endpointName,
          args,
        );
      } catch (error) {
        formik.setFieldError("data", "Invalid data");
        throw error;
      }
    } catch (err) {
      console.log("caught");
      setSubmitDisabled(true);
      console.error(err);
      return null;
    }
  };

  function refreshProposal() {
    if (Object.keys(formik.errors).length > 0 || !formik.dirty) {
      setSubmitDisabled(true);
      return;
    }
    const proposal = getProposal();
    if (proposal !== null) {
      setSubmitDisabled(false);
      handleChange(proposal);
    }
  }

  function validateData() {
    try {
      const [endpointName, ...dataArgs] = formik.values.data.split("@");
      if (endpointName == null || dataArgs.length < 1) {
        return false;
      }
      dataArgs.map((arg) => BytesValue.fromHex(arg));
      return true;
    } catch (err) {
      return false;
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

  const { touched, errors, values } = formik;
  const { receiver, amount, data } = values;

  const receiverError = touched.receiver && errors.receiver;
  const amountError = touched.amount && errors.amount;
  const dataError = touched.data && errors.data;

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
      <FormikInputField
        label={t("Amount")}
        name={"amount"}
        value={amount}
        error={amountError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        footer={<span>{`Balance: ${denominatedValue} EGLD`} </span>}
      />
      <FormikInputField
        label={t("Data")}
        name={"data"}
        value={data}
        error={dataError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
    </div>
  );
};

export default ProposeSmartContractCall;

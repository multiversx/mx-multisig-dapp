import React, { useEffect } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import {
  BigUIntValue,
  BytesValue,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { FormikCheckbox, FormikInputField } from "helpers/formikFields";
import { validateAddressIsContract } from "helpers/validation";
import { MultisigDeployContractFromSource } from "types/MultisigDeployContractFromSource";

interface ProposeDeployContractFromSourceType {
  handleChange: (proposal: MultisigDeployContractFromSource) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeDeployContractFromSource = ({
  handleChange,
  setSubmitDisabled,
}: ProposeDeployContractFromSourceType) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required("Required").test(validateAmount),
    source: Yup.string().required("required").test(validateAddressIsContract),
    args: Yup.string(),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      amount: "0",
      source: "",
      args: "",
      upgradeable: false,
      payable: false,
      readable: false,
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });
  const { touched, errors, values } = formik;

  const { amount, source, args, upgradeable, payable, readable } = values;

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  function validateAmount(value?: string) {
    const amountNumeric = Number(value);
    return !isNaN(amountNumeric);
  }

  const getProposal = (): MultisigDeployContractFromSource | null => {
    const amountNumeric = Number(amount);
    if (Object.keys(errors).length > 0) {
      return null;
    }
    if (isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());
    let argsArguments: BytesValue[] = [];
    try {
      argsArguments = args.split("@").map((arg) => BytesValue.fromHex(arg));
    } catch (err) {}

    return new MultisigDeployContractFromSource(
      amountParam,
      new Address(source),
      upgradeable,
      payable,
      readable,
      argsArguments,
    );
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  React.useEffect(() => {
    refreshProposal();
  }, [amount, source, args, upgradeable, payable, readable, errors]);

  const sourceError = touched.source && errors.source;

  const amountError = touched.amount && errors.amount;

  return (
    <div>
      <FormikInputField
        label={t("Source")}
        name={"source"}
        value={source}
        error={sourceError}
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
      />
      <FormikInputField
        label={t("Arguments")}
        name={"args"}
        value={args}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikCheckbox
        label={t("Upgradeable")}
        name={"upgradeable"}
        checked={upgradeable}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t("Payable")}
        name={"payable"}
        checked={payable}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t("Readable")}
        name={"readable"}
        checked={readable}
        handleChange={formik.handleChange}
      />
    </div>
  );
};

export default ProposeDeployContractFromSource;

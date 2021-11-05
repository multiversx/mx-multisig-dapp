import React, { useEffect } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import {
  BigUIntValue,
  BytesValue,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { FormikCheckbox, FormikInputField } from "helpers/formikFields";
import { validateContractAddressOwner } from "helpers/validation";
import { currentMultisigAddressSelector } from "redux/selectors/multisigContractsSelectors";
import { MultisigUpgradeContractFromSource } from "types/MultisigUpgradeContractFromSource";

interface ProposeDeployContractType {
  handleChange: (proposal: MultisigUpgradeContractFromSource) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeDeployContract = ({
  handleChange,
  setSubmitDisabled,
}: ProposeDeployContractType) => {
  const { t } = useTranslation();
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required("Required")
      .test(validateContractAddressOwner(currentMultisigAddress)),
    amount: Yup.string().required("Required").test(validateAmount),
    source: Yup.string()
      .required("Required")
      .test(validateContractAddressOwner(currentMultisigAddress)),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
    args: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      address: "",
      amount: "",
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

  const { address, amount, args, source, upgradeable, payable, readable } =
    values;

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  function validateAmount(value?: string) {
    const amountNumeric = Number(value);
    return !isNaN(amountNumeric);
  }

  const getProposal = (): MultisigUpgradeContractFromSource | null => {
    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());
    return new MultisigUpgradeContractFromSource(
      new Address(address),
      amountParam,
      new Address(source),
      upgradeable,
      payable,
      readable,
      BytesValue.fromUTF8(args),
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
  }, [address, args, amount, source, upgradeable, payable, readable]);

  const addressError = touched.address && errors.address;

  const sourceError = touched.source && errors.source;
  const amountError = touched.amount && errors.amount;
  return (
    <div>
      <FormikInputField
        label={t("Address")}
        name={"address"}
        value={address}
        error={addressError}
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
        label={t("Source")}
        name={"source"}
        value={source}
        error={sourceError}
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

export default ProposeDeployContract;

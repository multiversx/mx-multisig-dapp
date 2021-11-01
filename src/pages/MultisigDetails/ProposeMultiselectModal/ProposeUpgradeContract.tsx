import React, { useEffect } from "react";
import {
  BigUIntValue,
  BytesValue,
  Address,
  Balance,
} from "@elrondnetwork/erdjs";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { FormikCheckbox, FormikInputField } from "helpers/formikFields";
import { validateContractAddressOwner } from "helpers/validation";
import { currentMultisigAddressSelector } from "redux/selectors/multisigContractsSelectors";
import { MultisigUpgradeContract } from "types/MultisigUpgradeContract";

interface ProposeDeployContractType {
  handleChange: (proposal: MultisigUpgradeContract) => void;
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
    code: Yup.string().required("Required").test(validateCode),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      address: "",
      amount: 0,
      code: "",
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

  const { address, amount, code, upgradeable, payable, readable } = values;

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  function validateAmount(value?: string) {
    const amountNumeric = Number(value);
    return !isNaN(amountNumeric);
  }

  function validateCode(value?: string) {
    try {
      if (value == null) {
        return false;
      }
      BytesValue.fromHex(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  const getProposal = (): MultisigUpgradeContract | null => {
    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());
    return new MultisigUpgradeContract(
      new Address(address),
      amountParam,
      code,
      upgradeable,
      payable,
      readable,
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
  }, [name, amount, code, upgradeable, payable, readable]);

  const codeError = touched.code && errors.code;
  const amountError = touched.amount && errors.amount;
  const addressError = touched.address && errors.address;

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
        label={t("Code")}
        name={"code"}
        value={code}
        as={"textarea"}
        error={codeError}
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

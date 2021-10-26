import React, { useEffect } from "react";
import { BytesValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { MultisigDeployContract } from "types/MultisigDeployContract";

interface ProposeDeployContractType {
  handleChange: (proposal: MultisigDeployContract) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeDeployContract = ({
  handleChange,
  setSubmitDisabled,
}: ProposeDeployContractType) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required("Required").test(validateAmount),
    code: Yup.string().required("Required").test(validateCode),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
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
  });
  const { touched, errors, values } = formik;

  const { amount, code, upgradeable, payable, readable } = values;

  useEffect(() => {
    setSubmitDisabled(true);
  }, []);

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

  React.useEffect(() => {
    refreshProposal();
  }, [name, amount, code, upgradeable, payable, readable]);

  const codeError = touched.code && errors.code;
  const amountError = touched.amount && errors.amount;

  return (
    <div>
      <div className="modal-control-container">
        <div className={"input-wrapper"}>
          <label className={"form-label"}>{t(" Amount")}: </label>
          <Form.Control
            id="amount"
            name="amount"
            type="text"
            isInvalid={amountError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={amount}
          />
          {amountError && (
            <Form.Control.Feedback type={"invalid"}>
              {amountError}
            </Form.Control.Feedback>
          )}
        </div>
      </div>
      <div className="modal-control-container my-5">
        <div className={"input-wrapper"}>
          <label className={"form-label"}>{t("Code")}: </label>
          <Form.Control
            id="code"
            name="code"
            type="text"
            as="textarea"
            isInvalid={codeError != null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={code}
          />
          {codeError && (
            <Form.Control.Feedback type={"invalid"}>
              {codeError}
            </Form.Control.Feedback>
          )}
        </div>
      </div>
      <div className="modal-control-container my-2">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="upgradeable"
            name={"upgradeable"}
            checked={upgradeable}
            onChange={formik.handleChange}
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
            id="payable"
            name={"payable"}
            checked={payable}
            onChange={formik.handleChange}
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
            id="readable"
            name={"readable"}
            checked={readable}
            onChange={formik.handleChange}
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

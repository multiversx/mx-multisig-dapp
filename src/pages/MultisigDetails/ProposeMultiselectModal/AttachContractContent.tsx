import React from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { Address } from "@elrondnetwork/erdjs";
import { faArrowLeft, faLink } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { getAccountData } from "apiCalls/accountCalls";
import getProviderType from "components/SignTransactions/helpers/getProviderType";
import { buildBlockchainTransaction } from "contracts/transactionUtils";
import useSendTransactions from "hooks/useSendTransactions";
import { currentMultisigAddressSelector } from "redux/selectors/multisigContractsSelectors";
import { setProposeMultiselectSelectedOption } from "redux/slices/modalsSlice";
import { ProposalsTypes } from "types/Proposals";

const gasLimit = 10_000_000;

interface AttachContractContentProps {
  handleClose: () => void;
}
const AttachContractContent = ({ handleClose }: AttachContractContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    address,
    dapp: { provider },
  } = useDappContext();
  const sendTransactionsToBeSigned = useSendTransactions();
  const providerType = getProviderType(provider);
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);

  const validationSchema = Yup.object().shape({
    contractAddress: Yup.string()
      .required("Required")
      .test(validateContractAddress),
  });

  const formik = useFormik({
    initialValues: {
      contractAddress: "",
    },
    onSubmit: (values: any) => {
      try {
        const data = `ChangeOwnerAddress@${currentMultisigAddress?.hex()}`;

        const transaction = buildBlockchainTransaction(
          0,
          providerType,
          gasLimit,
          new Address(values.contractAddress),
          data,
        );
        sendTransactionsToBeSigned(transaction);
        handleClose();
      } catch (error) {
        alert("An error occurred, please try again");
      }
    },
    validationSchema,
    validateOnChange: true,
  });

  async function validateContractAddress(
    value?: string,
    testContext?: Yup.TestContext,
  ) {
    try {
      const contractAddress = new Address(value);
      if (value == null) {
        return true;
      }
      const isContract = contractAddress.isContractAddress();
      if (!isContract) {
        return (
          testContext?.createError({
            message: "Entered address does not belong to a contract",
          }) ?? false
        );
      }
      const contractInfo = await getAccountData(value);
      const isCurrentUserOwner = new Address(contractInfo.ownerAddress).equals(
        new Address(address),
      );
      if (!isCurrentUserOwner) {
        return (
          testContext?.createError({
            message: "This contract does not belong to the current user",
          }) ?? false
        );
      }
      return true;
    } catch (err) {
      return (
        testContext?.createError({
          message: "Invalid address",
        }) ?? false
      );
    }
  }

  const { touched, errors } = formik;

  const onGoBackClicked = () => {
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    );
  };

  const contractAddressError =
    touched.contractAddress && errors.contractAddress;

  return (
    <div className="card attach-contract-content">
      <div className="card-body">
        <p className="h3 mb-spacer text-center" data-testid="delegateTitle">
          {t("Transfer contract ownership")}
        </p>

        <div className="modal-control-container">
          <label>{t("Contract address")} </label>
          <div className="input-wrapper">
            <Form.Control
              id="contractAddress"
              name="contractAddress"
              type="text"
              isInvalid={contractAddressError != null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contractAddress}
            />
            {contractAddressError != null && (
              <Form.Control.Feedback type={"invalid"}>
                {contractAddressError}
              </Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>
      <div className="modal-action-btns">
        <button
          onClick={onGoBackClicked}
          className="btn btn-primary btn-light "
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("Back")}
        </button>
        <button
          disabled={contractAddressError != null}
          onClick={() => formik.handleSubmit()}
          className="btn btn-primary "
        >
          <FontAwesomeIcon icon={faLink} />
          {t("Attach")}
        </button>
      </div>
    </div>
  );
};

export default AttachContractContent;

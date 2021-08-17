import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import ProposeInputAddressType from './ProposeInputAddress';
import { Address } from '@elrondnetwork/erdjs/out';
import ProposeSendEgld from './ProposeSendEgld';
import { MultisigSendEgld } from 'types/MultisigSendEgld';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigIssueToken } from 'types/MultisigIssueToken';
import ProposeIssueToken from './ProposeIssueToken';
import { MultisigSendToken } from 'types/MultisigSendToken';
import ProposeSendToken from './ProposeSendToken';
import { useMultisigContract } from 'contracts/MultisigContract';
import { useTranslation } from 'react-i18next';

interface ProposeModalType {
  show: boolean;
  handleClose: () => void;
}

const ProposeModal = ({ show, handleClose }: ProposeModalType) => {
  const {
    mutateSendEgld,
    mutateEsdtSendToken,
    mutateEsdtIssueToken,
    mutateProposeChangeQuorum,
    mutateProposeAddProposer,
    mutateProposeAddBoardMember,
    mutateProposeRemoveUser,
  } = useMultisigContract();
  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedNumericParam, setSelectedNumericParam] = useState(0);
  const [selectedAddressParam, setSelectedAddressParam] = useState(new Address());
  const [selectedProposal, setSelectedProposal] = useState<MultisigAction | null>(null);

  const options = [
    { value: 'change_quorum', label: t('Change Quorum') },
    { value: 'add_proposer', label: t('Add Proposer') },
    { value: 'add_board_member', label: t('Add Board Member') },
    { value: 'remove_user', label: t('Remove User') },
    { value: 'send_egld', label: t('Send eGLD') },
    { value: 'issue_token', label: t('Issue Token') },
    { value: 'send_token', label: t('Send Token') },
  ];

  const handleOptionChange = (option: any, label: any) => {
    setSelectedProposal(null);

    setSelectedOption(option.value.toString());
  };

  const onProposeClicked = () => {
    if (selectedProposal instanceof MultisigSendEgld) {
      mutateSendEgld(selectedProposal.address, selectedProposal.amount, selectedProposal.data);
      return;
    } else if (selectedProposal instanceof MultisigIssueToken) {
      mutateEsdtIssueToken(selectedProposal as MultisigIssueToken);
      return;
    } else if (selectedProposal instanceof MultisigSendToken) {
      mutateEsdtSendToken(selectedProposal as MultisigSendToken);
      return;
    }

    switch (selectedOption) {
      case 'change_quorum':
        mutateProposeChangeQuorum(selectedNumericParam);
        break;
      case 'add_proposer':
        mutateProposeAddProposer(selectedAddressParam);
        break;
      case 'add_board_member':
        mutateProposeAddBoardMember(selectedAddressParam);
        break;
      case 'remove_user':
        mutateProposeRemoveUser(selectedAddressParam);
        break;
      default:
        console.error(`Unrecognized option ${selectedOption}`);
        break;
    }
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
  };

  const handleProposalChange = (proposal: MultisigAction) => {
    setSelectedProposal(proposal);
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer text-center">
          <p className="h6 mb-spacer" data-testid="delegateTitle">
            {t('Propose')}
          </p>
          <Select
            placeholder={t('Select') + '...'}
            options={options}
            onChange={handleOptionChange}
            theme={(theme: any) => ({
              ...theme,
              borderRadius: 0,
            })}
          />

          <div className="p-spacer">
            {selectedOption === 'change_quorum' ? (
              <ProposeChangeQuorum handleParamsChange={handleNumericParamChange} />
            ) : selectedOption === 'add_proposer' ||
              selectedOption === 'add_board_member' ||
              selectedOption === 'remove_user' ? (
              <ProposeInputAddressType handleParamsChange={handleAddressParamChange} />
            ) : selectedOption === 'send_egld' ? (
              <ProposeSendEgld handleChange={handleProposalChange} />
            ) : selectedOption === 'issue_token' ? (
              <ProposeIssueToken handleChange={handleProposalChange} />
            ) : selectedOption === 'send_token' ? (
              <ProposeSendToken handleChange={handleProposalChange} />
            ) : null}
          </div>

          <div>
            <button onClick={onProposeClicked} className="btn btn-primary mb-3">
              {t('Propose')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeModal;

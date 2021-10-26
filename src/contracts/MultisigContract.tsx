import { useContext as useDappContext } from "@elrondnetwork/dapp";
import {
  ContractFunction,
  Balance,
  Address,
  SmartContract,
  BinaryCodec,
} from "@elrondnetwork/erdjs";

import { NumericalBinaryCodec } from "@elrondnetwork/erdjs/out/smartcontracts/codec/numerical";
import { Query } from "@elrondnetwork/erdjs/out/smartcontracts/query";
import {
  AddressValue,
  BigUIntValue,
  BooleanType,
  BooleanValue,
  BytesValue,
  TypedValue,
  U32Type,
  U32Value,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { gasLimit } from "config";
import { parseAction, parseActionDetailed } from "helpers/converters";
import useSendTransactions from "hooks/useSendTransactions";
import { currentMultisigAddressSelector } from "redux/selectors/multisigContractsSelectors";
import { MultisigAction } from "types/MultisigAction";
import { MultisigActionDetailed } from "types/MultisigActionDetailed";
import { MultisigIssueToken } from "types/MultisigIssueToken";
import { MultisigSendToken } from "types/MultisigSendToken";
import getProviderType from "../components/SignTransactions/helpers/getProviderType";
import { deployContractGasLimit } from "./ManagerContract";
import { buildTransaction } from "./transactionUtils";

export function useMultisigContract() {
  const currentMultisigAddress = useSelector(currentMultisigAddressSelector);
  const { dapp } = useDappContext();
  const sendTransactionsToBeSigned = useSendTransactions();

  const providerType = getProviderType(dapp.provider);

  const smartContract = new SmartContract({ address: currentMultisigAddress });

  function sendTransaction(
    functionName: string,
    transactionGasLimit = gasLimit,
    ...args: TypedValue[]
  ) {
    const transaction = buildTransaction(
      0,
      functionName,
      providerType,
      smartContract,
      transactionGasLimit,
      ...args,
    );
    return sendTransactionsToBeSigned(transaction);
  }

  function mutateSign(actionId: number) {
    return sendTransaction("sign", gasLimit, new U32Value(actionId));
  }

  function mutateUnsign(actionId: number) {
    return sendTransaction("unsign", gasLimit, new U32Value(actionId));
  }

  function mutatePerformAction(actionId: number, transactionGasLimit: number) {
    return sendTransaction(
      "performAction",
      transactionGasLimit,
      new U32Value(actionId),
    );
  }

  function mutateDiscardAction(actionId: number) {
    return sendTransaction("discardAction", gasLimit, new U32Value(actionId));
  }

  function mutateProposeChangeQuorum(quorumSize: number) {
    return sendTransaction(
      "proposeChangeQuorum",
      gasLimit,
      new U32Value(quorumSize),
    );
  }

  function mutateProposeAddProposer(address: Address) {
    return sendTransaction(
      "proposeAddProposer",
      gasLimit,
      new AddressValue(address),
    );
  }

  function mutateProposeAddBoardMember(address: Address) {
    return sendTransaction(
      "proposeAddBoardMember",
      gasLimit,
      new AddressValue(address),
    );
  }

  function mutateProposeRemoveUser(address: Address) {
    return sendTransaction(
      "proposeRemoveUser",
      gasLimit,
      new AddressValue(address),
    );
  }

  function mutateSendEgld(
    address: Address,
    amount: BigUIntValue,
    data: string,
  ) {
    return sendTransaction(
      "proposeSendEgld",
      gasLimit,
      new AddressValue(address),
      amount,
      BytesValue.fromUTF8(data),
    );
  }

  function mutateSmartContractCall(
    address: Address,
    amount: BigUIntValue,
    endpointName: string,
    args: TypedValue[],
  ) {
    const allArgs: TypedValue[] = [
      new AddressValue(address),
      amount,
      BytesValue.fromUTF8(endpointName),
    ];
    allArgs.push(...args);

    return sendTransaction("proposeSCCall", gasLimit, ...allArgs);
  }

  function mutateDeployContract(
    amount: BigUIntValue,
    code: string,
    upgradeable: boolean,
    payable: boolean,
    readable: boolean,
    ...args: BytesValue[]
  ) {
    const allArgs = [amount, BytesValue.fromUTF8(code), ...args];
    if (upgradeable) {
      args.push(BytesValue.fromUTF8("upgradeable"));
      args.push(BytesValue.fromUTF8("true"));
    }
    if (payable) {
      args.push(BytesValue.fromUTF8("payable"));
      args.push(BytesValue.fromUTF8("true"));
    }
    if (readable) {
      args.push(BytesValue.fromUTF8("readable"));
      args.push(BytesValue.fromUTF8("true"));
    }
    return sendTransaction(
      "proposeSCDeploy",
      deployContractGasLimit,
      ...allArgs,
    );
  }

  function mutateEsdtSendToken(proposal: MultisigSendToken) {
    mutateSmartContractCall(
      proposal.address,
      new BigUIntValue(new BigNumber(0)),
      "ESDTTransfer",
      [BytesValue.fromUTF8(proposal.identifier), new U32Value(proposal.amount)],
    );
  }

  function mutateEsdtIssueToken(proposal: MultisigIssueToken) {
    const esdtAddress = new Address(
      "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u",
    );
    const esdtAmount = new BigUIntValue(Balance.egld(5).valueOf());

    const args = [];
    args.push(BytesValue.fromUTF8(proposal.name));
    args.push(BytesValue.fromUTF8(proposal.identifier));
    args.push(new U32Value(proposal.amount * Math.pow(10, proposal.decimals)));
    args.push(new U32Value(proposal.decimals));

    if (proposal.canFreeze) {
      args.push(BytesValue.fromUTF8("canFreeze"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canWipe) {
      args.push(BytesValue.fromUTF8("canWipe"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canPause) {
      args.push(BytesValue.fromUTF8("canPause"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canMint) {
      args.push(BytesValue.fromUTF8("canMint"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canBurn) {
      args.push(BytesValue.fromUTF8("canBurn"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canChangeOwner) {
      args.push(BytesValue.fromUTF8("canChangeOwner"));
      args.push(BytesValue.fromUTF8("true"));
    }

    if (proposal.canUpgrade) {
      args.push(BytesValue.fromUTF8("canUpgrade"));
      args.push(BytesValue.fromUTF8("true"));
    }

    mutateSmartContractCall(esdtAddress, esdtAmount, "issue", args);
  }

  function queryAllActions(): Promise<MultisigActionDetailed[]> {
    return queryActionContainerArray("getPendingActionFullInfo");
  }

  function queryBoardMembersCount(): Promise<number> {
    return queryNumber("getNumBoardMembers");
  }

  function queryProposersCount(): Promise<number> {
    return queryNumber("getNumProposers");
  }

  function queryQuorumCount(): Promise<number> {
    return queryNumber("getQuorum");
  }

  function queryActionLastId(): Promise<number> {
    return queryNumber("getActionLastIndex");
  }

  function queryActionData(actionId: number): Promise<MultisigAction | null> {
    return queryActionContainer("getActionData", new U32Value(actionId));
  }

  function queryUserRole(userAddress: string): Promise<number> {
    return queryNumber("userRole", new AddressValue(new Address(userAddress)));
  }

  function queryBoardMemberAddresses(): Promise<Address[]> {
    return queryAddressArray("getAllBoardMembers");
  }

  function queryProposerAddresses(): Promise<Address[]> {
    return queryAddressArray("getAllProposers");
  }

  function queryActionSignerAddresses(actionId: number): Promise<Address[]> {
    return queryAddressArray("getActionSigners", new U32Value(actionId));
  }

  function queryActionSignerCount(actionId: number): Promise<number> {
    return queryNumber("getActionSignerCount", new U32Value(actionId));
  }

  function queryActionValidSignerCount(actionId: number): Promise<number> {
    return queryNumber("getActionValidSignerCount", new U32Value(actionId));
  }

  function queryActionIsQuorumReached(actionId: number): Promise<boolean> {
    return queryBoolean("quorumReached", new U32Value(actionId));
  }

  function queryActionIsSignedByAddress(
    userAddress: Address,
    actionId: number,
  ): Promise<boolean> {
    return queryBoolean(
      "signed",
      new AddressValue(userAddress),
      new U32Value(actionId),
    );
  }

  async function queryNumber(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<number> {
    const result = await query(functionName, ...args);

    const codec = new NumericalBinaryCodec();
    return codec
      .decodeTopLevel(result.outputUntyped()[0], new U32Type())
      .valueOf()
      .toNumber();
  }

  async function queryBoolean(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<boolean> {
    const result = await query(functionName, ...args);

    const codec = new BinaryCodec();
    return codec
      .decodeTopLevel<BooleanValue>(
        result.outputUntyped()[0],
        new BooleanType(),
      )
      .valueOf();
  }

  async function queryActionContainer(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<MultisigAction | null> {
    const result = await query(functionName, ...args);

    if (result.returnData.length === 0) {
      return null;
    }
    const [action] = parseAction(result.outputUntyped()[0]);
    return action;
  }

  async function queryActionContainerArray(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<MultisigActionDetailed[]> {
    const result = await query(functionName, ...args);

    const actions = [];
    for (const buffer of result.outputUntyped()) {
      const action = parseActionDetailed(buffer);
      if (action !== null) {
        actions.push(action);
      }
    }
    return actions;
  }
  async function queryAddressArray(
    functionName: string,
    ...args: TypedValue[]
  ): Promise<Address[]> {
    const result = await query(functionName, ...args);

    return result.outputUntyped().map((x) => new Address(x));
  }

  async function query(functionName: string, ...args: TypedValue[]) {
    const newQuery = new Query({
      address: smartContract.getAddress(),
      func: new ContractFunction(functionName),
      args: args,
    });
    return await dapp.proxy.queryContract(newQuery);
  }
  return {
    mutateEsdtIssueToken,
    mutateEsdtSendToken,
    mutateSmartContractCall,
    mutateSendEgld,
    mutateDeployContract,
    mutateProposeRemoveUser,
    mutateProposeAddBoardMember,
    mutateProposeAddProposer,
    mutateProposeChangeQuorum,
    mutateDiscardAction,
    mutatePerformAction,
    mutateUnsign,
    mutateSign,
    queryAllActions,
    queryProposersCount,
    queryBoardMembersCount,
    queryQuorumCount,
    queryActionLastId,
    queryActionData,
    queryUserRole,
    queryActionIsSignedByAddress,
    queryActionIsQuorumReached,
    queryActionValidSignerCount,
    queryActionSignerCount,
    queryActionSignerAddresses,
    queryProposerAddresses,
    queryBoardMemberAddresses,
  };
}

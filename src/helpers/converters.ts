import { Address, Nonce } from '@elrondnetwork/erdjs/out';
import { NumericalBinaryCodec } from '@elrondnetwork/erdjs/out/smartcontracts/codec/numerical';
import {
  BigUIntType,
  BytesValue,
  U32Value,
  U64Value,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import BigNumber from 'bignumber.js';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { MultisigActionType } from 'types/MultisigActionType';
import { MultisigAddBoardMember } from 'types/MultisigAddBoardMember';
import { MultisigAddProposer } from 'types/MultisigAddProposer';
import { MultisigChangeQuorum } from 'types/MultisigChangeQuorum';
import { MultisigContractInfo } from 'types/MultisigContractInfo';
import { MultisigRemoveUser } from 'types/MultisigRemoveUser';
import { MultisigSendEgld } from 'types/MultisigSendEgld';
import { MultisigSmartContractCall } from 'types/MultisigSmartContractCall';
const createKeccakHash = require('keccak');

export function parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
  let actionTypeByte = buffer.slice(0, 1)[0];
  let remainingBytes = buffer.slice(1);

  switch (actionTypeByte) {
    case MultisigActionType.AddBoardMember:
      return parseAddBoardMember(remainingBytes);
    case MultisigActionType.AddProposer:
      return parseAddProposer(remainingBytes);
    case MultisigActionType.RemoveUser:
      return parseRemoveUser(remainingBytes);
    case MultisigActionType.ChangeQuorum:
      return parseChangeQuorum(remainingBytes);
    case MultisigActionType.SendEgld:
      return parseSendEgld(remainingBytes);
    case MultisigActionType.SCCall:
      return parseSmartContractCall(remainingBytes);
    default:
      console.error(`Unrecognized action ${actionTypeByte}`);
      return [null, remainingBytes];
  }
}

function parseAddBoardMember(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let action = new MultisigAddBoardMember(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseAddProposer(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let action = new MultisigAddProposer(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseRemoveUser(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let action = new MultisigRemoveUser(new Address(remainingBytes.slice(0, 32)));
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseChangeQuorum(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let action = new MultisigChangeQuorum(getIntValueFromBytes(remainingBytes.slice(0, 4)));
  remainingBytes = remainingBytes.slice(4);

  return [action, remainingBytes];
}

function parseSendEgld(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let targetAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  let amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);

  let codec = new NumericalBinaryCodec();
  let amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  let dataSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let dataBytes = remainingBytes.slice(0, dataSize);
  remainingBytes = remainingBytes.slice(dataSize);

  let data = dataBytes.toString();

  let action = new MultisigSendEgld(targetAddress, amount, data);

  return [action, remainingBytes];
}

function parseSmartContractCall(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
  let targetAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  let amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);

  let codec = new NumericalBinaryCodec();
  let amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  let endpointNameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let endpointNameBytes = remainingBytes.slice(0, endpointNameSize);
  remainingBytes = remainingBytes.slice(endpointNameSize);

  let endpointName = endpointNameBytes.toString();

  let argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let args = [];
  for (let i = 0; i < argsSize; i++) {
    let argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    let argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(new BytesValue(argBytes));
  }

  let action = new MultisigSmartContractCall(targetAddress, amount, endpointName, args);

  return [action, remainingBytes];
}

export function parseActionDetailed(buffer: Buffer): MultisigActionDetailed | null {
  let actionId = getIntValueFromBytes(buffer.slice(0, 4));
  let actionBytes = buffer.slice(4);

  let [action, remainingBytes] = parseAction(actionBytes);
  if (action === null) {
    return null;
  }

  let signerCount = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let signers = [];
  for (let i = 0; i < signerCount; i++) {
    let addressBytes = remainingBytes.slice(0, 32);
    let address = new Address(addressBytes);
    remainingBytes = remainingBytes.slice(32);

    signers.push(address);
  }

  return new MultisigActionDetailed(action, actionId, signers);
}

export function parseContractInfo(buffer: Buffer): MultisigContractInfo | null {
  let remainingBytes = buffer;

  let addressBytes = remainingBytes.slice(0, 32);
  let address = new Address(addressBytes);
  remainingBytes = remainingBytes.slice(32);

  let nameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  let nameBytes = remainingBytes.slice(0, nameSize);
  let name = nameBytes.toString();
  remainingBytes = remainingBytes.slice(nameSize);

  let contractInfo = new MultisigContractInfo(address, name);
  return contractInfo;
}

export function getIntValueFromBytes(buffer: Buffer) {
  return (
    buffer[buffer.length - 1] |
    (buffer[buffer.length - 2] << 8) |
    (buffer[buffer.length - 3] << 16) |
    (buffer[buffer.length - 4] << 24)
  );
}

export function getBytesFromHexString(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return Buffer.from(bytes);
}

export function get32BitBufferFromNumber(value: number) {
  let paddedBuffer = Buffer.alloc(4);
  let encodedValue = new U32Value(value).valueOf();

  let encodedBuffer = getBytesFromHexString(encodedValue.toString());
  let concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  let result = concatenatedBuffer.slice(-4);
  return result;
}

export function get64BitBufferFromBigIntBE(value: BigInt) {
  let paddedBuffer = Buffer.alloc(8);
  let encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  let encodedBuffer = getBytesFromHexString(encodedValue.toString());
  let concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  let result = concatenatedBuffer.slice(-8);
  return result;
}

export function get64BitBufferFromBigIntLE(value: BigInt) {
  let paddedBuffer = Buffer.alloc(8);
  let encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  let encodedBuffer = getBytesFromHexString(encodedValue.toString()).reverse();
  let concatenatedBuffer = Buffer.concat([encodedBuffer, paddedBuffer]);
  let result = concatenatedBuffer.slice(0, 8);
  return result;
}

export function computeSmartContractAddress(owner: Address, nonce: Nonce) {
  let initialPadding = Buffer.alloc(8, 0);
  let ownerPubkey = owner.pubkey();
  let shardSelector = ownerPubkey.slice(30);
  let ownerNonceBytes = get64BitBufferFromBigIntLE(BigInt(nonce.valueOf()));
  let bytesToHash = Buffer.concat([ownerPubkey, ownerNonceBytes]);
  let hash = createKeccakHash('keccak256').update(bytesToHash).digest();
  let vmTypeBytes = Buffer.from('0500', 'hex');
  let addressBytes = Buffer.concat([
    initialPadding,
    vmTypeBytes,
    hash.slice(10, 30),
    shardSelector,
  ]);
  let address = new Address(addressBytes);
  return address;
}

export function hexToString(hex: string): string | null {
  try {
    let bytes = getBytesFromHexString(hex);
    return bytes.toString();
  } catch {
    console.error(`Could not parse hex '${hex} to string'`);
    return null;
  }
}

export function hexToNumber(hex: string): number | null {
  try {
    let bytes = getBytesFromHexString(hex);
    return getIntValueFromBytes(bytes);
  } catch {
    console.error(`Could not parse hex '${hex} to number'`);
    return null;
  }
}

export function hexToAddress(hex: string): Address | null {
  try {
    return new Address(hex);
  } catch {
    console.error(`Could not parse hex '${hex} to address'`);
    return null;
  }
}

export function hexToBigInt(hex: string): BigInt | null {
  let bytes = getBytesFromHexString(hex);

  try {
    let codec = new NumericalBinaryCodec();
    let value = codec.decodeTopLevel(bytes, new BigUIntType()).valueOf();
    return BigInt(value.toString());
  } catch {
    console.error(`Could not parse hex '${hex}' to BigInt`);
    return null;
  }
}

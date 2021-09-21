import { network, NetworkType } from "../config";

export const defaultNetwork: NetworkType = {
  id: "not-configured",
  name: "NOT CONFIGURED",
  egldLabel: "",
  walletAddress: "",
  apiAddress: "",
  gatewayAddress: "",
  explorerAddress: "",
  multisigDeployerContracts: [],
  multisigManagerContract: "",
};

const sessionNetwork = network || defaultNetwork;

export const multisigDeployerContracts =
  sessionNetwork.multisigDeployerContracts;
export const multisigManagerContract = sessionNetwork.multisigManagerContract;

export enum transactionStatuses {
  "pending" = "pending",
  "signed" = "signed",
  "failed" = "failed",
  "cancelled" = "cancelled",
}

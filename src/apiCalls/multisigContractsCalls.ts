import { getAddress, logout } from "@elrondnetwork/dapp-core";
import { services } from "@elrondnetwork/dapp-core-internal";
import axios, { AxiosError } from "axios";
import { extrasApi, maiarIdApi, network } from "config";
import { verifiedContractsHashes } from "helpers/constants";
import { routeNames } from "routes";
import { MultisigContractInfoType } from "types/multisigContracts";

const contractsInfoStorageEndpoint = `${extrasApi}/settings/multisig`;

const multisigAxiosInstance = axios.create();

multisigAxiosInstance.interceptors.request.use(
  async function (config) {
    const address = await getAddress();
    const token = await services.maiarId.getAccessToken({
      address,
      maiarIdApi,
    });
    config.headers.Authorization = `Bearer ${token.accessToken}`;
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  },
);

multisigAxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      console.log("Axios request 403. Logging out.");
      logout(routeNames.unlock);
    }
    return Promise.reject(error);
  },
);

export async function getIsContractTrusted(address?: string) {
  try {
    if (address == null) {
      return false;
    }
    const response = await axios.get(
      `${network.apiAddress}/address/${address}`,
    );
    const { data, code } = response.data;
    if (code === "successful") {
      const {
        account: { codeHash },
      } = data;
      return codeHash != null && verifiedContractsHashes.includes(codeHash);
    }
    return false;
  } catch (err) {
    console.error("error validating contract");
    return false;
  }
}

export async function addContractToMultisigContractsList(
  newContract: MultisigContractInfoType,
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = [...currentContracts, newContract];
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function removeContractFromMultisigContractsList(
  deletedContractAddress: string,
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.filter(
    (contract) => contract.address != deletedContractAddress,
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function getUserMultisigContractsList(): Promise<
  MultisigContractInfoType[]
> {
  try {
    const response = await multisigAxiosInstance.get(
      contractsInfoStorageEndpoint,
    );
    const { data } = response;
    if (data != null) {
      return data;
    }
    return [];
  } catch (err) {
    console.error("error getting multisig contracts");
    return [];
  }
}

import axios from "axios";
import { network, verifiedContractsHashes } from "../config";

export async function getIsContractTrusted(address: string) {
  try {
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

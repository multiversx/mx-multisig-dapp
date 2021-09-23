import { object, string, InferType, array } from "yup";

export const dAppName = "Multisig";
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasPriceModifier = "0.01";
export const gasPerDataByte = "1500";
export const gasLimit = "50000";
export const chainID = "T";

export const walletConnectBridge = "https://bridge.walletconnect.org";
export const walletConnectDeepLink =
  "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet.dev&link=https://maiar.com/";

export const contractAddress =
  "erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx";
export const multisigDeployerContract =
  "erd1qqqqqqqqqqqqqpgqp593httv72s3decqv2psa3yssajmmrhqerms52yjjd";
export const multisigManagerContract =
  "erd1qqqqqqqqqqqqqpgq4wxs8k5060eph7ehdkx4wmm9s4qgdj70ermspyr7pq";

export const network: NetworkType = {
  id: "testnet",
  name: "Testnet",
  egldLabel: "xEGLD",
  walletAddress: "https://testnet-wallet.elrond.com/dapp/init",
  apiAddress: "https://testnet-api.elrond.com",
  gatewayAddress: "https://testnet-gateway.elrond.com",
  explorerAddress: "http://testnet-explorer.elrond.com/",
};

export const verifiedContractsHashes = [
  "jzvVnfYqwzgh8J6ea0HxUJ0v0FfPY9GgCHBndGypH1A=",
];

const networkSchema = object({
  id: string().defined().required(),
  egldLabel: string().defined().required(),
  name: string().defined().required(),
  walletAddress: string(),
  apiAddress: string(),
  gatewayAddress: string(),
  explorerAddress: string().required(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});

import { object, string, InferType, array } from "yup";

export const dAppName = "Multisig";
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasPriceModifier = "0.01";
export const gasPerDataByte = "1500";
export const gasLimit = "50000";
export const chainID = "D";

export const walletConnectBridge = "https://bridge.walletconnect.org";
export const walletConnectDeepLink =
  "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet.dev&link=https://maiar.com/";

export const contractAddress =
  "erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx";

export const network: NetworkType = {
  id: "devnet",
  name: "Devnet",
  egldLabel: "xEGLD",
  walletAddress: "https://devnet-wallet.elrond.com/dapp/init",
  apiAddress: "https://devnet-api.elrond.com",
  gatewayAddress: "https://devnet-gateway.elrond.com",
  explorerAddress: "http://devnet-explorer.elrond.com/",
  multisigDeployerContracts: [
    "erd1qqqqqqqqqqqqqpgqmv4ywkst377ngwh0yyaj3kdufwwl04sherms282gz6",
    "erd1qqqqqqqqqqqqqpgqcm2ns0994y9qsuzchl33hu78eklu93syermstt4g4d",
    "erd1qqqqqqqqqqqqqpgq2c6z26r5q046w9jkzrvjxc9fgjwh54zcermsxtn8u5",
  ],
  multisigManagerContract:
    "erd1qqqqqqqqqqqqqpgqc3342h2wsjh7xmvxm6ka99peplvclj2serms5at6s2",
};

const networkSchema = object({
  id: string().defined().required(),
  egldLabel: string().defined().required(),
  name: string().defined().required(),
  walletAddress: string(),
  apiAddress: string(),
  gatewayAddress: string(),
  explorerAddress: string(),
  multisigDeployerContracts: array()
    .of(string().defined().required())
    .defined()
    .required(),
  multisigManagerContract: string(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});

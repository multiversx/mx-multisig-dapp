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

export const network: NetworkType = {
  id: "testnet",
  name: "Testnet",
  egldLabel: "xEGLD",
  walletAddress: "https://testnet-wallet.elrond.com/dapp/init",
  apiAddress: "https://testnet-api.elrond.com",
  gatewayAddress: "https://testnet-gateway.elrond.com",
  explorerAddress: "http://testnet-explorer.elrond.com/",
  multisigDeployerContracts: [
    "erd1qqqqqqqqqqqqqpgqmmk8v6kxe80f7mjv02fpezaaqlwtjx4termsxp2pdl",
    "erd1qqqqqqqqqqqqqpgqs4sw57gwv8amf7a97rqrttlqt9xzccewermscrrj5w",
    "erd1qqqqqqqqqqqqqpgqjjag9ddyc36l865h9mp3a9smfcg8gky5ermscml6w4",
  ],
  multisigManagerContract:
    "erd1qqqqqqqqqqqqqpgq6a2m7q30hfnqgkjpx6ufax47nruq4msuerms632ys9",
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

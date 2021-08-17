import { object, string, boolean, InferType, array } from 'yup';

export const decimals: number = 2;
export const denomination: number = 18;

export const network: NetworkType = {
  id: 'testnet',
  name: 'Testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.elrond.com/dapp/init',
  apiAddress: 'https://devnet-api.elrond.com',
  gatewayAddress: 'https://devnet-gateway.elrond.com',
  explorerAddress: 'http://devnet-explorer.elrond.com/',
  multisigDeployerContracts: [ 
    'erd1qqqqqqqqqqqqqpgqmv4ywkst377ngwh0yyaj3kdufwwl04sherms282gz6',
    'erd1qqqqqqqqqqqqqpgqcm2ns0994y9qsuzchl33hu78eklu93syermstt4g4d',
    'erd1qqqqqqqqqqqqqpgq2c6z26r5q046w9jkzrvjxc9fgjwh54zcermsxtn8u5',
  ],
  multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqc3342h2wsjh7xmvxm6ka99peplvclj2serms5at6s2',
};

const networkSchema = object({
  id: string()
    .defined()
    .required(),
  egldLabel: string()
    .defined()
    .required(),
  name: string()
    .defined()
    .required(),
  walletAddress: string(),
  apiAddress: string(),
  gatewayAddress: string(),
  explorerAddress: string(),
  multisigDeployerContracts: array().of(string().defined().required()).defined().required(),
  multisigManagerContract: string(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});
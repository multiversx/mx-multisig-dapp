import { object, string, boolean, InferType, array } from 'yup';

export const decimals: number = 2;
export const denomination: number = 18;

export const networks: NetworkType[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.elrond.com/dapp/init',
    apiAddress: 'https://api.elrond.com',
    gatewayAddress: 'https://gateway.elrond.com',
    explorerAddress: 'http://explorer.elrond.com/',
    multisigDeployerContracts: [ 'erd1qqqqqqqqqqqqqpgqh7hl7t5cy0g4td0mv8hp950qtumnagamermsx0aep5' ],
    multisigManagerContract: 'erd1qqqqqqqqqqqqqpgqh7hl7t5cy0g4td0mv8hp950qtumnagamermsx0aep5',
  },
];

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

networks.forEach(network => {
  networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
import { Address } from '@elrondnetwork/erdjs/out';
import TransactionParameter from 'types/TransactionParameter';

export async function tryParseTransactionParameter(
  apiEndpoint: string
): Promise<TransactionParameter | null> {
  let searchParams = new URLSearchParams(window.location.search);
  let txHash = searchParams.get('txHash');
  if (!txHash || txHash === '') {
    return null;
  }
  let fetchResult = await fetch(`${apiEndpoint}/transactions/${txHash}`);
  let json = await fetchResult.json();

  let inputData = json.data;
  if (!inputData) {
    return null;
  }

  let inputDecoded = atob(inputData);
  let inputParameters = inputDecoded.split('@');
  if (inputParameters.length === 0) {
    return null;
  }

  let functionName = inputParameters[0];

  let scResults = json.scResults;
  if (scResults == null || scResults.length === 0) {
    return null;
  }

  let sender = new Address(json.sender);
  let receiver = new Address(json.receiver);

  let outputData = scResults[0].data;
  let outputDecoded = atob(outputData);

  let outputParameters = outputDecoded.split('@').slice(1);

  return new TransactionParameter(
    sender,
    receiver,
    functionName,
    inputParameters.slice(1),
    outputParameters
  );
}

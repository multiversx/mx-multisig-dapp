import axios from 'axios';
import { network } from '../config';

export const getTokenData = async (identifier: string) => {
  try {
    const response = await axios.get(
      `${network.apiAddress}/tokens/${identifier}`
    );
    const { data } = response;
    return data;
  } catch (err) {
    console.error('Could not get token data.');
    return null;
  }
};

import constants from "../constants";

export const CHAIN_IDS = {
  rinkeby: "4",
  fuji: "43113",
  localhost: "31337",
};

export function isFujiNetwork(): boolean {
  return constants.CHAIN_ID === CHAIN_IDS.fuji;
}

export function isRinkebyNetwork(): boolean {
  return constants.CHAIN_ID === CHAIN_IDS.rinkeby;
}

export function isLocalNetwork(): boolean {
  return constants.CHAIN_ID === CHAIN_IDS.localhost;
}

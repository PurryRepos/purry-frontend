import constants from "../constants";

const CHAIN_IDS = {
  rinkeby: "4",
  localhost: "31337",
};

export function isRinkebyNetwork(): boolean {
  return constants.CHAIN_ID === CHAIN_IDS.rinkeby;
}

export function isLocalNetwork(): boolean {
  return constants.CHAIN_ID === CHAIN_IDS.localhost;
}

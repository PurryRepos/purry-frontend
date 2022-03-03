import getProvider from "./utils/getProvider";

export default async function getSigner() {
  const provider: any = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

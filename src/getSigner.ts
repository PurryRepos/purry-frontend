export default async function getSigner(provider) {
  if (provider.isInfura) {
    return provider;
  } else {
    return await provider.getSigner();
  }
}

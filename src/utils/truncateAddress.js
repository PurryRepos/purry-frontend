export default function truncateAddress(str) {
  return str ? str.slice(0, 5) + "..." + str.slice(-5) : str;
}

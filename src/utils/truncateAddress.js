export default function truncateAddress(str) {
  return str.slice(0, 5) + "..." + str.slice(-5);
}

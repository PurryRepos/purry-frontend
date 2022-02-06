export default function isASCII(str: string): boolean {
  // eslint-disable-next-line
  return /^[\x00-\x7F]*$/.test(str);
}

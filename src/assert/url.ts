export default function isURL(url: string) {
  return url.startsWith('http://localhost') || url.startsWith('https://');
}

export default function getURL(url: string, base?: string): string {
  return (
    base
      ? new URL(url, base)
      : new URL(url)
  ).href;
}

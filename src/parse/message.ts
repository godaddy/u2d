export default function getMessage(message: string, err?: unknown): string {
  if (err instanceof Error) {
    message += `: ${ err.message }`;
  }
  return message;
}

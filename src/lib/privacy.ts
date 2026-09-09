/**
 * Privacy helper utility for masking PII before outputting to logs.
 */

/**
 * Masks an email address for logging and debugging without exposing full PII.
 * Example: 'john.doe@gmail.com' -> 'jo***@gmail.com'
 * Example: 'a@example.com' -> 'a***@example.com'
 */
export function maskEmail(email?: string | null): string {
  if (!email || typeof email !== 'string') {
    return '[anonymous]';
  }

  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex === -1) {
    if (trimmed.length <= 2) {
      return `${trimmed}***`;
    }
    return `${trimmed.slice(0, 2)}***`;
  }

  const user = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex); // includes '@'

  if (user.length <= 2) {
    return `${user}***${domain}`;
  }

  return `${user.slice(0, 2)}***${domain}`;
}

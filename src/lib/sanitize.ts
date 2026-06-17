// Strips HTML tags from user input before it touches any downstream system
export function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

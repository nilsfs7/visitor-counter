import { customAlphabet } from 'nanoid';

/** Length of public project IDs used in counter URLs. */
export const PROJECT_ID_LENGTH = 10;

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = customAlphabet(alphabet, PROJECT_ID_LENGTH);

/** Cryptographically strong, URL-safe short project ID. */
export function createProjectId(): string {
  return generate();
}

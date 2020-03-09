import crypto from 'crypto';

const { ENCRYPTION_KEY } = process.env; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // Always 16 for AES

/**
 * Encrypts provided text
 *
 * @remarks
 * Uses AES-256-ABC encryption
 *
 * @param text - A string to be encrypted
 * @returns Encrypted text
 */
export const encrypt = (text: string): any => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY as string),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypts provided text
 *
 * @remarks
 * Uses AES-256-ABC encryption
 *
 * @param text - A string to be decrypted
 * @returns Decrypted text
 */
export const decrypt = (text: string): any => {
  const textParts: any = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY as string),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
};

'use server'
import crypto from "crypto";

// Function to derive a key from a password using PBKDF2
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}
// Function to generate an IV based on current time
function generateIV() {
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // Get current timestamp in 5-minute intervals
    const iv = Buffer.alloc(16); // Create a buffer for IV
    iv.writeUInt32BE(timestamp, 0); // Write the timestamp as a 32-bit big-endian integer to the buffer
    return iv;
  }

const password = process.env.ENCRYPT_PASS; // password
const salt = process.env.NEXT_PUBLIC_SALT; // Salt
// Derive a key from the password and salt
const key = deriveKey(password, salt);
// Generate a random initialization vector (IV)
const iv = generateIV();

// Function to encrypt a string with a key and IV
export async function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log('Encrypted:', encrypted);
  return encrypted;
}

// Function to decrypt a string with a key and IV
export async function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  console.log('Decrypted:', decrypted);
  return decrypted;
}


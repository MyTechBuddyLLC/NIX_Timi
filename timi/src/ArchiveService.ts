import JSZip from 'jszip';
import { sodium } from './sodium';

export class ArchiveService {

  /**
   * Encrypts a Uint8Array (database) with a passphrase and archives it into a zip file.
   * @param dbData The raw database data.
   * @param passphrase The user's passphrase.
   * @returns A Promise resolving to the Uint8Array of the generated zip file.
   */
  async encryptAndArchive(dbData: Uint8Array, passphrase: string): Promise<Uint8Array> {
    const libsodium = await sodium;

    // 1. Derive a key from the passphrase using Argon2id
    const salt = libsodium.randombytes_buf(libsodium.crypto_pwhash_SALTBYTES);
    const key = libsodium.crypto_pwhash(
      libsodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
      passphrase,
      salt,
      libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      libsodium.crypto_pwhash_ALG_DEFAULT
    );

    // 2. Encrypt the data using ChaCha20-Poly1305
    const nonce = libsodium.randombytes_buf(libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = libsodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      null, // No additional data
      dbData,
      null, // No additional data
      nonce,
      key
    );

    // 3. Prepend salt and nonce to the ciphertext for storage
    const encryptedData = new Uint8Array(salt.length + nonce.length + ciphertext.length);
    encryptedData.set(salt);
    encryptedData.set(nonce, salt.length);
    encryptedData.set(ciphertext, salt.length + nonce.length);

    // 4. Create a zip archive
    const zip = new JSZip();
    zip.file('timi.db', encryptedData);

    return await zip.generateAsync({ type: 'uint8array' });
  }

  /**
   * Decrypts a .lca file's content and returns the raw database data.
   * @param lcaData The content of the .lca file as an ArrayBuffer.
   * @param passphrase The user's passphrase.
   * @returns A Promise resolving to the decrypted database data as a Uint8Array.
   */
  async decryptAndOpen(lcaData: ArrayBuffer, passphrase: string): Promise<Uint8Array> {
    const libsodium = await sodium;

    // 1. Open the zip archive
    const zip = await JSZip.loadAsync(lcaData);
    const dbFile = zip.file('timi.db');
    if (!dbFile) {
      throw new Error('Invalid archive: timi.db not found.');
    }
    const encryptedData = await dbFile.async('uint8array');

    // 2. Extract salt, nonce, and ciphertext
    const salt = encryptedData.slice(0, libsodium.crypto_pwhash_SALTBYTES);
    const nonce = encryptedData.slice(
        libsodium.crypto_pwhash_SALTBYTES,
        libsodium.crypto_pwhash_SALTBYTES + libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
    );
    const ciphertext = encryptedData.slice(
        libsodium.crypto_pwhash_SALTBYTES + libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
    );

    // 3. Derive the key from the passphrase and salt
    const key = libsodium.crypto_pwhash(
        libsodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
        passphrase,
        salt,
        libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        libsodium.crypto_pwhash_ALG_DEFAULT
      );

    // 4. Decrypt the data
    const decryptedData = libsodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null, // No additional data
        ciphertext,
        null, // No additional data
        nonce,
        key
      );

    return decryptedData;
  }
}

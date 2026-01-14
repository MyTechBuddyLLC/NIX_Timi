import JSZip from 'jszip';
import { sodium } from './sodium';
import { RatatoskrHeader } from './RatatoskrHeader';

export class ArchiveService {

  /**
   * Encrypts a Uint8Array (database) with a passphrase and archives it into a zip file,
   * then prepends the Ratatoskr header.
   * @param dbData The raw database data.
   * @param passphrase The user's passphrase.
   * @returns A Promise resolving to the Uint8Array of the generated .lca file.
   */
  async encryptAndArchive(dbData: Uint8Array, passphrase: string): Promise<Uint8Array> {
    const libsodium = await sodium;

    // KDF Parameters
    const memCost = 65536; // 64MB
    const iterations = 3;
    const parallelism = 1;

    // 1. Derive a key from the passphrase using Argon2id
    const salt = libsodium.randombytes_buf(libsodium.crypto_pwhash_SALTBYTES);
    const key = libsodium.crypto_pwhash(
      libsodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
      passphrase,
      salt,
      iterations,
      memCost,
      libsodium.crypto_pwhash_ALG_DEFAULT
    );

    // 2. Encrypt the database using ChaCha20-Poly1305
    const nonce = libsodium.randombytes_buf(libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = libsodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      null,
      dbData,
      null,
      nonce,
      key
    );

    // 3. Prepend salt and nonce to the ciphertext
    const encryptedDb = new Uint8Array(salt.length + nonce.length + ciphertext.length);
    encryptedDb.set(salt);
    encryptedDb.set(nonce, salt.length);
    encryptedDb.set(ciphertext, salt.length + nonce.length);

    // 4. Create the zip archive containing the encrypted database
    const zip = new JSZip();
    zip.file('timi.db', encryptedDb);
    const encryptedZip = await zip.generateAsync({ type: 'uint8array' });

    // 5. Create the Ratatoskr header
    const header = RatatoskrHeader.create(memCost, iterations, parallelism);
    const headerBytes = new Uint8Array(header.getRawBuffer());

    // 6. Prepend the header to the encrypted zip data
    const lcaFile = new Uint8Array(headerBytes.length + encryptedZip.length);
    lcaFile.set(headerBytes);
    lcaFile.set(encryptedZip, headerBytes.length);

    return lcaFile;
  }

  /**
   * Decrypts a .lca file's content and returns the raw database data.
   * @param lcaData The content of the .lca file as an ArrayBuffer.
   * @param passphrase The user's passphrase.
   * @returns A Promise resolving to the decrypted database data as a Uint8Array.
   */
  async decryptAndOpen(lcaData: ArrayBuffer, passphrase: string): Promise<Uint8Array> {
    const libsodium = await sodium;

    // 1. Parse the Ratatoskr header
    const headerBuffer = lcaData.slice(0, 64);
    const header = RatatoskrHeader.parse(headerBuffer);
    const { memCost, iterations } = header.getKDFParameters();

    // 2. Extract the encrypted zip data
    const encryptedZip = lcaData.slice(64);

    // 3. Open the zip archive
    const zip = await JSZip.loadAsync(encryptedZip);
    const dbFile = zip.file('timi.db');
    if (!dbFile) {
      throw new Error('Invalid archive: timi.db not found.');
    }
    const encryptedDb = await dbFile.async('uint8array');

    // 4. Extract salt, nonce, and ciphertext from the db file
    const salt = encryptedDb.slice(0, libsodium.crypto_pwhash_SALTBYTES);
    const nonce = encryptedDb.slice(
        libsodium.crypto_pwhash_SALTBYTES,
        libsodium.crypto_pwhash_SALTBYTES + libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
    );
    const ciphertext = encryptedDb.slice(
        libsodium.crypto_pwhash_SALTBYTES + libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES
    );

    // 5. Derive the key from the passphrase and salt using header parameters
    const key = libsodium.crypto_pwhash(
        libsodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES,
        passphrase,
        salt,
        iterations,
        memCost,
        libsodium.crypto_pwhash_ALG_DEFAULT
      );

    // 6. Decrypt the data
    const decryptedData = libsodium.crypto_aead_chacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        null,
        nonce,
        key
      );

    return decryptedData;
  }
}

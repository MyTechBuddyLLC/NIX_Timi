// src/SyncService.ts
import { sodium } from './sodium';

// Interfaces for the sync configuration objects
export interface RatatoskrMasterConfig {
  version: number;
  files: { uuid: string; name: string }[];
}

export interface RatatoskrFileConfig {
  uuid: string;
  name: string;
  // In a real implementation, this would contain sync metadata
  // e.g., lastModified, etag, etc.
}

export class SyncService {
  private masterKey: Uint8Array | null = null;

  /**
   * Sets the master key derived from the user's passphrase.
   * This key must be set before any encryption/decryption can occur.
   */
  public setMasterKey(key: Uint8Array): void {
    this.masterKey = key;
  }

  /**
   * Generates and encrypts the master configuration object.
   */
  public async createEncryptedMasterConfig(files: { uuid: string; name: string }[]): Promise<Uint8Array> {
    if (!this.masterKey) {
      throw new Error("Master key not set. Cannot encrypt sync config.");
    }

    const masterConfig: RatatoskrMasterConfig = {
      version: 1,
      files: files,
    };

    const configString = JSON.stringify(masterConfig);
    return this.encrypt(configString);
  }

  /**
   * Generates and encrypts a file-specific configuration object.
   */
  public async createEncryptedFileConfig(uuid: string, name: string): Promise<Uint8Array> {
    if (!this.masterKey) {
      throw new Error("Master key not set. Cannot encrypt sync config.");
    }

    const fileConfig: RatatoskrFileConfig = {
      uuid,
      name,
    };

    const configString = JSON.stringify(fileConfig);
    return this.encrypt(configString);
  }

  /**
   * Encrypts a string payload using the master key.
   */
  private async encrypt(payload: string): Promise<Uint8Array> {
    if (!this.masterKey) throw new Error("Master key not set.");

    const libsodium = await sodium;
    const nonce = libsodium.randombytes_buf(libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const payloadBytes = new TextEncoder().encode(payload);

    const ciphertext = libsodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      null,
      payloadBytes,
      null,
      nonce,
      this.masterKey
    );

    // Prepend nonce to ciphertext for storage
    const encryptedPayload = new Uint8Array(nonce.length + ciphertext.length);
    encryptedPayload.set(nonce);
    encryptedPayload.set(ciphertext, nonce.length);

    return encryptedPayload;
  }

  /**
   * Decrypts a payload using the master key.
   */
  public async decrypt(encryptedPayload: Uint8Array): Promise<string> {
    if (!this.masterKey) throw new Error("Master key not set.");

    const libsodium = await sodium;
    const nonce = encryptedPayload.slice(0, libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = encryptedPayload.slice(libsodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);

    const decryptedBytes = libsodium.crypto_aead_chacha20poly1305_ietf_decrypt(
      null,
      ciphertext,
      null,
      nonce,
      this.masterKey
    );

    return new TextDecoder().decode(decryptedBytes);
  }
}

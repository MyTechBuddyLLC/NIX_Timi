// ArchiveService.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { ArchiveService } from './ArchiveService';
import { StorageManager } from './StorageManager';
import initSqlJs from 'sql.js';
import path from 'path';

describe('ArchiveService Round-trip Test', () => {
  let storageManager: StorageManager;
  let archiveService: ArchiveService;
  let originalDbContents: Uint8Array | null;

  beforeAll(async () => {
    const locateFile = (file: string) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file);
    storageManager = new StorageManager();
    await storageManager.initializeDB(locateFile);
    archiveService = new ArchiveService();

    // As a baseline, export the initial, clean DB state
    originalDbContents = storageManager.exportDB();
  });

  it('should successfully encrypt and decrypt the database, restoring it to its original state', async () => {
    expect(originalDbContents).not.toBeNull();
    if (!originalDbContents) return;

    const passphrase = 'strong-password-for-testing';

    // 1. Encrypt and Archive
    const lcaArchive = await archiveService.encryptAndArchive(originalDbContents, passphrase);
    expect(lcaArchive).toBeInstanceOf(Uint8Array);
    expect(lcaArchive.length).toBeGreaterThan(0);

    // 2. Decrypt and Open
    const decryptedDbContents = await archiveService.decryptAndOpen(lcaArchive.buffer, passphrase);
    expect(decryptedDbContents).toBeInstanceOf(Uint8Array);

    // 3. Verify Integrity
    // The decrypted data should be identical to the original
    expect(decryptedDbContents).toEqual(originalDbContents);

    // 4. Bonus Verification: Load the decrypted data back into a new SQL.js database and check a table
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    const db = new SQL.Database(decryptedDbContents);

    // Check if our SYS_TABLES metadata was correctly restored
    const res = db.exec("SELECT TBL_NM FROM SYS_TABLES WHERE ID = 1");
    expect(res[0].values[0][0]).toBe('SYS_TABLES');
  });

  it('should fail to decrypt with an incorrect passphrase', async () => {
    expect(originalDbContents).not.toBeNull();
    if (!originalDbContents) return;

    const correctPassphrase = 'strong-password-for-testing';
    const wrongPassphrase = 'wrong-password';

    // Encrypt with the correct passphrase
    const lcaArchive = await archiveService.encryptAndArchive(originalDbContents, correctPassphrase);

    // Attempt to decrypt with the wrong passphrase and expect it to fail
    await expect(
      archiveService.decryptAndOpen(lcaArchive.buffer, wrongPassphrase)
    ).rejects.toThrow();
  });
});

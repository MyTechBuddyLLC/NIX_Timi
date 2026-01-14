// src/RatatoskrHeader.ts
import { v4 as uuidv4 } from 'uuid';

const HEADER_SIZE = 64;
const MAGIC_STRING = 'RATATOSKR_01'; // 12 bytes

// Define the structure of the header for clarity
const OFFSET = {
  MAGIC_STRING: 0,  // 12 bytes
  UUID: 12,           // 16 bytes
  CIPHER_FLAG: 28,    // 1 byte
  // KDF parameters will be stored in the reserved space
  ARGON_MEM_COST: 29, // 4 bytes (Uint32)
  ARGON_ITERATIONS: 33, // 4 bytes (Uint32)
  ARGON_PARALLELISM: 37, // 1 byte (Uint8)
  RESERVED: 38,       // 26 bytes
};

export class RatatoskrHeader {
  private buffer: ArrayBuffer;
  private view: DataView;

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      if (buffer.byteLength !== HEADER_SIZE) {
        throw new Error(`Invalid header size. Expected ${HEADER_SIZE} bytes.`);
      }
      this.buffer = buffer;
    } else {
      this.buffer = new ArrayBuffer(HEADER_SIZE);
    }
    this.view = new DataView(this.buffer);
  }

  /**
   * Creates a new header with default values.
   */
  public static create(
    memCost: number,
    iterations: number,
    parallelism: number
  ): RatatoskrHeader {
    const header = new RatatoskrHeader();
    header.setMagicString();
    header.setUUID(uuidv4());
    header.setCipherFlag(1); // 1 for ChaCha20-Poly1305
    header.setKDFParameters(memCost, iterations, parallelism);
    return header;
  }

  /**
   * Parses an existing ArrayBuffer into a header object.
   */
  public static parse(buffer: ArrayBuffer): RatatoskrHeader {
    const header = new RatatoskrHeader(buffer);
    if (!header.isValid()) {
        throw new Error('Invalid or corrupt header: Magic string mismatch.');
    }
    return header;
  }

  public getRawBuffer(): ArrayBuffer {
    return this.buffer;
  }

  public isValid(): boolean {
    return this.getMagicString() === MAGIC_STRING;
  }

  // --- Getters ---
  public getMagicString(): string {
    const bytes = new Uint8Array(this.buffer, OFFSET.MAGIC_STRING, MAGIC_STRING.length);
    return new TextDecoder().decode(bytes);
  }

  public getUUID(): string {
    const bytes = new Uint8Array(this.buffer, OFFSET.UUID, 16);
    return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public getCipherFlag(): number {
    return this.view.getUint8(OFFSET.CIPHER_FLAG);
  }

  public getKDFParameters(): { memCost: number; iterations: number; parallelism: number } {
    return {
      memCost: this.view.getUint32(OFFSET.ARGON_MEM_COST, true), // Little-endian
      iterations: this.view.getUint32(OFFSET.ARGON_ITERATIONS, true), // Little-endian
      parallelism: this.view.getUint8(OFFSET.ARGON_PARALLELISM),
    };
  }

  // --- Setters ---
  private setMagicString(): void {
    const bytes = new TextEncoder().encode(MAGIC_STRING);
    new Uint8Array(this.buffer).set(bytes, OFFSET.MAGIC_STRING);
  }

  private setUUID(uuid: string): void {
    const uuidBytes = uuid.split('-').join('').match(/.{1,2}/g)!.map(byte => parseInt(byte, 16));
    new Uint8Array(this.buffer).set(uuidBytes, OFFSET.UUID);
  }

  private setCipherFlag(flag: number): void {
    this.view.setUint8(OFFSET.CIPHER_FLAG, flag);
  }

  private setKDFParameters(memCost: number, iterations: number, parallelism: number): void {
    this.view.setUint32(OFFSET.ARGON_MEM_COST, memCost, true); // Little-endian
    this.view.setUint32(OFFSET.ARGON_ITERATIONS, iterations, true); // Little-endian
    this.view.setUint8(OFFSET.ARGON_PARALLELISM, parallelism);
  }
}

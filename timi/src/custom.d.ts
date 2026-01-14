// timi/src/custom.d.ts

declare module 'sql.js' {
  export interface Database {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec(sql: string): any[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export interface Statement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run(params?: any[] | object): void;
    free(): void;
  }

  export interface SqlJsStatic {
    Database: {
      new (data?: Uint8Array | null): Database;
    };
  }

  const initSqlJs: (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;
  export default initSqlJs;
}

declare module 'libsodium-wrappers' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sodium: any;
    export default sodium;
}

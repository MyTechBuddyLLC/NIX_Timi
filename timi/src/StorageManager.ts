import initSqlJs, { type LocateFile } from 'sql.js';

// Define the database schema as a series of SQL statements
const SCHEMA = `
-- System Metadata Tables
CREATE TABLE SYS_TABLES (
    ID INTEGER PRIMARY KEY NOT NULL,
    TBL_NM TEXT NOT NULL,
    DSPLY_NM TEXT NOT NULL,
    TBL_DSC TEXT NOT NULL
);

CREATE TABLE SYS_COLUMNS (
    ID INTEGER PRIMARY KEY NOT NULL,
    TBL_ID INTEGER NOT NULL,
    DATA_TYP TEXT NOT NULL,
    IS_NLLBL INTEGER NOT NULL,
    COL_NM TEXT NOT NULL,
    DSPLY_NM TEXT NOT NULL,
    COL_DSC TEXT NOT NULL,
    FOREIGN KEY (TBL_ID) REFERENCES SYS_TABLES(ID)
);

-- Domain Tables
CREATE TABLE DM_RFC_5545_RCRRNC_RL (
    ID INTEGER PRIMARY KEY NOT NULL,
    NM TEXT NOT NULL,
    RL_TXT TEXT
);

CREATE TABLE DM_DSPLY_CNFG (
    ID INTEGER PRIMARY KEY NOT NULL,
    NM TEXT NOT NULL,
    CNFG_JSON TEXT NOT NULL
);

CREATE TABLE DM_IMG (
    ID INTEGER PRIMARY KEY NOT NULL,
    FL_NM TEXT NOT NULL
);

-- Core Logic Tables
CREATE TABLE EVNT (
    EVNT_ID INTEGER PRIMARY KEY NOT NULL,
    RFC_5545_RCRRNC_RL_ID INTEGER NOT NULL,
    STR_DT TEXT NOT NULL CHECK(STR_DT IS strftime('%Y-%m-%dT%H:%M:%SZ', STR_DT)),
    END_DT TEXT NOT NULL CHECK(END_DT IS strftime('%Y-%m-%dT%H:%M:%SZ', END_DT)),
    DSPLY_TXT TEXT NOT NULL,
    EVNT_DSC TEXT NOT NULL,
    LGCY_RFRNC_TXT TEXT,
    FOREIGN KEY (RFC_5545_RCRRNC_RL_ID) REFERENCES DM_RFC_5545_RCRRNC_RL(ID)
);

CREATE TABLE DSPLY_RL (
    ID INTEGER PRIMARY KEY NOT NULL,
    EVNT_ID INTEGER NOT NULL,
    RL_PRRTY_NUM INTEGER NOT NULL,
    DSPLY_CNFG_ID INTEGER NOT NULL,
    DSPLY_IMG_ID INTEGER NOT NULL,
    RFC_5545_RCRRNC_RL_ID INTEGER NOT NULL,
    MTCH_CNFG_TXT TEXT NOT NULL,
    FOREIGN KEY (EVNT_ID) REFERENCES EVNT(EVNT_ID),
    FOREIGN KEY (DSPLY_CNFG_ID) REFERENCES DM_DSPLY_CNFG(ID),
    FOREIGN KEY (DSPLY_IMG_ID) REFERENCES DM_IMG(ID),
    FOREIGN KEY (RFC_5545_RCRRNC_RL_ID) REFERENCES DM_RFC_5545_RCRRNC_RL(ID)
);
`;

const METADATA_SYS_TABLES = {
  id: 1,
  name: 'SYS_TABLES',
  displayName: 'System Tables',
  description: 'A metadata table containing information about all tables in the database.',
  columns: [
    { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
    { name: 'TBL_NM', displayName: 'Table Name', description: 'The physical name of the table.', type: 'TEXT', isNullable: 0 },
    { name: 'DSPLY_NM', displayName: 'Display Name', description: 'The human-readable name for the table.', type: 'TEXT', isNullable: 0 },
    { name: 'TBL_DSC', displayName: 'Table Description', description: 'A description of the table\'s purpose.', type: 'TEXT', isNullable: 0 },
  ],
};

const METADATA_SYS_COLUMNS = {
    id: 2,
    name: 'SYS_COLUMNS',
    displayName: 'System Columns',
    description: 'A metadata table containing information about all columns in the database.',
    columns: [
        { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'TBL_ID', displayName: 'Table ID', description: 'Foreign key to SYS_TABLES.ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'DATA_TYP', displayName: 'Data Type', description: 'The SQLite data type.', type: 'TEXT', isNullable: 0 },
        { name: 'IS_NLLBL', displayName: 'Is Nullable', description: '1 if nullable, 0 if not.', type: 'INTEGER', isNullable: 0 },
        { name: 'COL_NM', displayName: 'Column Name', description: 'The physical name of the column.', type: 'TEXT', isNullable: 0 },
        { name: 'DSPLY_NM', displayName: 'Display Name', description: 'The human-readable name for the column.', type: 'TEXT', isNullable: 0 },
        { name: 'COL_DSC', displayName: 'Column Description', description: 'A description of the column\'s purpose.', type: 'TEXT', isNullable: 0 },
    ],
};

const METADATA_DM_RFC_5545_RCRRNC_RL = {
    id: 3,
    name: 'DM_RFC_5545_RCRRNC_RL',
    displayName: 'Domain: Recurrence Rules',
    description: 'Domain table for RFC 5545 recurrence rules.',
    columns: [
        { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'NM', displayName: 'Name', description: 'Name of the rule (e.g., "None (Single Event)").', type: 'TEXT', isNullable: 0 },
        { name: 'RL_TXT', displayName: 'Rule Text', description: 'The RFC 5545 string. NULL for the "None" entry.', type: 'TEXT', isNullable: 1 },
    ],
};

const METADATA_DM_DSPLY_CNFG = {
    id: 4,
    name: 'DM_DSPLY_CNFG',
    displayName: 'Domain: Display Configurations',
    description: 'Domain table for display styles.',
    columns: [
        { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'NM', displayName: 'Name', description: 'Name of the style (e.g., "Smart Overlay").', type: 'TEXT', isNullable: 0 },
        { name: 'CNFG_JSON', displayName: 'Configuration JSON', description: 'The JSON object with CSS/layout info.', type: 'TEXT', isNullable: 0 },
    ],
};

const METADATA_DM_IMG = {
    id: 5,
    name: 'DM_IMG',
    displayName: 'Domain: Images',
    description: 'Domain table for images.',
    columns: [
        { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'FL_NM', displayName: 'File Name', description: 'Filename in /assets/.', type: 'TEXT', isNullable: 0 },
    ],
};

const METADATA_EVNT = {
    id: 6,
    name: 'EVNT',
    displayName: 'Event',
    description: 'Core event table.',
    columns: [
        { name: 'EVNT_ID', displayName: 'Event ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'RFC_5545_RCRRNC_RL_ID', displayName: 'Recurrence Rule ID', description: 'Foreign key to DM_RFC...ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'STR_DT', displayName: 'Start Date', description: 'Start date/time (ISO 8601).', type: 'TEXT', isNullable: 0 },
        { name: 'END_DT', displayName: 'End Date', description: 'End date/time (ISO 8601).', type: 'TEXT', isNullable: 0 },
        { name: 'DSPLY_TXT', displayName: 'Display Text', description: 'The default title or display text for the event.', type: 'TEXT', isNullable: 0 },
        { name: 'EVNT_DSC', displayName: 'Event Description', description: 'A longer, more detailed description of the event.', type: 'TEXT', isNullable: 0 },
        { name: 'LGCY_RFRNC_TXT', displayName: 'Legacy Reference Text', description: 'Optional ID from an external system.', type: 'TEXT', isNullable: 1 },
    ],
};

const METADATA_DSPLY_RL = {
    id: 7,
    name: 'DSPLY_RL',
    displayName: 'Display Rule',
    description: 'Display rules for events.',
    columns: [
        { name: 'ID', displayName: 'ID', description: 'Primary key.', type: 'INTEGER', isNullable: 0 },
        { name: 'EVNT_ID', displayName: 'Event ID', description: 'Foreign key to EVNT.EVNT_ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'RL_PRRTY_NUM', displayName: 'Rule Priority Number', description: 'Rule priority (1 is highest). Resolves date conflicts.', type: 'INTEGER', isNullable: 0 },
        { name: 'DSPLY_CNFG_ID', displayName: 'Display Config ID', description: 'Foreign key to DM_DSPLY_CNFG.ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'DSPLY_IMG_ID', displayName: 'Display Image ID', description: 'Foreign key to DM_IMG.ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'RFC_5545_RCRRNC_RL_ID', displayName: 'Recurrence Rule ID', description: 'Foreign key to DM_RFC...ID.', type: 'INTEGER', isNullable: 0 },
        { name: 'MTCH_CNFG_TXT', displayName: 'Match Config Text', description: 'Specific date match, e.g., "11-12" for Nov 12th.', type: 'TEXT', isNullable: 0 },
    ],
};

const ALL_TABLE_METADATA = [
    METADATA_SYS_TABLES,
    METADATA_SYS_COLUMNS,
    METADATA_DM_RFC_5545_RCRRNC_RL,
    METADATA_DM_DSPLY_CNFG,
    METADATA_DM_IMG,
    METADATA_EVNT,
    METADATA_DSPLY_RL,
];

export class StorageManager {
  private db: initSqlJs.Database | null = null;

  async initializeDB(locateFile?: LocateFile): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: locateFile || (file => `https://sql.js.org/dist/${file}`)
    });
    this.db = new SQL.Database();
    this.db.exec(SCHEMA);
    this.populateMetadata();
  }

  private populateMetadata(): void {
    if (!this.db) {
      throw new Error("Database not initialized.");
    }

    const insertTableStmt = this.db.prepare("INSERT INTO SYS_TABLES (ID, TBL_NM, DSPLY_NM, TBL_DSC) VALUES (?, ?, ?, ?)");
    const insertColumnStmt = this.db.prepare("INSERT INTO SYS_COLUMNS (TBL_ID, DATA_TYP, IS_NLLBL, COL_NM, DSPLY_NM, COL_DSC) VALUES (?, ?, ?, ?, ?, ?)");

    for (const table of ALL_TABLE_METADATA) {
        insertTableStmt.run([table.id, table.name, table.displayName, table.description]);
        for (const column of table.columns) {
            insertColumnStmt.run([table.id, column.type, column.isNullable, column.name, column.displayName, column.description]);
        }
    }

    insertTableStmt.free();
    insertColumnStmt.free();
  }

  // Method to export the database to a Uint8Array
  exportDB(): Uint8Array | null {
    if (!this.db) {
        throw new Error("Database not initialized.");
    }
    return this.db.export();
  }
}

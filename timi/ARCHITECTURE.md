# Tími: Architecture

This document provides a detailed technical overview of the Tími application architecture. It is intended for developers, contributors, and anyone interested in the project's internal design.

---

## 1. The `.lca` (Local Calendar Archive) Format

The core of Tími's local-first philosophy is the `.lca` file. It is a custom binary file format composed of a 64-byte header followed by an encrypted ZIP archive.

### Structure: `<Header> + <Encrypted ZIP Data>`

*   **Ratatoskr Header (64 bytes):** A fixed-size binary header that provides metadata about the file.
*   **Encrypted ZIP Data:** The remainder of the file is a standard ZIP archive that has been encrypted.

### The 'Ratatoskr' Binary Header (64-byte)

The header provides essential metadata for decryption and identification.

| Offset (Bytes) | Size | Field | Description |
| :--- | :--- | :--- | :--- |
| `0-11` | 12 | Magic String | `RATATOSKR_01` to identify the file type. |
| `12-27` | 16 | File UUID | A unique identifier for the file. |
| `28` | 1 | Cipher Flag | `0` for AES-GCM, `1` for ChaCha20-Poly1305. |
| `29-32` | 4 | Argon2id `memCost`| The memory cost parameter for key derivation. |
| `33-36` | 4 | Argon2id `iterations`| The iteration count for key derivation. |
| `37` | 1 | Argon2id `parallelism`| The parallelism factor for key derivation. |
| `38-63` | 26 | Reserved | Reserved for future use. |


### The Encrypted ZIP Archive

The archive contains the user's data in a structured format:

```
(Encrypted ZIP Archive)
|
+-- /timi.db
|
+-- /assets/
    |
    +-- image1.jpg
```

*   **/timi.db:** The SQLite database, which is itself encrypted with a salt and nonce before being placed in the zip.
*   **/assets/:** A directory for all binary assets (images, etc.).

### Encryption & Key Derivation

*   **Algorithm:** The archive is encrypted using the **ChaCha20-Poly1305** stream cipher, as indicated by the header flag.
*   **Hardened Key Derivation:** The master encryption key is derived from the user's passphrase using **Argon2id** with the parameters specified in the file header. This ensures the key can be recreated on any device.
*   **Implementation:** All cryptographic operations are handled by the `libsodium-wrappers` library.

---
## 2. Generic Sync Logic

To prepare for future cross-device synchronization, Tími includes a `SyncService` designed to produce encrypted configuration objects. This logic is platform-agnostic.

*   **`RATATOSKR_MASTER_CONFIG`:** An encrypted JSON object containing a list of all known `.lca` file UUIDs and their names.
*   **`RATATOSKR_[UUID]`:** A separate encrypted JSON object for each file, intended to hold file-specific sync metadata (e.g., last modified timestamp).

These objects are encrypted with the same Argon2id-derived master key, making them safe for storage in a generic key-value store like `chrome.storage.sync` or a private server.

---

## 2. Database Schema

The Tími database is a relational SQLite database composed of 12 tables: 2 for system metadata, 5 for domain data, and 5 for core application logic.

### Rationale for Integer IDs

The primary key for events (`EVNT.EVNT_ID`) is an `INTEGER`. While UUIDs are common in distributed systems, Tími's local-first nature makes sequential integers a simpler and more performant choice. This design assumes a single-user context where the likelihood of merging two distinct archives is a secondary concern to core application performance and simplicity.

### Application Logic

#### 5-Tier Styling Priority
When rendering an event, the application applies styling rules in a specific, descending order of priority. The first rule found is the one that is applied.
1.  **Daily Rule (`DSPLY_RL`):** The most specific override for a single event on a single day.
2.  **Group-Event Link Rule (`X_GRP_EVNT`):** A style applied to a specific event only when it appears as part of a specific group.
3.  **Group Rule (`GRP`):** A style applied to all events within a group.
4.  **Category Rule (`DM_EVNT_CTGRY`):** The event's default, intrinsic style (e.g., all "Birthdays" are italics).
5.  **App Default:** A fallback style if no other rules are defined.

#### Multi-Level Sorting Logic
When displaying events for a given day, they are sorted by three criteria in order:
1.  **Primary Sort:** By the `SRT_ORDR_NUM` of the Group (`GRP`).
2.  **Secondary Sort:** By the `SRT_ORDR_NUM` on the Event-Group link (`X_GRP_EVNT`).
3.  **Tertiary Sort:** By the event's start time (`EVNT.STR_DT`).

### Schema Diagram (Conceptual)

```mermaid
erDiagram
    GRP {
        INTEGER ID PK
        TEXT NM UNIQUE
        TEXT DSC
        INTEGER SRT_ORDR_NUM
        INTEGER DSPLY_CNFG_ID FK
        INTEGER DFLT_PRINT_CNFG_ID FK
        INTEGER DFLT_ICS_CNFG_ID FK
    }
    EVNT {
        INTEGER EVNT_ID PK
        INTEGER EVNT_CTGRY_ID FK
        INTEGER RFC_5545_RCRRNC_RL_ID FK
        TEXT STR_DT
        TEXT END_DT
        TEXT DSPLY_TXT
        TEXT EVNT_DSC
        TEXT LGCY_RFRNC_TXT
    }
    DM_EVNT_CTGRY {
        INTEGER ID PK
        TEXT NM UNIQUE
        INTEGER DSPLY_CNFG_ID FK
    }
    X_GRP_EVNT {
        INTEGER ID PK
        INTEGER GRP_ID FK
        INTEGER EVNT_ID FK
        INTEGER SRT_ORDR_NUM
        INTEGER DSPLY_CNFG_ID FK
    }
    X_GRP_GRP {
        INTEGER ID PK
        INTEGER PRNT_GRP_ID FK
        INTEGER GRP_ID FK
        INTEGER SRT_ORDR_NUM
        INTEGER DSPLY_CNFG_ID FK
    }
    OTPT_CNFG {
        INTEGER ID PK
        TEXT NM UNIQUE
        TEXT TRGT_TYP
        TEXT CNFG_JSON
    }
    DSPLY_RL {
        INTEGER ID PK
        INTEGER EVNT_ID FK
        INTEGER DSPLY_CNFG_ID FK
    }
    DM_DSPLY_CNFG {
        INTEGER ID PK
        TEXT NM
        TEXT CNFG_JSON
    }

    GRP ||--|{ X_GRP_EVNT : "contains event"
    GRP ||--o{ X_GRP_GRP : "is parent of"
    GRP }|--o{ X_GRP_GRP : "is child of"
    GRP ||--o{ OTPT_CNFG : "has default print config"
    GRP ||--o{ OTPT_CNFG : "has default ics config"
    EVNT ||--|{ X_GRP_EVNT : "is in group"
    EVNT ||--|{ DSPLY_RL : "has display rule"
    DM_EVNT_CTGRY ||--o{ EVNT : "categorizes"
    DM_DSPLY_CNFG ||--o{ DM_EVNT_CTGRY : "defines style for"
    DM_DSPLY_CNFG ||--o{ GRP : "defines style for"
    DM_DSPLY_CNFG ||--o{ X_GRP_EVNT : "defines style for"
    DM_DSPLY_CNFG ||--o{ X_GRP_GRP : "defines style for"
    DM_DSPLY_CNFG ||--o{ DSPLY_RL : "defines style for"
```

### Table Definitions

*(The full table definitions with column descriptions are managed programmatically and can be queried directly from the `SYS_TABLES` and `SYS_COLUMNS` tables within the application.)*

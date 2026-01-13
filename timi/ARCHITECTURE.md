# Tími: Architecture

This document provides a detailed technical overview of the Tími application architecture. It is intended for developers, contributors, and anyone interested in the project's internal design.

---

## 1. The `.lca` (Local Calendar Archive) Format

The core of Tími's local-first philosophy is the `.lca` file. It is a standard ZIP archive with a proprietary extension to associate it with the Tími application.

### Structure

An `.lca` file has a simple and transparent structure:

```
my-calendar.lca (A standard ZIP archive)
|
+-- /timi.db
|
+-- /assets/
    |
    +-- image1.jpg
    +-- event-icon.png
```

*   **/timi.db:** This is the primary database file. It is a standard SQLite 3 database containing all calendar data. Before being added to the archive, this file is encrypted.
*   **/assets/:** A directory containing all binary assets, such as images, associated with calendar events. These files are stored directly without additional encryption, as the entire archive is protected.

### Encryption

*   **Algorithm:** The `/timi.db` file is encrypted using the **ChaCha20-Poly1305** stream cipher, a modern, secure, and open-source algorithm.
*   **Key Derivation:** The encryption key is derived from the user's passphrase using the **Argon2id** algorithm, a strong, memory-hard key derivation function that is highly resistant to brute-force attacks.
*   **Implementation:** All cryptographic operations are handled by the `libsodium-wrappers` library, a WebAssembly-powered and highly respected implementation of the libsodium library.

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

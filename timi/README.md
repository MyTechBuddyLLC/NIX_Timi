# Tími
### *Your Time, Your Data.*

**Tími** (from the Old Norse for "Time") is a local-first, privacy-centric personal calendar architect. It is designed for individuals who believe in data sovereignty and want a beautiful, powerful tool to manage their most valuable asset: their time.

Unlike cloud-based calendars that harvest your data, Tími operates on a simple, transparent principle: **you own your data, full stop.**

---

### Core Philosophy

*   **Local-First:** Your calendar data lives on your machine in a single, portable file. No servers, no clouds, no tracking.
*   **Data Sovereignty:** Tími uses a proprietary, yet fully documented, `.lca` (Local Calendar Archive) format. It's just a ZIP file containing a standard SQLite database and your assets, encrypted with a modern, open-source cipher.
*   **Privacy-Centric:** Your `.lca` archive is locked with a passphrase using ChaCha20-Poly1305 encryption. Without your passphrase, the file is unreadable.
*   **Built for Power Users:** Tími is designed to be a "calendar architect," allowing you to craft detailed, visually rich calendars with complex recurrence rules and display logic.

---

### Features (MVP)

*   **Portable `.lca` Archive:** A single, encrypted file (`.lca`) that contains your entire calendar. Move it, back it up, or share it as you see fit.
*   **Robust SQLite Backend:** All data is stored in a structured, well-documented SQLite database.
*   **"Norse Industrial" Aesthetic:** A clean, functional, and rugged UI designed for clarity and focus.
*   **WYSIWYG Display:** What you see on screen is what you get when you print.
*   **Flexible Display Rules:** Control the appearance of events based on specific dates or complex recurrence rules.

---

### Getting Started

*(This section will be updated as the application matures)*

1.  Download the latest release of Tími.
2.  Launch the application.
3.  Create a new `.lca` archive or open an existing one.
4.  Begin architecting your time.

---

### Contributing

Tími is a free and open-source software project. We welcome contributions from the community. Please see `ARCHITECTURE.md` for a detailed technical overview.

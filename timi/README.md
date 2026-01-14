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

*   **Portable `.lca` Archive:** A formal binary file format with a 64-byte header for metadata and an encrypted ZIP archive for data.
*   **Hardened Security:** Implements Argon2id for key derivation with configurable parameters, ensuring robust protection for your data.
*   **Mobile-First Responsive UI:** A clean and functional interface that works seamlessly on both mobile (bottom navigation) and desktop (sidebar) screens.
*   **Automatic Update Notifications:** The app will automatically check for new versions and notify you to refresh for the latest security updates and features.
*   **Flexible Display Rules & Grouping:** A sophisticated 12-table database schema allows for complex event grouping, nested groups, and a powerful 5-tier styling system.

---

### Getting Started

*(This section will be updated as the application matures)*

1.  Download the latest release of Tími.
2.  Launch the application.
3.  Create a new `.lca` archive or open an existing one.
4.  Begin architecting your time.

---

### Deployment

Tími is a Vite-based Single Page Application (SPA) located within the `/timi` subdirectory of this repository.

#### Cloudflare Pages

1.  In your Cloudflare dashboard, go to **Settings > Builds & deployments**.
2.  Set the **Root directory** to `timi`.
3.  Set the **Build command** to `npm run build`.
4.  Set the **Build output directory** to `dist`.

A `public/_redirects` file is included in the project, which correctly handles SPA routing for Cloudflare Pages.

---

### Contributing

Tími is a free and open-source software project. We welcome contributions from the community. Please see `ARCHITECTURE.md` for a detailed technical overview.

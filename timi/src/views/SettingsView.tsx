// src/views/SettingsView.tsx
import React from 'react';
import './SettingsView.css';

const SettingsView: React.FC = () => {
  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <h1>SysCfg / Vault</h1>
      </div>
      
      <div className="settings-section">
        <h2 className="section-title">Cryptographic Archive</h2>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">.lca File Location</span>
            <span className="setting-desc">The path where your encrypted calendar vault is mounted.</span>
          </div>
          <button style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-color-main)', fontWeight: 700 }}>Export Vault</button>
        </div>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">Update Passphrase</span>
            <span className="setting-desc">Re-encrypt the vault with a new master key (ChaCha20-Poly1305).</span>
          </div>
          <button>Change Password</button>
        </div>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">Argon2id Iterations</span>
            <span className="setting-desc">Higher iterations increase protection against brute force attacks.</span>
          </div>
          <input type="number" className="settings-input" defaultValue="3" min="1" max="10" />
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Application Preferences</h2>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">Auto-Lock Vault</span>
            <span className="setting-desc">Automatically lock the database after 15 minutes of inactivity.</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">Strict Mode Styling</span>
            <span className="setting-desc">Enforce 5-tier styling priority strictly over local event exceptions.</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2 className="section-title">Danger Zone</h2>
        <div className="settings-row">
          <div className="setting-label">
            <span className="setting-name">Purge Local Metadata</span>
            <span className="setting-desc">Clear browser storage sync cache (RATATOSKR_MASTER). This does not delete the .lca file.</span>
          </div>
          <button className="btn-danger">Wipe Cache</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

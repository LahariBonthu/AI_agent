import Database from "better-sqlite3";

export const db = new Database("memory.db");

db.exec(`
CREATE TABLE IF NOT EXISTS memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor TEXT,
  type TEXT,
  pattern TEXT,
  action TEXT,
  confidence REAL,
  successCount INTEGER,
  failureCount INTEGER,
  lastUsedAt TEXT
);
`);

-- Migration: create voters table for admin voterlist
DROP TABLE IF EXISTS voters;
CREATE TABLE voters (
    external_id TEXT,
    name TEXT NOT NULL,
    token TEXT,
    nim TEXT NOT NULL UNIQUE,
    jurusan TEXT,
    dapil TEXT,
    absent_number TEXT,
    gender TEXT,
    angkatan TEXT,
    kelas TEXT,
    status TEXT,
    has_voted INTEGER DEFAULT 0 NOT NULL,
    voted_at TEXT,
    extra TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voters_nim ON voters(nim);
CREATE INDEX IF NOT EXISTS idx_voters_status ON voters(status);

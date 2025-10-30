DROP TABLE IF EXISTS bakal_calon;
CREATE TABLE bakal_calon (
    posisi TEXT NOT NULL,
    nama TEXT NOT NULL,
    nim TEXT NOT NULL UNIQUE,
    kelas TEXT NOT NULL,
    jurusan TEXT NOT NULL,
    dapil TEXT NOT NULL,
    visi TEXT NOT NULL,
    misi TEXT NOT NULL,
    program_kerja TEXT NOT NULL,
    ktm TEXT NOT NULL,
    surat_pernyataan TEXT NOT NULL,
    cv TEXT NOT NULL,
    formulir_pernyataan_dukungan TEXT NOT NULL,
    formulir_pendaftaran_tim_sukses TEXT NOT NULL,
    link_video TEXT NOT NULL,
    foto TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0 NOT NULL,
    ticket_number INTEGER
)

-- voters (voterlist) table to back Admin VerifyPemilih UI
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
    extra TEXT
);

-- Migration: create bakal_calon table
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
);

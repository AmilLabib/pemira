// Dummy data for jadwal per kelas

export interface JadwalRow {
  id: number;
  kelas: string;
  jadwal: string;
}

export const jadwals: JadwalRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  kelas: `D3 Akuntansi Ahli Program kelas 3-${(i % 6) + 1} BL`,
  jadwal: "08.00 - 18.00",
}));

export default jadwals;

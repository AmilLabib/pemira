export type Voter = {
  id: number;
  name: string;
  token: string;
  nim: string;
  jurusan: string;
  dapil: string;
  absent: number;
  gender: string;
  angkatan: string;
  kelas: string;
  status: "Voted" | "Not Voted";
};

export const sampleVoters: Voter[] = [];

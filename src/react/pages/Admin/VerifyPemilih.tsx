import Card from "../../components/Admin/VerifyPemilih/Card";
import FilterBar, {
  type FilterValues,
} from "../../components/Admin/VerifyPemilih/Filter";
import VotersList from "../../components/Admin/VerifyPemilih/VotersList";
import { useState } from "react";

function PeopleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#f4f4f4"
      width="4em"
      height="4em"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#58a2bd"
      viewBox="0 0 24 24"
      width="2em"
      height="2em"
    >
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

function VoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#f4f4f4"
      viewBox="0 0 24 24"
      width="3.7em"
      height="3.7em"
    >
      <path d="M19 7V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3H2v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7h-3zm-10-3h8v3H9V4zm11 17H4V9h16v12zm-8-3l-5-5h3V9h4v4h3l-5 5z" />
    </svg>
  );
}

function App() {
  const [filters, setFilters] = useState<FilterValues | undefined>(undefined);
  const [totalVoters, setTotalVoters] = useState<number>(0);
  const [votedCount, setVotedCount] = useState<number>(0);

  const handleApply = (f: FilterValues) => {
    setFilters(f);
  };

  return (
    <>
      <div className="container max-w-[85vw] overflow-hidden md:py-8 lg:mx-auto lg:w-full lg:px-4 lg:py-6">
        <div className="flex gap-4 sm:flex-row sm:items-center">
          <div>
            <DashboardIcon />
          </div>
          <h1 className="text-2xl font-semibold text-[#002a45] sm:text-3xl">
            Verifikasi Pemilih
          </h1>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card
            header="Total Pemilih"
            number={totalVoters}
            icon={<PeopleIcon />}
          />
          <Card
            header="Sudah Memilih"
            number={votedCount}
            icon={<VoteIcon />}
          />
          <Card
            header="Progress Pemilihan"
            number={3165}
            icon={null}
            progress={votedCount}
            total={totalVoters}
          />
        </div>

        <div className="mt-8">
          <FilterBar value={filters} onApply={handleApply} />
        </div>

        <div className="mt-8">
          <VotersList
            filters={filters}
            onCountChange={setTotalVoters}
            onVotedCountChange={setVotedCount}
          />
        </div>
      </div>
    </>
  );
}

export default App;

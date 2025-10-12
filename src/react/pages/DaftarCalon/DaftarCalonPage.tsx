import React from "react";
import Header from "../../components/Home/Nav";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Header";

const candidates = [
  { name: "Calon A", number: 1, program: "Program Studi X" },
  { name: "Calon B", number: 2, program: "Program Studi Y" },
];

const DaftarCalonPage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-16">
        <h1 className="mb-6 text-3xl font-bold">Daftar Calon</h1>
        <div className="grid gap-4">
          {candidates.map((c) => (
            <div key={c.number} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                  <div className="text-sm text-slate-300">{c.program}</div>
                </div>
                <div className="text-3xl font-bold">#{c.number}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DaftarCalonPage;

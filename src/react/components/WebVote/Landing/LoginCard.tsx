import React, { useState } from "react";

interface CardProps {
  onSubmit?: (nim: string, token: string) => void;
}

const Card: React.FC<CardProps> = ({ onSubmit }) => {
  const [nim, setNim] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !token) {
      alert("Masukkan NIM dan TOKEN");
      return;
    }
    if (onSubmit) {
      onSubmit(nim, token);
      return;
    }

    try {
      const raw = localStorage.getItem("voters");
      if (raw) {
        const voters = JSON.parse(raw) as any[];
        const found = voters.find((v) => {
          const vn = String(v.nim ?? "")
            .trim()
            .toLowerCase();
          const vt = String(v.token ?? "").trim();
          return vn === nim.trim().toLowerCase() && vt === token.trim();
        });
        if (found) {
          try {
            sessionStorage.setItem(
              "voter",
              JSON.stringify({ nim: nim.trim(), name: found.name ?? "" }),
            );
          } catch (e) {
            // ignore
          }
          window.location.href = "/voting/vote";
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    alert(
      "NIM atau TOKEN tidak ditemukan. Pastikan data yang dimasukkan sudah benar.",
    );
  };

  return (
    <div className="mx-auto h-[62vh] max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="mr-8 flex h-full flex-col rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-lg md:p-8"
        aria-label="Login PEMIRA"
      >
        <h2 className="font-league mb-6 text-center text-xl font-extrabold text-[#002a45] lg:text-3xl">
          Log-In PEMIRA
        </h2>

        <label className="mb-2 block text-lg text-slate-600 lg:text-xl">
          NIM
        </label>
        <input
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="font-poppins mb-4 w-full rounded-md border border-gray-200 p-3 focus:ring-2 focus:ring-sky-200 focus:outline-none"
          placeholder=""
          aria-label="NIM"
        />

        <label className="mb-2 block text-lg text-slate-600 lg:text-xl">
          TOKEN
        </label>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="font-poppins mb-6 w-full rounded-md border border-gray-200 p-3 focus:ring-2 focus:ring-sky-200 focus:outline-none"
          placeholder=""
          aria-label="TOKEN"
        />

        <button
          type="submit"
          className="mt-8 w-full rounded-lg bg-[#ffd358] py-3 text-lg font-bold text-[#002a45] shadow-inner hover:bg-[#002a45] hover:text-[#ffd358]"
          style={{ cursor: "pointer" }}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Card;

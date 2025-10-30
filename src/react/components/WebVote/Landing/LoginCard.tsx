import React, { useState } from "react";
import { API_BASE } from "../../../lib/api";

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
    // Try server login first
    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/vote/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ nim: nim.trim(), token: token.trim() }),
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json.success && json.voter) {
            // If the voter already voted, block and show message
            const serverStatusRaw =
              json.voter.status ??
              json.voter.has_voted ??
              json.voter.voted_at ??
              "";
            const serverStatus = String(serverStatusRaw).toLowerCase();
            // accept 'voted' (string), boolean true, or non-empty voted_at timestamp
            if (
              serverStatus === "Voted" ||
              json.voter.has_voted === true ||
              (json.voter.voted_at || "") !== ""
            ) {
              alert("Anda sudah memilih. Terima Kasih");
              return;
            }
            try {
              sessionStorage.setItem("voter", JSON.stringify(json.voter));
            } catch (e) {
              // ignore
            }
            window.location.href = "/voting/vote";
            return;
          }
        }
      } catch (e) {
        // server unavailable, fall back to localStorage
      }

      // fallback: localStorage-based check (existing behavior)
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
            // block if already voted
            const localStatusRaw =
              found.status ?? found.has_voted ?? found.voted_at ?? "";
            const localStatus = String(localStatusRaw).toLowerCase();
            if (
              localStatus === "Voted" ||
              found.has_voted === true ||
              (found.voted_at || "") !== ""
            ) {
              alert("Anda sudah memilih. Terima Kasih");
              return;
            }
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
    })();
  };

  return (
    <div className="mx-auto h-[62vh] max-h-1/3 max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="mr-8 flex h-full max-h-[500px] flex-col rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-lg md:p-8"
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

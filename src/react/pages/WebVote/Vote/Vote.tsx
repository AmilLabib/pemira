import { useState, useEffect } from "react";
import bg2 from "../../../assets/WebVote/bg2.webp";
import PresmaWapresma from "../../../components/WebVote/Vote/PresmaWapresma";
import Blm from "../../../components/WebVote/Vote/Blm";
import Popup from "../../../components/WebVote/Vote/Popup";

function Vote() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [presmaIndex, setPresmaIndex] = useState<number | null>(null);
  const [blmId, setBlmId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);

  useEffect(() => {
    // check session for voter
    try {
      const raw = sessionStorage.getItem("voter");
      if (!raw) {
        setBlocked("not_logged_in");
        // redirect to landing after short delay
        setTimeout(() => (window.location.href = "/"), 1000);
        return;
      }
      const v = JSON.parse(raw) as any;
      const nim = String(v?.nim ?? "").trim();
      if (!nim) {
        setBlocked("not_logged_in");
        setTimeout(() => (window.location.href = "/"), 1000);
        return;
      }

      // check local voters store to see if already voted
      const rawV = localStorage.getItem("voters");
      if (rawV) {
        try {
          const arr = JSON.parse(rawV) as any[];
          const me = arr.find(
            (x) =>
              String(x.nim ?? "")
                .trim()
                .toLowerCase() === nim.toLowerCase(),
          );
          if (me && String(me.status ?? "").toLowerCase() === "voted") {
            setBlocked("already_voted");
            setTimeout(() => (window.location.href = "/voting/sertif"), 1500);
            return;
          }
        } catch (e) {
          // ignore parse
        }
      }
    } catch (e) {
      setBlocked("not_logged_in");
      setTimeout(() => (window.location.href = "/"), 1000);
    }
  }, []);

  function submitVote() {
    // ensure selected
    if (presmaIndex === null || blmId === null) {
      alert("Pilih Presma-Wapresma dan BLM terlebih dahulu");
      return;
    }

    try {
      const raw = sessionStorage.getItem("voter");
      if (!raw) throw new Error("no voter session");
      const v = JSON.parse(raw) as any;
      const nim = String(v?.nim ?? "").trim();
      if (!nim) throw new Error("invalid voter session");

      // save vote record (client-side fallback for demo); server integration should POST to /api/vote
      const voteRecord = {
        nim,
        presma: presmaIndex,
        blm: blmId,
        ts: new Date().toISOString(),
      };

      try {
        const rawVotes = localStorage.getItem("votes");
        const arr = rawVotes ? JSON.parse(rawVotes) : [];
        arr.push(voteRecord);
        localStorage.setItem("votes", JSON.stringify(arr));
      } catch (e) {
        console.error("failed to persist votes", e);
      }

      // update voter status in local voters store
      try {
        const rawV = localStorage.getItem("voters");
        if (rawV) {
          const arr = JSON.parse(rawV) as any[];
          const next = arr.map((x) => {
            if (
              String(x.nim ?? "")
                .trim()
                .toLowerCase() === nim.toLowerCase()
            ) {
              return { ...x, status: "Voted" };
            }
            return x;
          });
          localStorage.setItem("voters", JSON.stringify(next));
        }
      } catch (e) {
        console.error("failed to update voter status", e);
      }

      // redirect to certificate page
      window.location.href = "/voting/sertif";
    } catch (err) {
      alert("Gagal submit vote: " + String(err));
    }
  }

  if (blocked === "not_logged_in") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Anda belum login. Mengarahkan ke halaman utama...
      </div>
    );
  }
  if (blocked === "already_voted") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Anda sudah melakukan voting. Mengarahkan ke sertifikat...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat pt-12"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <div className="container mx-auto flex min-h-screen items-center px-8 pt-12">
        <PresmaWapresma selected={presmaIndex} onSelect={setPresmaIndex} />
      </div>
      <div className="container mx-auto flex min-h-screen items-center px-8 pt-8">
        <Blm selected={blmId ?? null} onSelect={setBlmId} />
      </div>
      <div className="container mx-auto flex justify-center px-8 pt-6 pb-20">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="font-league w-[90vw] rounded-xl bg-[#102a71] px-6 py-4 text-2xl font-bold text-white shadow transition hover:bg-[#58a2bd]"
          style={{ cursor: "pointer" }}
        >
          Submit Vote
        </button>
      </div>

      <Popup
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          submitVote();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default Vote;

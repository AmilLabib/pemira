import React, { useState } from "react";

type Props = { onDone?: () => void };

const TicketForm: React.FC<Props> = ({ onDone }) => {
  const [presidentName, setPresidentName] = useState("");
  const [presidentNim, setPresidentNim] = useState("");
  const [viceName, setViceName] = useState("");
  const [viceNim, setViceNim] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [programme, setProgramme] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // For simplicity this version creates two candidate persons first, then creates the ticket.
  // It assumes server will accept creation of candidates via /api/candidates (multipart).

  const uploadPerson = async (
    name: string,
    nim: string,
    photo?: File | null,
  ) => {
    const form = new FormData();
    form.append("role", "Person");
    form.append("name", name);
    form.append("nim", nim);
    form.append("major", "");
    form.append("vision", "");
    form.append("mission", "");
    form.append("programme", "");
    if (photo) form.append("photo", photo);
    const res = await fetch("/api/candidates", { method: "POST", body: form });
    if (!res.ok) throw new Error("Failed to create person");
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      alert("Ticket photo is required");
      return;
    }
    setLoading(true);
    try {
      // Create president and vice as candidates
      const pres = await uploadPerson(presidentName, presidentNim, photoFile);
      const vice = await uploadPerson(viceName, viceNim, null);
      const ticketBody = {
        president_id: pres.id,
        vice_id: vice.id,
        name: `${presidentName} & ${viceName}`,
        vision,
        mission,
        programme,
        photo_url: null,
        video_url: null,
      };
      // Create ticket
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketBody),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        alert(json?.error || "Failed to create ticket");
      } else {
        alert("Ticket created");
        onDone && onDone();
      }
    } catch (err: any) {
      alert(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-bold">President & Vice Registration</h3>
      <form onSubmit={handleSubmit}>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">President Name</span>
          <input
            value={presidentName}
            onChange={(e) => setPresidentName(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">President NIM</span>
          <input
            value={presidentNim}
            onChange={(e) => setPresidentNim(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>

        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Vice Name</span>
          <input
            value={viceName}
            onChange={(e) => setViceName(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Vice NIM</span>
          <input
            value={viceNim}
            onChange={(e) => setViceNim(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>

        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Vision</span>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Mission</span>
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Programme</span>
          <textarea
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-sm text-gray-600">Ticket Photo (required)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            required
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;

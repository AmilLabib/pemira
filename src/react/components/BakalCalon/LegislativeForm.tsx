import React, { useState } from "react";

type Props = { onDone?: () => void };

const LegislativeForm: React.FC<Props> = ({ onDone }) => {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [major, setMajor] = useState("");
  const [dapil, setDapil] = useState<number>(1);
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [programme, setProgramme] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      alert("Photo is required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("role", "Legislative");
      form.append("name", name);
      form.append("nim", nim);
      form.append("major", major);
      form.append("vision", vision);
      form.append("mission", mission);
      form.append("programme", programme);
      form.append("dapil", String(dapil));
      form.append("category", "legislative");
      form.append("photo", photoFile);
      if (videoFile) form.append("video", videoFile);

      const res = await fetch("/api/candidates", {
        method: "POST",
        body: form,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = json?.error || `Request failed with status ${res.status}`;
        alert(msg);
      } else {
        alert("Legislative candidate created successfully");
        setName("");
        setNim("");
        setMajor("");
        setVision("");
        setMission("");
        setProgramme("");
        setPhotoFile(null);
        setVideoFile(null);
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
      <h3 className="mb-4 text-xl font-bold">
        Legislative Candidate Registration
      </h3>
      <form onSubmit={handleSubmit}>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">NIM</span>
          <input
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Major</span>
          <input
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Dapil</span>
          <select
            value={dapil}
            onChange={(e) => setDapil(Number(e.target.value))}
            className="mt-1 block w-full rounded border p-2"
          >
            <option value={1}>Dapil 1</option>
            <option value={2}>Dapil 2</option>
            <option value={3}>Dapil 3</option>
            <option value={4}>Dapil 4</option>
          </select>
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
        <label className="mb-2 block">
          <span className="text-sm text-gray-600">Video (optional)</span>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="mb-4 block">
          <span className="text-sm text-gray-600">Photo (required)</span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white"
        >
          {loading ? "Uploading..." : "Create Candidate"}
        </button>
      </form>
    </div>
  );
};

export default LegislativeForm;

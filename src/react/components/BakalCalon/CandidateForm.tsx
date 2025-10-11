import React, { useState } from "react";
import TicketForm from "./TicketForm";
import LegislativeForm from "./LegislativeForm";

type Props = { onDone?: () => void };

const CandidateForm: React.FC<Props> = ({ onDone }) => {
  const [tab, setTab] = useState<"ticket" | "legislative">("ticket");

  return (
    <div className="mx-auto w-full max-w-lg rounded bg-white p-6 shadow">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("ticket")}
          className={`px-3 py-1 ${tab === "ticket" ? "bg-blue-600 text-white" : "bg-gray-100"} rounded`}
        >
          President & Vice
        </button>
        <button
          onClick={() => setTab("legislative")}
          className={`px-3 py-1 ${tab === "legislative" ? "bg-blue-600 text-white" : "bg-gray-100"} rounded`}
        >
          Legislative
        </button>
      </div>

      {tab === "ticket" ? (
        <TicketForm onDone={onDone} />
      ) : (
        <LegislativeForm onDone={onDone} />
      )}
    </div>
  );
};

export default CandidateForm;

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Pemira?",
    answer:
      "Pemilihan Raya (Pemira) adalah pesta demokrasi tahunan terbesar di PKN STAN yang dijadikan sebagai sarana kedaulatan mahasiswa untuk memilih anggota Badan Legislatif Mahasiswa serta memilih Presiden dan Wakil Presiden Mahasiswa yang dilaksanakan secara langsung, umum, bebas, rahasia, jujur, dan adil.",
  },
  {
    question: "Siapakah peserta Pemira?",
    answer:
      "Peserta Pemira terdiri dari calon anggota BLM serta pasangan calon Presiden dan Wakil Presiden Mahasiswa yang diusulkan secara perseorangan dan/atau kolektif dan telah memenuhi persyaratan.",
  },
  {
    question: "Siapa sajakah pemilih dalam Pemira ini?",
    answer:
      "Seluruh mahasiswa aktif PKN STAN berhak untuk memilih dalam Pemira ini.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [list] = useState(faqs);
  const [newQuestion, setNewQuestion] = useState("");

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const submitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const q = newQuestion.trim();
    if (!q) return;
    window.location.href = "https://www.google.com";
  };

  return (
    <section
      id="faq"
      className="mx-auto my-4 w-full px-0 lg:my-16 lg:w-1/2 lg:px-4"
    >
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-neutral-200 bg-white shadow-sm"
          >
            <button
              className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
              onClick={() => toggleFAQ(idx)}
            >
              <span className="font-medium text-neutral-900">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {openIndex === idx && (
              <div className="animate-fade-in px-6 pb-4 text-neutral-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
        {list.slice(faqs.length).map((faq, idx) => {
          const i = faqs.length + idx;
          return (
            <div
              key={`user-${i}`}
              className="rounded-lg border border-neutral-200 bg-white shadow-sm"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(i)}
              >
                <span className="font-medium text-neutral-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform duration-200 ${openIndex === i ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {openIndex === i && (
                <div className="animate-fade-in px-6 pb-4 text-neutral-700">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
        <form onSubmit={submitQuestion} className="flex gap-2">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            className="rounded bg-[#102a71] px-4 py-2 text-white hover:opacity-90"
            type="submit"
            style={{ cursor: "pointer" }}
          >
            Kirim
          </button>
        </form>
      </div>
    </section>
  );
};

export default FAQ;

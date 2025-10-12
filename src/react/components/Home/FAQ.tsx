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

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mx-auto my-16 max-w-2xl px-4">
      <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
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
      </div>
    </section>
  );
};

export default FAQ;

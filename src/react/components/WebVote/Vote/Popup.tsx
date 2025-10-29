import React from "react";

interface PopupProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Popup: React.FC<PopupProps> = ({
  open,
  title = "Konfirmasi Vote",
  description = "Apakah Anda yakin dengan pilihan Anda?\nPilihan tidak dapat diubah setelah Submit",
  confirmLabel = "Ya, Saya Yakin",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-gradient-to-t from-[#58a2bd]/50 to-white rounded-xl p-6 w-[720px] max-w-[92%] border-2 border-[#d9d9d9] shadow-lg">
        <div className="text-center">
          <h3 className="text-2xl font-league font-extrabold text-[#0b3b52]">
            {title}
          </h3>
          <p className="font-poppins mt-2 text-gray-600 whitespace-pre-line">
            {description}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-400 font-poppins text-white px-6 py-2 rounded-md font-base hover:brightness-80"
            style={{ cursor: "pointer" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#0b57a4] font-poppins text-white px-6 py-2 rounded-md font-base shadow hover:brightness-130"
            style={{ cursor: "pointer" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

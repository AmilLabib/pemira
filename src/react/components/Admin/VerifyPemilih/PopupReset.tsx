type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PopupReset({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-white opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">Reset Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete all data? This action cannot be
          undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("PopupReset onConfirm clicked");
              onConfirm();
            }}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

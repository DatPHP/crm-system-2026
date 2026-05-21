import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadFile } from "../utils/download";

interface ExportOption {
  label: string;
  icon: "excel" | "pdf";
  onExport: () => Promise<Blob>;
  filename: string;
}

interface Props {
  options: ExportOption[];
}

export default function ExportButton({ options }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (option: ExportOption) => {
    setLoading(true);
    setOpen(false);
    try {
      const blob = await option.onExport();
      downloadFile(blob, option.filename);
      toast.success(`${option.filename} downloaded!`);
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
      >
        <Download size={16} />
        {loading ? "Exporting..." : "Export"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border z-20">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleExport(opt)}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left"
              >
                {opt.icon === "excel" ? (
                  <FileSpreadsheet size={16} className="text-green-600" />
                ) : (
                  <FileText size={16} className="text-red-500" />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

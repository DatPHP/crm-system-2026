import { PackageOpen } from 'lucide-react';

interface Props {
  message?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ message = 'No data found', action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <PackageOpen size={48} className="mb-3 opacity-40" />
      <p className="text-lg font-medium">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
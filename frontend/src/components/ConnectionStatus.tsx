import { useRealtime } from "../hooks/useRealtime";

export default function ConnectionStatus() {
  const { connected } = useRealtime();

  return (
    <div
      className="flex items-center gap-1.5"
      title={connected ? "Real-time connected" : "Connecting..."}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          connected ? "bg-green-500 animate-pulse" : "bg-gray-400"
        }`}
      />
      <span className="text-xs text-gray-500 hidden sm:block">
        {connected ? "Live" : "Connecting..."}
      </span>
    </div>
  );
}

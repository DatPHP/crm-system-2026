import React from "react";
import * as Sentry from "@sentry/react";

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Something went wrong
        </h2>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const ErrorBoundary = Sentry.withErrorBoundary(ErrorBoundaryWrapper, {
  fallback: <Fallback />,
});

export default ErrorBoundary;
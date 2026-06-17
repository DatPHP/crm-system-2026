import * as Sentry from "@sentry/react";

// Thay class ErrorBoundary bằng Sentry's ErrorBoundary
export default Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: (
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
    ),
  },
);

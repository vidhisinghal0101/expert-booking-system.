const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-5xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
    <p className="text-gray-500 mb-6 max-w-md">{message || 'Failed to load data. Please try again.'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;

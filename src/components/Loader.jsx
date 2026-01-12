/**
 * Loader Component
 * Displays a loading spinner with optional text
 */
export default function Loader({ text = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full" />
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

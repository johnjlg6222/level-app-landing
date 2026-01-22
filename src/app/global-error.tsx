'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="bg-[#050507] text-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-3xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-gray-400 mb-6">
              Nous nous excusons pour ce désagrément. Veuillez réessayer.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

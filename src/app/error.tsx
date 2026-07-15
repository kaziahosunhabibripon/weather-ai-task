"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-950">Dashboard error</h1>
        <p className="mt-2 text-sm text-slate-600">Something interrupted the console render.</p>
        <button onClick={reset} className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="button">
          Try again
        </button>
      </div>
    </main>
  );
}

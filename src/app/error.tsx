"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6">
      <div className="max-w-md rounded-2xl border border-red-400/30 bg-slate-900 p-6 text-center shadow-xl">
        <h1 className="text-xl font-semibold text-white">Dashboard error</h1>
        <p className="mt-2 text-sm text-slate-300">Something interrupted the console render.</p>
        <button onClick={reset} className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white" type="button">
          Try again
        </button>
      </div>
    </main>
  );
}

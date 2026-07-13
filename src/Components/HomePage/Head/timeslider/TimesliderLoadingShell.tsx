export function TimesliderLoadingShell() {
  return (
    <div className="flex w-full justify-center px-1">
      <div className="flex min-h-[88px] w-full max-w-7xl items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
        <p className="animate-pulse text-xs text-gray-400">Laden...</p>
      </div>
    </div>
  );
}

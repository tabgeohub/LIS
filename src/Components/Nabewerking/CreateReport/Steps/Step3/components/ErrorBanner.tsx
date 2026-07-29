interface ErrorBannerProps {
  errorMsg: string | null;
}

export default function ErrorBanner({ errorMsg }: ErrorBannerProps) {
  if (!errorMsg) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2 mb-3"
    >
      {errorMsg}
    </div>
  );
}




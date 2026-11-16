export default function ErrorBanner({ error, title = "Request failed" }) {
  if (!error) return null;
  const message =
    typeof error === "string"
      ? error
      : error?.data?.message || error?.message || "An unexpected error occurred.";
  const code = error?.data?.code || error?.code;
  const isNotReady = error?.status === 501 || code === "DB_NOT_READY";

  return (
    <div className={`banner ${isNotReady ? "banner-info" : "banner-error"}`} role="alert">
      <strong>{isNotReady ? "Not available yet" : title}:</strong> {message}
      {error?.data?.expected ? (
        <div className="mono" style={{ marginTop: 6, opacity: 0.85 }}>
          Request: {JSON.stringify(error.data.expected)}
        </div>
      ) : null}
    </div>
  );
}

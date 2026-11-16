import { useState } from "react";
import { api } from "../api.js";
import ErrorBanner from "../components/ErrorBanner.jsx";

export default function Checkout() {
  const [reservationId, setReservationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.checkout({ reservationId: Number(reservationId) });
      setResult(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Checkout</h1>
        <p>
          Processes checkout via <code className="mono">pkg_hotel.process_checkouts</code>. Status transitions and
          room/housekeeping side effects are handled in PL/SQL.
        </p>
      </div>

      <ErrorBanner error={error} />
      {result ? (
        <div className="banner banner-info">
          Checkout processed for reservation <strong className="mono">{result.reservationId || reservationId}</strong>.
        </div>
      ) : null}

      <div className="panel" style={{ maxWidth: 560 }}>
        <form onSubmit={onSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr auto" }}>
            <div className="field">
              <label htmlFor="reservationId">Reservation ID</label>
              <input
                id="reservationId"
                type="number"
                min="1"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                placeholder="e.g. 10042"
                required
              />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Processing…" : "Process checkout"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="panel-title" style={{ marginBottom: 8 }}>What happens on checkout</div>
        <ul style={{ paddingLeft: 18, color: "var(--muted)", fontSize: 13, display: "grid", gap: 4 }}>
          <li>Reservation status moves to <span className="mono">CHECKED_OUT</span> (package/procedure).</li>
          <li>Room status and housekeeping log updates are driven by database triggers/procedures.</li>
          <li>All state changes are recorded in <span className="mono">audit_log</span> by the audit trigger.</li>
        </ul>
      </div>
    </div>
  );
}

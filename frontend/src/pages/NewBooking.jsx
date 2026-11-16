import { useState } from "react";
import { api } from "../api.js";
import ErrorBanner from "../components/ErrorBanner.jsx";

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

export default function NewBooking() {
  const [form, setForm] = useState({
    guestId: "",
    roomId: "",
    checkIn: today(),
    checkOut: tomorrow(),
    adults: 1,
    children: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.createBooking({
        ...form,
        guestId: Number(form.guestId),
        roomId: Number(form.roomId),
        adults: Number(form.adults),
        children: Number(form.children),
      });
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
        <h1>New Booking</h1>
        <p>
          Creates a reservation via <code className="mono">pkg_hotel.book_reservation</code>. Overlap checks and
          booking rules are enforced by PL/SQL triggers and functions.
        </p>
      </div>

      <ErrorBanner error={error} />
      {result ? (
        <div className="banner banner-info">
          Booking created. Confirmation: <strong className="mono">{result.confirmationCode || result.CONFIRMATION_CODE || JSON.stringify(result)}</strong>
        </div>
      ) : null}

      <div className="panel">
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="guestId">Guest ID</label>
              <input id="guestId" name="guestId" type="number" min="1" value={form.guestId} onChange={onChange} required placeholder="e.g. 101" />
            </div>
            <div className="field">
              <label htmlFor="roomId">Room ID</label>
              <input id="roomId" name="roomId" type="number" min="1" value={form.roomId} onChange={onChange} required placeholder="e.g. 12" />
            </div>
            <div className="field">
              <label htmlFor="checkIn">Check-in</label>
              <input id="checkIn" name="checkIn" type="date" value={form.checkIn} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="checkOut">Check-out</label>
              <input id="checkOut" name="checkOut" type="date" value={form.checkOut} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="adults">Adults</label>
              <input id="adults" name="adults" type="number" min="1" value={form.adults} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="children">Children</label>
              <input id="children" name="children" type="number" min="0" value={form.children} onChange={onChange} />
            </div>
          </div>

          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Create reservation"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-title" style={{ marginBottom: 8 }}>Notes</div>
        <ul style={{ paddingLeft: 18, color: "var(--muted)", fontSize: 13, display: "grid", gap: 4 }}>
          <li>Room overlap prevention is enforced in the database (trigger + function), not in this UI.</li>
          <li>If the selected room conflicts with an existing stay, PL/SQL will reject the booking and the API will surface the error.</li>
          <li>Guest and room selection will be enhanced with lookups once the database is connected.</li>
        </ul>
      </div>
    </div>
  );
}

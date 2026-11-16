import { useState } from "react";
import { api, formatDate, formatMoney } from "../api.js";
import Table from "../components/Table.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

export default function GuestProfile() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const data = await api.listGuests(query);
      setGuests(Array.isArray(data) ? data : data?.guests || []);
      setSearched(true);
    } catch (err) {
      setError(err);
      setGuests([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  async function openGuest(id) {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const data = await api.getGuest(id);
      setSelected(data);
    } catch (err) {
      setDetailError(err);
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  }

  const guestCols = [
    { header: "ID", render: (r) => r.GUEST_ID ?? r.guestId },
    { header: "Name", render: (r) => `${r.FIRST_NAME ?? r.firstName ?? ""} ${r.LAST_NAME ?? r.lastName ?? ""}`.trim() || "—" },
    { header: "Email", render: (r) => r.EMAIL ?? r.email ?? "—" },
    { header: "Phone", render: (r) => r.PHONE ?? r.phone ?? "—" },
    { header: "Tier", render: (r) => <span className="badge">{r.LOYALTY_TIER ?? r.loyaltyTier ?? "—"}</span> },
    { header: "", align: "right", render: (r) => (
      <button className="btn btn-secondary" style={{ height: 28, padding: "0 10px" }} onClick={() => openGuest(r.GUEST_ID ?? r.guestId)}>View</button>
    )},
  ];

  const resCols = [
    { header: "Reservation", render: (r) => <span className="mono">{r.CONFIRMATION_CODE ?? r.confirmationCode ?? r.RESERVATION_ID ?? r.reservationId}</span> },
    { header: "Room", render: (r) => r.ROOM_NUMBER ?? r.roomNumber ?? r.ROOM_ID ?? r.roomId ?? "—" },
    { header: "Check-in", render: (r) => formatDate(r.CHECK_IN_DATE ?? r.checkInDate) },
    { header: "Check-out", render: (r) => formatDate(r.CHECK_OUT_DATE ?? r.checkOutDate) },
    { header: "Status", render: (r) => {
      const s = (r.STATUS ?? r.status ?? "").toLowerCase();
      return <span className={`badge badge-${s}`}>{r.STATUS ?? r.status ?? "—"}</span>;
    }},
    { header: "Total", align: "right", render: (r) => formatMoney(r.TOTAL ?? r.total ?? r.TOTAL_AMOUNT ?? r.totalAmount) },
  ];

  const reservations = selected?.reservations || selected?.RESERVATIONS || [];

  return (
    <div>
      <div className="page-header">
        <h1>Guests</h1>
        <p>Look up guests and view reservation history with totals (via <code className="mono">fn_reservation_total</code>).</p>
      </div>

      <div className="panel">
        <form onSubmit={onSearch}>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr auto" }}>
            <div className="field">
              <label htmlFor="q">Search</label>
              <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email, or phone" />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
            </div>
          </div>
        </form>
      </div>

      <ErrorBanner error={error} />

      <div className="split">
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Results</div></div>
          <Table columns={guestCols} rows={guests} empty={searched ? "No guests found." : "Search to list guests."} rowKey={(r) => r.GUEST_ID ?? r.guestId} />
        </div>

        <div className="panel">
          <div className="panel-header"><div className="panel-title">Profile</div></div>
          <ErrorBanner error={detailError} />
          {detailLoading ? <p className="muted">Loading profile…</p> : null}
          {!detailLoading && !selected && !detailError ? <p className="empty">Select a guest to view details.</p> : null}
          {selected ? (
            <>
              <dl className="kv" style={{ marginBottom: 16 }}>
                <dt>Name</dt><dd>{`${selected.FIRST_NAME ?? selected.firstName ?? ""} ${selected.LAST_NAME ?? selected.lastName ?? ""}`.trim()}</dd>
                <dt>Email</dt><dd>{selected.EMAIL ?? selected.email ?? "—"}</dd>
                <dt>Phone</dt><dd>{selected.PHONE ?? selected.phone ?? "—"}</dd>
                <dt>Loyalty tier</dt><dd>{selected.LOYALTY_TIER ?? selected.loyaltyTier ?? "—"}</dd>
                <dt>Member since</dt><dd>{formatDate(selected.CREATED_AT ?? selected.createdAt)}</dd>
              </dl>
              <div className="panel-title" style={{ fontSize: 13, marginBottom: 8 }}>Reservations</div>
              <Table columns={resCols} rows={reservations} empty="No reservations." rowKey={(r) => r.RESERVATION_ID ?? r.reservationId ?? r.CONFIRMATION_CODE ?? r.confirmationCode} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

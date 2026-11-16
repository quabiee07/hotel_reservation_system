import { useState } from "react";
import { api } from "../api.js";
import Table from "../components/Table.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export default function Availability() {
  const [form, setForm] = useState({ checkIn: today(), checkOut: tomorrow(), adults: 2, children: 0 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAvailability(form);
      setRows(Array.isArray(data) ? data : data?.rooms || []);
      setSearched(true);
    } catch (err) {
      setError(err);
      setRows([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: "Room", key: "ROOM_NUMBER", render: (r) => r.ROOM_NUMBER ?? r.roomNumber ?? "—" },
    { header: "Type", key: "TYPE_NAME", render: (r) => r.TYPE_NAME ?? r.typeName ?? "—" },
    { header: "Floor", key: "FLOOR", render: (r) => r.FLOOR ?? r.floor ?? "—" },
    { header: "Max Occ.", key: "MAX_OCCUPANCY", render: (r) => r.MAX_OCCUPANCY ?? r.maxOccupancy ?? "—" },
    { header: "Base Rate", key: "BASE_RATE", render: (r) => {
      const v = r.BASE_RATE ?? r.baseRate;
      return v != null ? `$${Number(v).toFixed(2)}` : "—";
    }},
    { header: "Status", key: "STATUS", render: (r) => <span className="badge">{r.STATUS ?? r.status ?? "—"}</span> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Room Availability</h1>
        <p>Search for rooms free in a date range. Results come from <code className="mono">pkg_hotel.get_available_rooms</code>.</p>
      </div>

      <div className="panel">
        <form onSubmit={onSearch}>
          <div className="form-grid">
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
              <input id="adults" name="adults" type="number" min="1" value={form.adults} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="children">Children</label>
              <input id="children" name="children" type="number" min="0" value={form.children} onChange={onChange} />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Searching…" : "Search rooms"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ErrorBanner error={error} />

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Available rooms</div>
          {searched && !error ? <span className="muted">{rows.length} result(s)</span> : null}
        </div>
        <Table
          columns={columns}
          rows={rows}
          empty={searched ? "No rooms available for the selected dates." : "Run a search to see available rooms."}
          rowKey={(r) => r.ROOM_ID ?? r.roomId ?? r.ROOM_NUMBER ?? r.roomNumber}
        />
      </div>
    </div>
  );
}

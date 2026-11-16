import { useState } from "react";
import { api, formatDateTime } from "../api.js";
import Table from "../components/Table.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

export default function AuditLog() {
  const [filters, setFilters] = useState({ table: "RESERVATIONS", action: "", limit: 50 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const onChange = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onLoad(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAudit(filters);
      setRows(Array.isArray(data) ? data : data?.rows || []);
      setLoaded(true);
    } catch (err) {
      setError(err);
      setRows([]);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { header: "Time", render: (r) => formatDateTime(r.CHANGED_AT ?? r.changedAt) },
    { header: "Table", render: (r) => <span className="mono">{r.TABLE_NAME ?? r.tableName ?? "—"}</span> },
    { header: "Action", render: (r) => {
      const a = (r.ACTION ?? r.action ?? "").toLowerCase();
      return <span className={`badge badge-${a}`}>{r.ACTION ?? r.action ?? "—"}</span>;
    }},
    { header: "Record", render: (r) => <span className="mono">{r.RECORD_ID ?? r.recordId ?? "—"}</span> },
    { header: "Old value", render: (r) => <span className="mono" style={{ color: "var(--muted)" }}>{r.OLD_VALUE ?? r.oldValue ?? "—"}</span> },
    { header: "New value", render: (r) => <span className="mono">{r.NEW_VALUE ?? r.newValue ?? "—"}</span> },
    { header: "By", render: (r) => r.CHANGED_BY ?? r.changedBy ?? "—" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Audit Log</h1>
        <p>
          Read-only view of <code className="mono">audit_log</code>. Entries are written by PL/SQL triggers (e.g.
          <code className="mono"> trg_reservations_audit</code>) on reservation changes.
        </p>
      </div>

      <div className="panel">
        <form onSubmit={onLoad}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="table">Table</label>
              <select id="table" name="table" value={filters.table} onChange={onChange}>
                <option value="">All</option>
                <option value="RESERVATIONS">RESERVATIONS</option>
                <option value="PAYMENTS">PAYMENTS</option>
                <option value="ROOMS">ROOMS</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="action">Action</label>
              <select id="action" name="action" value={filters.action} onChange={onChange}>
                <option value="">All</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="limit">Limit</label>
              <input id="limit" name="limit" type="number" min="1" max="500" value={filters.limit} onChange={onChange} />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Loading…" : "Load log"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ErrorBanner error={error} />

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Entries</div>
          {loaded && !error ? <span className="muted">{rows.length} row(s)</span> : null}
        </div>
        <Table
          columns={columns}
          rows={rows}
          empty={loaded ? "No audit entries match the filters." : "Load the audit log to view entries."}
          rowKey={(r) => r.LOG_ID ?? r.logId}
        />
      </div>
    </div>
  );
}

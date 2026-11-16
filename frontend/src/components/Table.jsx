export default function Table({ columns, rows, empty = "No records found.", rowKey }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key || c.header}
                style={{
                  textAlign: c.align || "left",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--muted)",
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows || rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={rowKey ? rowKey(row) : row.id ?? row.ID ?? idx}>
                {columns.map((c) => (
                  <td
                    key={c.key || c.header}
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border)",
                      textAlign: c.align || "left",
                      verticalAlign: "top",
                    }}
                  >
                    {typeof c.render === "function" ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

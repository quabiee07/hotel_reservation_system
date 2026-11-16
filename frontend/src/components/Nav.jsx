import { NavLink } from "react-router-dom";
import "./Nav.css";

const links = [
  { to: "/availability", label: "Availability" },
  { to: "/bookings/new", label: "New Booking" },
  { to: "/guests", label: "Guests" },
  { to: "/checkout", label: "Checkout" },
  { to: "/audit", label: "Audit Log" },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <div className="brand-title">Front Desk</div>
            <div className="brand-sub">Hotel Reservation System</div>
          </div>
        </div>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Availability from "./pages/Availability.jsx";
import NewBooking from "./pages/NewBooking.jsx";
import GuestProfile from "./pages/GuestProfile.jsx";
import Checkout from "./pages/Checkout.jsx";
import AuditLog from "./pages/AuditLog.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="main">
        <div className="banner banner-warn">
          Database connection is not configured. Booking, overlap checks, and audit data are handled by
          Oracle PL/SQL; this UI is wired to the API draft but actions are unavailable until the database is ready.
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/availability" replace />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/bookings/new" element={<NewBooking />} />
          <Route path="/guests" element={<GuestProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/audit" element={<AuditLog />} />
        </Routes>
      </main>
    </div>
  );
}

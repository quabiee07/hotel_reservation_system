import { Router } from "express";
// import { getConnection } from "../db.js";
// import oracledb from "oracledb";

const router = Router();

// POST /api/bookings
// Calls: pkg_hotel.book_reservation(p_guest_id, p_room_id, p_check_in, p_check_out, p_adults, p_children, p_confirmation_code OUT)
router.post("/", async (req, res, next) => {
  try {
    const { guestId, roomId, checkIn, checkOut, adults = 1, children = 0 } = req.body;

    if (!guestId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "guestId, roomId, checkIn, checkOut are required" });
    }

    // TODO: call pkg_hotel.book_reservation and return confirmation code.
    // Overlap checks and booking rules live in PL/SQL; surface ORA errors to client.

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire pkg_hotel.book_reservation here.",
      expected: { guestId, roomId, checkIn, checkOut, adults, children },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookings/:id
// Calls: pkg_hotel.cancel_reservation(p_reservation_id) or equivalent procedure
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: call cancellation procedure.

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire cancel procedure here.",
      expected: { reservationId: id },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

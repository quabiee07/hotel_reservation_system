import { Router } from "express";
// import { execute } from "../db.js";

const router = Router();

// GET /api/guests?q=
// Lists/searches guests. When DB ready: SELECT + join/use fn_reservation_total as needed.
router.get("/", async (req, res, next) => {
  try {
    const { q = "" } = req.query;

    // TODO: SELECT guest_id, first_name, last_name, email, phone, loyalty_tier, created_at
    //       FROM guests WHERE ... ORDER BY last_name

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire guest lookup query here.",
      expected: { query: q },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/guests/:id
// Guest profile including reservations and totals (via fn_reservation_total).
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: fetch guest, their reservations, and fn_reservation_total per reservation.

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire guest profile query here.",
      expected: { guestId: id },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from "express";
// import { getConnection } from "../db.js";

const router = Router();

// POST /api/checkout
// Calls: pkg_hotel.process_checkouts(p_reservation_id) or batch variant
router.post("/", async (req, res, next) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "reservationId is required" });
    }

    // TODO: call pkg_hotel.process_checkouts.

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire pkg_hotel.process_checkouts here.",
      expected: { reservationId },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

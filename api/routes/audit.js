import { Router } from "express";
// import { execute } from "../db.js";

const router = Router();

// GET /api/audit?table=RESERVATIONS&action=UPDATE&limit=100
// Read-only view over audit_log.
router.get("/", async (req, res, next) => {
  try {
    const { table, action, limit = 100 } = req.query;

    // TODO: SELECT log_id, table_name, action, record_id, old_value, new_value, changed_by, changed_at
    //       FROM audit_log WHERE ... ORDER BY changed_at DESC FETCH FIRST :limit ROWS ONLY

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire audit_log query here.",
      expected: { table, action, limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

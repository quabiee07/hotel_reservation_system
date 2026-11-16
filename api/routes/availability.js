import { Router } from "express";
// import { getConnection } from "../db.js";
// import oracledb from "oracledb";

const router = Router();

// GET /api/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=2&children=0
// Calls: pkg_hotel.get_available_rooms(p_check_in, p_check_out, p_adults, p_children) -> SYS_REFCURSOR
router.get("/", async (req, res, next) => {
  try {
    const { checkIn, checkOut, adults = 1, children = 0 } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "checkIn and checkOut are required" });
    }

    // TODO: when DB is ready, call PL/SQL package and return cursor rows.
    // const conn = await getConnection();
    // const result = await conn.execute(
    //   `BEGIN :cursor := pkg_hotel.get_available_rooms(TO_DATE(:checkIn,'YYYY-MM-DD'), TO_DATE(:checkOut,'YYYY-MM-DD'), :adults, :children); END;`,
    //   { checkIn, checkOut, adults, children, cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    // );
    // const rs = result.outBinds.cursor;
    // const rows = await rs.getRows();
    // await rs.close(); await conn.close();

    return res.status(501).json({
      error: "Not implemented",
      message: "Database/PLSQL not connected. Wire pkg_hotel.get_available_rooms here.",
      expected: { checkIn, checkOut, adults: Number(adults), children: Number(children) },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

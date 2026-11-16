import oracledb from "oracledb";

let pool;

export async function initPool() {
  if (process.env.DB_DISABLED === "true") {
    console.log("[db] DB_DISABLED=true, skipping Oracle pool initialization");
    return null;
  }

  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT,
    poolMin: Number(process.env.DB_POOL_MIN || 1),
    poolMax: Number(process.env.DB_POOL_MAX || 4),
    poolIncrement: Number(process.env.DB_POOL_INCREMENT || 1),
  });

  console.log("[db] Oracle pool created");
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close(0);
    pool = null;
  }
}

export async function getConnection() {
  if (!pool) {
    const err = new Error("Database is not connected");
    err.status = 503;
    err.code = "DB_NOT_READY";
    throw err;
  }
  return pool.getConnection();
}

export async function execute(sql, binds = {}, options = {}) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: false,
      ...options,
    });
    return result;
  } finally {
    if (conn) await conn.close();
  }
}

import type { Pool } from "pg";

/** Pool or PoolClient — anything that can run queries (including inside a tx). */
export type Queryable = Pick<Pool, "query">;

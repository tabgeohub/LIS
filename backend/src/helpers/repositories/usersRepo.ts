import type { Queryable } from "./queryable";

export async function selectUserByUsername(
  db: Queryable,
  username: string
) {
  return db.query(
    `SELECT user_id, user_name, role, password FROM lis.users WHERE LOWER(user_name) = LOWER($1)`,
    [username]
  );
}

export async function insertUserReturning(
  db: Queryable,
  input: { user_name: unknown; role: unknown; password: unknown }
) {
  return db.query(
    "INSERT INTO lis.users (user_name, role, password) VALUES ($1, $2, $3) RETURNING *",
    [input.user_name, input.role, input.password]
  );
}

export async function selectAllUsers(db: Queryable) {
  return db.query("SELECT * FROM lis.users ORDER BY user_id");
}

export async function updateUserReturning(
  db: Queryable,
  input: {
    user_id: unknown;
    user_name: unknown;
    role: unknown;
    password: unknown;
  }
) {
  return db.query(
    `UPDATE lis.users
     SET user_name = $1,
         role = $2,
         password = $3
     WHERE user_id = $4
     RETURNING *`,
    [input.user_name, input.role, input.password, input.user_id]
  );
}

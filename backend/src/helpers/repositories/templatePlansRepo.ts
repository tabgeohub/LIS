import type { Queryable } from "./queryable";

export async function selectTemplatePlanByName(
  db: Queryable,
  name: string
) {
  return db.query(`SELECT * FROM lis.template_plans WHERE name = $1`, [name]);
}

export async function insertTemplatePlanReturning(
  db: Queryable,
  input: { points: unknown; name: string; regio_id: unknown }
) {
  return db.query(
    `INSERT INTO lis.template_plans (
        points,
        name,
        regio_id
      )
      VALUES (
        $1, 
        $2,
        $3
      )
      RETURNING *;`,
    [input.points, input.name, input.regio_id]
  );
}

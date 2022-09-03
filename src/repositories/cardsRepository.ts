import connection from "../database/postgres";
import { CardTypes } from "../types/cardTypes"

export async function SeachByType(employeeId: number, typeCard: CardTypes){
  const result = await connection.query(
    `
      SELECT * FROM cards c
      JOIN employees e
      ON e.id = c."employeeId"
      WHERE e.id = $1 AND c.type = $2         
    `, [employeeId, typeCard]
  );
  return result.rows[0];
}
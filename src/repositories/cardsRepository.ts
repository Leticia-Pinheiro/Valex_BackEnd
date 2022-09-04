import connection from "../database/postgres";
import { TransactionTypes, Card} from "../utils/types"


export async function SeachByType(employeeId: number, typeCard: TransactionTypes){
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

export async function CreateCard(cardData: Card){
    const {
      employeeId,
      number,
      cardholderName,
      securityCode,
      cardExpirationDate,
      password,
      isVirtual,
      originalCardId,
      isBlocked,
      type,
    } = cardData

    await connection.query(
      `
      INSERT INTO cards ("employeeId", number, "cardholderName", "securityCode",
      "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,
		[
			employeeId,
			number,
			cardholderName,
			securityCode,
			cardExpirationDate,
			password,
			isVirtual,
			originalCardId,
			isBlocked,
			type,
		]
    )
}
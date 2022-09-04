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

export async function ValidateCardByNumber(
	number: string){

	const result = await connection.query(
    `
    SELECT * FROM cards 
    WHERE number = $1    
    `,[number]
  )
	
  return result.rows[0]
}

export async function ActivateCard(
  number: string, 
  passwordCrypt: string){

    const result = await connection.query(
      `
      UPDATE cards 
      SET password = $1
      WHERE number = $2
      `,
      [passwordCrypt, number]
    )

    return result

    
}


export async function ValidateCardById(
	id: number){

	const result = await connection.query(
    `
    SELECT * FROM cards 
    WHERE id = $1    
    `,[id]
  )
	
  return result.rows[0]
}

export async function GetRecharges(cardId: number){
  const rechargesData = await connection.query(
    `
    SELECT r.id, r."cardId", r.timestamp, r.amount
    FROM cards c    
    JOIN recharges r 
    ON r."cardId" = c.id    
    WHERE c.id = $1
    `, [cardId]
  )

  return rechargesData.rows
}

export async function GetTransaction(cardId: number){
  const transactionsData = await connection.query(
    `
    SELECT p.id, p."cardId", p."businessId",
	  b.name AS "businessName", p.timestamp, p.amount
	  FROM cards c
    JOIN payments p 
    ON p."cardId" = c.id    
    JOIN businesses b
    ON p."businessId" = b.id
    WHERE c.id = $1
    `, [cardId]
  )

  return transactionsData.rows
}

export async function GetBalance(cardId: number){
  const balance = await connection.query(
    `
    SELECT (SELECT COALESCE(SUM(amount),0) 
    FROM recharges 
    WHERE "cardId" = $1) -
    (SELECT COALESCE(SUM(amount),0) 
    FROM payments WHERE "cardId" = $1) 
    as balance
    `,
    [cardId]    
  )
  return balance.rows[0]
}
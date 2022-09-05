import connection from "../database/postgres";

export async function CreatePayment(
    cardId: number, 
    businessId: number, 
    amount: number){

    await connection.query(
        `
        INSERT INTO payments 
        ("cardId", "businessId", amount)
        VALUES
        ($1, $2, $3)
        `, 
        [cardId, businessId, amount]
        )   

    
}
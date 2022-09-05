import connection from "../database/postgres";

export async function CreateRecharge(
    id: number,
    amount: number){

    await connection.query(
        `
        INSERT INTO recharges 
        ("cardId", amount)
        VALUES
        ($1, $2) 
        `, 
        [id, amount]
        )   

}
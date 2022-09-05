import connection from "../database/postgres";

export async function SearchBusinessByName(
    businessName: string){

    const businessData = await connection.query(
        `
        SELECT * 
        FROM businesses 
        WHERE name = $1
        `, 
        [businessName],
        )   

    return businessData.rows[0]
}
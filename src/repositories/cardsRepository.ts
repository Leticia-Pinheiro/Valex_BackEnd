import connection from "../database/postgres";

export async function SeachKey(ApiKey: string){
    const result = await connection.query(
        `
          SELECT * 
          FROM companies 
          WHERE "apiKey" = $1          
        `, [ApiKey]
      );
      return result.rows;
}
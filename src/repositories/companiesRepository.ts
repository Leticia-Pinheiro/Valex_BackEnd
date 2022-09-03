import connection from "../database/postgres";

export async function SeachByApiKey(ApiKey: string){
    const result = await connection.query(
        `
          SELECT * 
          FROM companies 
          WHERE "apiKey" = $1          
        `, [ApiKey]
      );
      return result.rows[0];
}
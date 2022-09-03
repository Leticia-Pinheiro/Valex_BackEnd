import connection from "../database/postgres";

export async function SeachById(employeeId: number){
    const result = await connection.query(
        `
          SELECT * 
          FROM employees 
          WHERE id = $1          
        `, [employeeId]
      );
      return result.rows[0];
}
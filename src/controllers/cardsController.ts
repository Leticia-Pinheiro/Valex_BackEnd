import { Request, Response } from "express"

export async function CreateCard(req: Request, res: Response){
    try{
        res.send("ok").status(200)
    }catch{

    }    
}
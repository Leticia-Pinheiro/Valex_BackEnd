import * as cardsRepository from "../repositories/cardsRepository"

export async function CreateCard(
    companyApiKey: any, 
    typeCard: string, 
    employeeId: number){

    const validApiKey = await cardsRepository.SeachKey(companyApiKey)

    if(validApiKey.length>0){
        return "ok"
    }    
        
    
     

}
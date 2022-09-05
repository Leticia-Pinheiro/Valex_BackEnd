import Cryptr from "cryptr"

const cryptr = new Cryptr("SecretKey") 


export function EncryptData(data: string){
    return cryptr.encrypt(data)
} 

export function DecryptData(data: string){
    return cryptr.decrypt(data)
} 

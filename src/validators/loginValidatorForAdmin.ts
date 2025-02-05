
import { Dispatch,SetStateAction } from "react";
import { AdminInterface } from "../admin/login/Login";


type probs={
    username:string
    password:string
  }
export const  LoginValidatorAdmin=(
    {email,password}:AdminInterface,
    setWarnning:Dispatch<SetStateAction<probs>>):boolean=>{
    if(email.trim()===''){
        setWarnning(el=>({...el,username:'blank connot be accepted',password:''}))
        return false
    }
    if(email){

        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const validEmail= emailRegex.test(email.trim())
        if(!validEmail){
            setWarnning(el=>({...el,username:'Not valid email',password:''}))
            return false
            // user@.com (missing domain name)
            // user@domain (missing TLD)
            // @example.com (missing user part)
        }
    }
     if(password?.trim()===''){
        setWarnning(el=>({...el,password:'blank connot be accepted',username:''}))
        return false
    }
    return true
}   
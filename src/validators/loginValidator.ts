import { userForm } from "../components/user/login/Login";
import { Dispatch,SetStateAction } from "react";

type probs={
    email:string|null
    password:string|null
  }
export const  LoginValidator=(
    {email,password}:userForm,
    setWarnning:Dispatch<SetStateAction<probs>>):boolean=>{
    if(email.trim()===''){
        setWarnning(el=>({...el,email:'blank connot be accepted',password:null}))
        return false
    }
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const validEmail= emailRegex.test(email.trim())
    if(!validEmail){
        setWarnning(el=>({...el,email:'Not valid email',password:null}))
        return false
        // user@.com (missing domain name)
        // user@domain (missing TLD)
        // @example.com (missing user part)
    }
    else if(password.trim()===''){
        setWarnning(el=>({...el,password:'blank connot be accepted',email:null}))
        return false
    }
    return true
}   
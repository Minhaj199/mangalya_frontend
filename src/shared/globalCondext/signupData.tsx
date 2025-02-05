import React,{createContext,useState,ReactNode} from "react";



export type signupFirst={
        'SECOND NAME':string;
        'DATE OF BIRTH':string
        'DISTRICT THAT YOU LIVE':string,
        'YOUR GENDER':string;
        'GENDER OF PARTNER':string;
        'EMAIL':string;
        'PASSWORD':string;
        'FIRST NAME':string;
    }        
            
interface SignupContextType{
    signupFirstData:signupFirst
    setSignupFirst:React.Dispatch<React.SetStateAction<signupFirst>> 
}
interface EmailForGotContextType{
    forgotEmail:string;
    setforgotEmail:React.Dispatch<React.SetStateAction<string>> 
}
export const SignupContext=createContext<SignupContextType|null>(null)
export const EmailForFogot=createContext<EmailForGotContextType|null>(null)
interface SignupProvider {
    children:ReactNode
}
export const  SignupProvider=({children}:SignupProvider)=>{
    const [signupFirstData,setSignupFirst]=useState<signupFirst>({"FIRST NAME":'',"SECOND NAME":'',"DATE OF BIRTH":'',"GENDER OF PARTNER":'',"DISTRICT THAT YOU LIVE":'',"YOUR GENDER":'','EMAIL':'','PASSWORD':''})
    const [forgotEmail,setforgotEmail]=useState<string>('')
    return(
        <EmailForFogot.Provider value={{forgotEmail,setforgotEmail}}>
        <SignupContext.Provider value={{signupFirstData,setSignupFirst}}>
            {children}
        </SignupContext.Provider> 
        </EmailForFogot.Provider>
    )
}
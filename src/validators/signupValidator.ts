import { CredentialInterface } from "../userPages/signup/Credentials" 
import { Dispatch,SetStateAction } from "react"
import { request } from "../utils/AxiosUtils"

export const  credential_validation=async(formData:CredentialInterface,setWarnning:Dispatch<SetStateAction<CredentialInterface>>):Promise<boolean>=>{

    if(formData['FIRST NAME']?.trim()===''||formData['FIRST NAME']===undefined){
            setWarnning(el=>({...el,['FIRST NAME']:'Blank not allowed'}))
            return false
        }else if(formData['FIRST NAME'].length>10||formData['FIRST NAME'].length<3){
                setWarnning(el=>({...el,['FIRST NAME']:'Charector should b/w 5-10'}))
                return false
            }
            if(formData['SECOND NAME']?.trim()===''||formData['SECOND NAME']===undefined){
                setWarnning(el=>({...el,['SECOND NAME']:'Blank not allowed'}))
                return false
            }else if(formData['SECOND NAME'].length<1||formData['SECOND NAME'].length>10){
                    setWarnning(el=>({...el,['SECOND NAME']:'Charector should b/w 1-10'}))
                    return false
                }else{
                    setWarnning(el=>({...el,['SECOND NAME']:''}))
                }
            if(formData['DATE OF BIRTH']){
                const birthDate=new Date(formData['DATE OF BIRTH'])
                const today=new Date();
                let age=today.getFullYear()-birthDate.getFullYear()
                const monthdiff=today.getMonth()-birthDate.getMonth()
                const dayDiff=today.getDate()-birthDate.getDate()
                if(monthdiff<0||(monthdiff===0&&dayDiff<0)){
                    --age
                }
                if(age<18||age>60){
                    setWarnning((el)=>({...el,['DATE OF BIRTH']:'Age must be between 18-60'}))
                    return false
                }
            }else{
                setWarnning((el)=>({...el,['DATE OF BIRTH']:'Blank not allowed'}))
                return false
            }
         
            
    if(formData['DISTRICT THAT YOU LIVE']?.trim()===''||formData['DISTRICT THAT YOU LIVE']===undefined){
        setWarnning(el=>({...el,['DISTRICT THAT YOU LIVE']:'please chouse an option'}))
        return false
    }else if(formData['DISTRICT THAT YOU LIVE']?.length>0){
        
       setWarnning(el=>({...el,["DISTRICT THAT YOU LIVE"]:""}))
    }
    if(formData['YOUR GENDER']?.trim()===''||formData['YOUR GENDER']==undefined){

        
        setWarnning(el=>({...el,['YOUR GENDER']:'please chouse an option'}))
        return false
    }else if(formData){
        setWarnning(el=>({...el,["YOUR GENDER"]:""}))
     }
    if(formData['GENDER OF PARTNER']?.trim()===''||formData['GENDER OF PARTNER']===undefined){
        setWarnning(el=>({...el,['GENDER OF PARTNER']:'please chouse an option'}))
        return false
    }else if(formData['GENDER OF PARTNER']?.length>0){
        
        setWarnning(el=>({...el,["GENDER OF PARTNER"]:""}))
     }
    
    
    
    if(formData['EMAIL']){
        
        
        const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isValid:boolean=emailRegex.test(formData['EMAIL'])
        if(!isValid){
            setWarnning(el=>({...el,['EMAIL']:'Insert valid email'}))
            return false
        }
        else{
            setWarnning(el=>({...el,['EMAIL']:''}))
            
        }
    }else if(formData['EMAIL']?.trim()===''||formData['EMAIL']===undefined){
        setWarnning(el=>({...el,['EMAIL']:'Insert valid email'}))
        return false
    }
    if(formData['EMAIL']){
        const isExist:{email:string|null}=await request({url:'/user/forgotEmail',method:'post',data:{email:formData['EMAIL']}})
        if(isExist?.email){
            setWarnning(el=>({...el,['EMAIL']:'Email already exist'}))
            return false
        }
    }

    
    if(formData['PASSWORD']?.trim()===''||formData['PASSWORD']===undefined){
        setWarnning(el=>({...el,['PASSWORD']:'Blank not allowed'}))
        return false
    }
    if(formData['PASSWORD']!==formData['CONFIRM PASSWORD']||formData['CONFIRM PASSWORD']===undefined){
        setWarnning(el=>({...el,['CONFIRM PASSWORD']:'passowrd not matching'}))
        return false
    }
    if(formData['PASSWORD']?.trim()!==''){
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        const test=strongPasswordRegex.test(formData['PASSWORD'])
        if(!test){
            setWarnning(el=>({...el,['PASSWORD']:'should include upper,lower,number and symbol and 8 characters'}))
       
            return false
            }
    }
    
    
    return true
}


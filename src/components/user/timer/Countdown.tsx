import React, { useContext } from 'react'
import { useTimer } from 'react-timer-hook'
import { SignupContext } from '../../../shared/globalCondext/signupData'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../utils/AxiosUtils'
import { handleAlert } from '@/utils/alert/SweeAlert'
 export interface TimerProbs{
    expiryTimeStamp:Date,
    from:string
    email?:string
    status?:boolean
}
export const Countdown:React.FC<TimerProbs> = ({expiryTimeStamp,from,email}) => {

    const navigate=useNavigate()
    const context=useContext(SignupContext)
    if(!context){
        throw new Error
    }
    // const timeRef=useRef(expiryTimeStamp)

    const {signupFirstData}=context
    const { seconds, minutes,restart}=useTimer({expiryTimestamp:expiryTimeStamp})
    async function handleRestart(from:string){
        if(from==='forgot'){
           
            restart(new Date(Date.now()+120000))
            if(email){
                try{
                    await request({url:'/user/otpCreation',method:'post',data:{email,from:'forgot'}})  
                }catch(error:unknown){
                    if(error instanceof Error){
                        handleAlert('error',error.message||'internal server error')
                    }
                }
            }else{
                
                navigate('/signup')
            }
        }else{
            
    
            restart(new Date(Date.now()+120000))
            if(signupFirstData.EMAIL){
                try{
                    await request({url:'/user/otpCreation',method:'post',data:{email:signupFirstData.EMAIL,from:'signup'}})  
                }catch(error:unknown){
                    if(error instanceof Error){
                        handleAlert('error',error.message||'internal server error')
                    }
                }
            }
            else{
                // navigate('/signup')
            }
        }
    }
    function resetProfileOtp(){
        
        alert('on top reset')
    }
   
    const singup=(<p className="font-sans font-semibold cursor-pointer text-white mt-1"><span>{minutes}:{seconds}</span><span className="pl-14" onClick={()=>handleRestart('signup')}>Resent</span></p>)
    const forgot=<p className='text-white font-aborato '>{minutes}:{seconds} <span className='pl-24 cursor-pointer' onClick={()=>handleRestart('forgot')}>RESET</span></p>
    const userProfile=<>
    <span>{minutes}:{seconds}</span>
    <span onClick={resetProfileOtp}>RESET</span>
    </>
    return (
    (from==='signup')?singup:(from==='userProfile')?userProfile:forgot
    
  )
}


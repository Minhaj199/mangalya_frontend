
import { useTimer } from 'react-timer-hook'


import { request } from '../../../utils/AxiosUtils'
import { TimerProbs } from './Countdown'
export const CountdownProfile:React.FC<TimerProbs> =({expiryTimeStamp}) => {

   
     
    
     // const timeRef=useRef(expiryTimeStamp)
 
   
 
         const { seconds, minutes,restart}=useTimer({expiryTimestamp:expiryTimeStamp})
        
        async function resetProfileOtp(){
             restart(new Date(Date.now()+120000))
             await request({url:'/user/otpRstPsword',method:'post'})
         }
        
         
         const userProfile=<>
         <span>{minutes}:{seconds}</span>
         <span className='cursor-pointer' onClick={resetProfileOtp}>RESEND</span>
         </>
         return (
     userProfile
         
       )
     
 }
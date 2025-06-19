import React, { useContext, useState } from "react"
import { IForgot_Props } from "@/types/typesAndInterfaces"
import { Countdown } from "../timer/Countdown" 
import { EmailForFogot } from "../../../shared/globalCondext/signupData"
import { useNavigate } from "react-router-dom"
import { request } from "@/utils/axiosUtil"; 
import { alertWithOk, handleAlert } from "../../../utils/alert/SweeAlert"
import CircularIndeterminate from "@/components/circularLoading/Circular"

export const Forgot_second:React.FC<IForgot_Props> = ({changeToggle}) => {
  const navigate=useNavigate()
  const contest=useContext(EmailForFogot)
    if(!contest){
      navigate('/')
      return
    }
  const {forgotEmail}=contest

  const [expiryTimeStamp]=useState<Date>(new Date(Date.now()+120000))
  const [loading,setLoading]=useState<boolean>(false)
  const [warning,setWarning]=useState('')
  const [otp,setOpt]=useState<string>('')
  function handleReset(){
    if(otp.length<0){
      setWarning('Blanke not allowed')
    }else if(otp.length>7||otp.length<6){
      setWarning('Insert 6 Charectors')
    }else{
    
      setWarning('')
      try {
        const resonse=async()=>{
          setLoading(true)
          return await request({url:'/user/otpValidation',method:'post',data:{otp,email:forgotEmail,from:'forgot'}})
        }
        resonse().then((value:unknown)=>{
          const result=value as {message:string}|false
          setLoading(false)
          if(result&&result.message&&result.message==="OTP valid"){
          changeToggle('5')
          }else if(result&&result.message&&result.message==="OTP not valid"){
            alertWithOk('Password Reset',result.message,'warning')
          }
        }).catch(()=>{
          setLoading(false)
          throw new Error('error on validation')
        })
      } catch (error:unknown) {
        if(error instanceof Error){
          handleAlert('error',error.message||'intenal server error')
        }
      }finally{
        setLoading(false)
      }
      
    }
  }
  return (
  <>
  {loading&&<div className='w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-10'>
    <CircularIndeterminate/>
  </div>}
    <div className="flex items-center flex-col h-[400px] w-[320px] sm:w-1/3 sm:h-[400px] relative sm:top-32 sm:left-96 top-28 left-8   bg-[rgba(0,0,0,0.7)]">
    <div  className=" w-full h-10 flex justify-end items-center pr-4 ">
          <p className=" text-white cursor-pointer" onClick={()=>changeToggle('3')}>X</p>
         </div>
    <p className="font-aborato text-white text-xl mt-11">
      FORGOT PASSWORD
    </p>
    <label className="font-aborato pt-10 pb-5 text-white" htmlFor="">
      ENTER OTP
    </label>
    <input
    value={otp}
    onChange={(t)=>setOpt(t.target.value)}
      type="text"
      className="block text-center  bg-transparent border w-42 border-input_dark sm:w-56 h-10 text-gray-300 pl-8"
    />
    <div>
    <p className="text-yellow-300 w-full h-10 mt-3">{warning?warning:''}</p>

    </div>
    <Countdown expiryTimeStamp={expiryTimeStamp} from="forgot" email={forgotEmail} />
    <button onClick={()=>handleReset()} className='border border-white w-20 h-10 text-white mt-10'>UPDATE</button>
  </div> 
  </>
  )
}

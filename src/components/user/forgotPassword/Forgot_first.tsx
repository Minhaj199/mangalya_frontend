
import React,{ useContext, useState} from "react"
import { request } from "@/utils/axiosUtil"  

import { EmailForFogot } from "../../../shared/globalCondext/signupData"
import CircularIndeterminate from "@/components/circularLoading/Circular"
import { handleAlert } from "@/utils/alert/SweeAlert"
import { IForgot_Props } from "@/types/typesAndInterfaces"

function validateEmail(email:string){
  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(emailRegex.test(email)){
    return true
    
  }
 return false
}


export const Forgot_first:React.FC<IForgot_Props> = ({changeToggle}) => {
  const [email,setEmail]=useState<string>('')
  const [warnning,setWarning]=useState<string>('')
  const [isLoading,setLoading]=useState(false)
  const contest=useContext(EmailForFogot)
  if(!contest){
    throw new Error('no contex')
  }
  const {setforgotEmail}=contest
  async function handle_validate():Promise<void>{
    if(validateEmail(email)){
    try {
      
      setLoading(true)
      const response:{email:string}|null=await request({url:`/user/forgotEmail?email=${email}&&from=forgot`,method:'get'})
    setLoading(false)
      if(response?.email){
        setforgotEmail(response.email)
        changeToggle('4')

      }
      
      if(!response){
        setWarning('Email not found')
      }
    } catch (error:unknown) {
      if(error instanceof Error){
        handleAlert('error',error.message||'internal server error')
      }
    }finally{
      setLoading(false)
    }
    return
   }else{
    setWarning('not valid a email')
   }
  }
  return (
    <>
    {isLoading&&<div className='w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-10'>
      <CircularIndeterminate/>
    </div>}
    <div className="flex z-40 items-center flex-col h-3/5 w-[350px] sm:w-1/3 sm:h-[350px] relative sm:top-32 sm:left-96 top-28 left-3   bg-[rgba(0,0,0,0.7)]">
         <div  className=" w-full h-10 flex justify-end items-center pr-4 ">
          <p className=" text-white cursor-pointer" onClick={()=>changeToggle('2')}>X</p>
         </div>
          <p className="font-aborato text-white text-xl mt-8">
            FORGOT PASSWORD
          </p>
          <label className="font-aborato pt-10 pb-5 text-white" htmlFor="">
            EMAIL ID
          </label>
          <input
          onChange={(t)=>setEmail(t.target.value)}
            type="text"
            className="block focus:bg-gray-400 bg-transparent  border w-42 border-input_dark sm:w-72 h-10 p-5 text-black"
          />
          <p className="text-yellow-300 w-31 h-10 mt-3">{warnning?warnning.toUpperCase():''}</p>
          <button onClick={handle_validate} className="border border-white mt-5 w-28 sm:text-base  text-sm h-10  font-aborato text-white">VALIDATE</button>
        </div>
    </>
  )
}

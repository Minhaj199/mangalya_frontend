import React, { useContext, useState } from "react"
import { Forgot_Props } from "./Forgot_first" 
import { EmailForFogot } from "../../../shared/globalCondext/signupData"
import { useNavigate } from "react-router-dom"
import { request } from "../../../utils/AxiosUtils"
import { alertWithOk, handleAlert } from "../../../utils/alert/SweeAlert"
import CircularIndeterminate from "@/components/circularLoading/Circular"

export const Forgot_Final:React.FC<Forgot_Props> = ({changeToggle}) => {
  const navigate=useNavigate()
  const contest=useContext(EmailForFogot)
    if(!contest){
      navigate('/')
      return
    }
  const {forgotEmail}=contest

  
  const [password,setPassword]=useState<string>('')
  const [confirm,confirmSetPassword]=useState<string>('')
  const [loading,setLoading]=useState<boolean>(false)
  const [warning,setWarning]=useState<{password:string,confirm:string}>({password:'',confirm:''})
  
  async function handleReset(){
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    const test=strongPasswordRegex.test(password)
    if(!test){

      setWarning({password:'password is not strong',confirm:''})
            
     
      
    }else if(confirm.trim()===''){
      setWarning({password:'',confirm:'Blank not allowed'})
    }else if(password!==confirm){
      setWarning(el=>({...el,password:'Not matching'}))
    }
    else{
   
      setWarning({password:'',confirm:""})
      try {
        setLoading(true)
        const response:{message:string}=await request({url:'/user/changePassword',method:'patch',data:{email:forgotEmail,password}})
        if(response.message){
          if(response.message==='password changed'){
            alertWithOk('Password Reset','Password changed,please try again',"info")
            changeToggle('2')
          }else{
            throw new Error(response.message)
          }
        }
        
      } catch (error:unknown) {
        if(error instanceof Error){
          handleAlert("error",error.message)
          setLoading(false) 
        }
      }
      
    }
  }
  return (
    <>
  {loading&&<div className='w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-10'>
    <CircularIndeterminate/>
  </div>}
    <div className="flex items-center  flex-col h-[400px] w-[320px] sm:w-1/3 sm:h-[400px] relative sm:top-32 sm:left-96 top-28 left-7   bg-[rgba(0,0,0,0.7)]">
    <div  className=" w-full h-10 flex justify-end items-center pr-4 ">
          <p className=" text-white cursor-pointer" onClick={()=>changeToggle('3')}>X</p>
         </div>
    <p className="font-aborato text-white text-xl mt-11">
      FORGOT PASSWORD
    </p>
    <input
    value={password}
    placeholder="PASSWORD"
    onChange={(t)=>setPassword(t.target.value)}
      type="password"
      className="block  mt-5  bg-transparent border w-42 border-input_dark sm:w-64 h-10 text-gray-300 pl-8"
    />
    <div className="w-3/5 p-3 h-12 font-inter text-gray-200 group ">
    <p className="text-sm relative">{warning.password}
    {warning.password==='password is not strong'&&<span className="absolute px-2 py-2 text-white rounded-full bg-[rgba(92,92,254)] bottom-10 hidden group-hover:flex justify-center items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">insert upper,lower,number and charecters more than 8</span>}
      
    </p>
    </div>
    <input
    placeholder="COMFIRM PASSWORD"
    value={confirm}
    onChange={(t)=>confirmSetPassword(t.target.value)}
      type="password"
      className="block   bg-transparent border w-42 border-input_dark sm:w-64 h-10 text-gray-300 pl-8"
    />
    <div className="w-3/5 p-3 h-12 font-inter text-gray-200 ">
    <p className="text-sm">{warning.confirm}</p>
    </div>
    <div>
   

    </div>
    <button onClick={()=>handleReset()} className='border border-white w-20 h-10 text-white mt-5'>UPDATE</button>
  </div> 
    </>
  )
}

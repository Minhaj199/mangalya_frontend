
import {  useState } from "react"
import { LoginValidator } from "../../../validators/loginValidator"
import { useDispatch } from 'react-redux';




import React from "react"
import { useNavigate } from "react-router-dom"
import { request } from "../../../utils/axiosUtils"
import { handleAlert } from "../../../utils/alert/SweeAlert"
 
import { LoginReponse, StateProb, UserForm, UserLoginProp } from "@/types/typesAndInterfaces";




 
export const Login:React.FC<UserLoginProp> = ({changeToggle,loginTogle,setLoading}) => {
  const dispatch=useDispatch()
 
  const data:StateProb={ 
    photo:'',
    subscriptionStatus:'',
  }  
  
  const navigate=useNavigate()
  type probs={
    email:string|null
    password:string|null
  }

  const [warning, setWarnning] = useState<probs>({email:null,password:null});
  const [userData, setUserData] = useState<UserForm>({
      email: "",
      password: "",
    });
 async function handleLogin(){

  try {
    setLoading(true)
   
    const isValid:boolean=LoginValidator({...userData},setWarnning)
    if(isValid){
    const response:LoginReponse=await request({url:'/user/login',method:'post',data:userData})
    if(response.message&&response.message==='password not matched'){
      handleAlert("error",response.message  )
      
      return
    }
    setWarnning(prev=>({...prev,password:null,email:null}))
    if(response?.message&&response.name){

      if(response.message==='user not found'){
       
       setWarnning(prev=>({...prev,email:response.message,password:null}))
      
      }
      else if(response.message==='password not matched'){
       setWarnning(prev=>({...prev,password:response.message,email:null}))
      
      }
      else if(response.message==='password matched'){
        localStorage.setItem('userToken',response.token)
        if(response.photo){
          data.photo=response.photo||''
        }
        if(response.subscriptionStatus){
          data.subscriptionStatus=response.subscriptionStatus
          dispatch({type:'SET_DATA',payload:data})
          changeToggle('1')
          handleAlert('success',`welcome ${response.name}`)
          setTimeout(()=>{
            if(response.subscriptionStatus==='Not subscribed'||response.subscriptionStatus==='connection finished'){
              navigate('/PlanDetails')
              setLoading(true)
              return
            }
            else{
              setLoading(true)
              navigate('/loginLanding')
            }
           },2000)
        }
        
      
       
      }
      return
    }
    if(response.message){
      handleAlert("error",response.message  )
      
      return
    }
    }
  
  } catch (error:unknown) {
    if(error instanceof Error){
     
      handleAlert('error',error.message||'error on login')
    }
   }
   finally{

     setLoading(false)
   }
  }

    return (
    <div
          className={
            loginTogle !== "2"
              ? "hidden"
              : " h-full w-[80%] sm:w-1/3 bg-[rgba(0,0,0,0.5)] absolute  top-0 right-0 bottom-0"
          }
        >
          <div className="w-full h-11 flex justify-end items-center">
            <h1
              onClick={() => changeToggle("1")}
              className="text-white sm:pr-8 cursor-pointer"
            >
              X
            </h1>
          </div>
          <div className="w-full h-24  flex items-center justify-center">
            <p className="font-aborato text-gray-200 text-sm sm:text-2xl font-light ">
              DOOR TO FIND YOUR PARTNER
            </p>
          </div>
          <div className="w-full h-60 p-6  ">
            <label
              htmlFor="Email"
              className="block text-white mb-4 font-aborato sm:text-lg text-sm"
            >
              EMAIL ID
            </label>
            <input
            
            onChange={(t)=>setUserData(prev=>({...prev,email:t.target.value}))}
            
              type="email"
              className=" text-white pl-5  block bg-transparent border border-[#007bff] w-[99%] sm:w-[90%] h-10 "
            />
            <p className="w-full h-10 text-yellow-300 opacity-[.7]">
              {warning.email ? warning.email : null}
            </p>
            <label
              htmlFor="password"
              className="block  text-white mb-4 font-aborato sm:text-lg text-sm"
            >
              PASSWORD
            </label>
            <input
            onChange={(t)=>setUserData(prev=>({...prev,password:t.target.value}))}
              type='password'
              className="text-white pl-5 block   bg-transparent border w-[99%] sm:w-[90%] border-[#007bff]  h-10"
            />
            
            <p className="w-full h-10  text-yellow-300 opacity-[.7]">
              {warning.password ? warning.password :null}
            </p>
          </div>
          <div  onClick={() => changeToggle("3")}  className=" cursor-pointer w-full h-8 mt-5 flex justify-end text-sm  "  >
            <p
           
              className="font-aborato text-white mr-12 sm:mr-24 cursor-pointer "
             
            >
              {"FORGOT PASSWORD ?"}
            </p>
          </div>
          <div className="w-full h-[100px]  flex justify-center items-center flex-col">
            <button onClick={handleLogin} className="w-28 h-10 border-2 border-white font-aborato text-white">
              LOGIN
            </button>
            <p className="pt-4 text-white">
              new here ?{" "}
              <span onClick={()=>navigate('/signUp')} className="hover:underline text-gray-200 cursor-pointer">
                sign up for free
              </span>
            </p>
          </div>
        </div>
  )
}

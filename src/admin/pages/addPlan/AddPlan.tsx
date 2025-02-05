import React, { useEffect, useState } from 'react'

import './planMgt.css'
import { PlanValidator } from '../../../validators/planValidator'
import { alertWithOk, handleAlert } from '../../../utils/alert/SweeAlert'
import { request } from '../../../utils/AxiosUtils'
import { useNavigate } from 'react-router-dom'
import { capitaliser } from '../../../utils/firstLetterCapitaliser'
export type planMgtWarningType={

    name:string
    amount:string
    connect:string
    duration:string
}
export type PlanData={
    name:string;
    amount:number;
    connect:number;
    duration:number
}


export const AddPlan = () => {
    const navigate=useNavigate()
    
    const [featureData,setFeatureData]=useState<string[]>([''])
    
    useEffect(()=>{
       async function fetchFeature(){
            const response:{features:string[]}=await request({url:'/admin/fetchFeature'})
            setFeatureData(response.features)
            
        }
        fetchFeature()
    },[])
    const [warning,setWarning]=useState<planMgtWarningType>({amount:'',connect:'',duration:'',name:''})
    const [datas,setDatas]=useState<PlanData>({amount:0,connect:0,name:'',duration:0})
    const months=Array.from({length:36},(_,index)=>index+1)
    const [handleFeatureState,setHandleFeature]=useState<string[]>([])
    

    const handleFeature=(t:React.ChangeEvent<HTMLSelectElement>)=>{
        
        if(!handleFeatureState.includes(t.target.value)&&t.target.value!=='')
        setHandleFeature(el=>[...el,t.target.value])
   
    }
    function handleClose(item:string){
        setHandleFeature(el=>el.filter(el=>el!==item))
    }
    
    const handleNameChange=(t:React.ChangeEvent<HTMLInputElement>)=>{
         setDatas(el=>({...el,name:capitaliser(t.target.value)}))
    }
   async function handleSubmit(){
        
        if(PlanValidator(datas,setWarning,handleFeatureState)){
            try {
                const response:{status:unknown,message:string,name:string}=await request({url:'/admin/insertPlan',method:'post',data:{datas,handleFeatureState}})
                console.log(response)
                if(response?.message&&response?.name){
                   if(response.name==='authentication failed'){
                   throw new Error(response?.name)
                   }else{
                    throw new Error(response?.message)
                   }

                }else if(response.message){
                    throw new Error(response.message)
                }

                else if(typeof response.status==='object'){
                    handleAlert('success','Plan Added')
                    navigate('/admin/Plan')
                }
                
            } catch (error:unknown) {
                
                if(error instanceof Error){
                     if(error.message==='405'){
                              navigate('/login')
                              return
                            }
                              alertWithOk('Dash error',error.message||'error on dash','error')
                    alertWithOk('Plan insertion',error.message||'Error occured','error')
                }else{
                    alertWithOk('Plan insertion','Error occured','error')
                }
            }
        }
        
        
    }
  return (
    <div className='w-[90%]  h-svh '>

    <div className='w-full lg:mt-0 mt-10 h-full '>
        <div className='w-full md:h-10 h-12 px-6 md:py-0 py-4  cursor-pointer  '>
            <div className='w-10 h-10 '>
            <img onClick={()=>navigate('/admin/Plan')} src="/backPlan.png" className="h-full w-full" alt="" />
            </div>
            
        </div>
        <div className='w-full h-[90%]  md:ml-0 ml-5 flex justify-center items-center'>
            <div className='md:w-[40%] w-[100%]  sm:w-[90%]  sm:h-[95%] h-[84%] rounded-3xl border shadow-3xl shadow-theme-blue bg-white sm:px-10 px-5 items-center flex flex-col'>
                <h1 className='font-bold text-2xl text-dark-blue mt-2 mb-5'>ADD PLAN</h1>
                <div className='sm:w-[100%] w-[100%] h-[15%] sm:h-[20%]     justify-between mb-2'>
                    <label htmlFor="" className='block font-inter font-bold md:text-base text-sm text-dark-blue'>NAME</label>


                    <input id='name' onChange={(t)=>handleNameChange(t)} type="text" value={datas.name} className=' w-[90%]  text-sm  outline-none' />
                    
                    
                    
                    
                    {/* <input type="text" className='border border-black focus:border-blue-500 'placeholder='type hear' /> */}
                    <p className='mt-1 sm:text-base text-xs'>{warning.name}</p>

                </div>
                <div className='w-[100%] h-[20%]  flex justify-between'>
                    <div className='w-[33%] h-full  '>
                    
                        <label className='text-dark-blue font-bold sm:text-base text-xs'>AMOUNT</label>
                        <input id='amount' onChange={(t)=>setDatas(el=>({...el,amount:parseInt( t.target.value)||0}))} value={(datas.amount===0)?'':datas.amount} type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} />
                        <p className='mt-1 sm:text-base text-xs'>{warning.amount}</p>
                    
                    </div>
                    <div className='w-[33%] h-full '>
                    <label className='text-dark-blue font-bold sm:text-base text-xs'>CONNECTION</label>
                        <input onChange={(t)=>setDatas(el=>({...el,connect:parseInt( t.target.value)||0}))} value={(datas.connect===0)?'':datas.connect} id='amount' type="number" className='mt-1 w-[80%] outline-none'min={1} max={10000} />
                        <p className='mt-1 sm:text-base text-xs '>{warning.connect}</p>
                    </div>
                    <div className='w-[33%] h-full'>
                    <label className='text-dark-blue font-bold sm:text-base text-xs'>DURATION</label>
                        {/* <input id='amount' type="number" className='mt-1 w-[60%] outline-none'min={1} max={10000} /> */}
                        <select defaultValue={datas.duration} onChange={(t)=>setDatas(el=>({...el,duration:parseInt(t.target.value)||0}))} className='h-8 outline-none border-b border-theme-blue' name="" id="">
                           <option value="" >Month</option>
                           {months.map((el,index)=> <option key={index} value={el}>{el} month</option>)}
                          
                        </select>
                        <p className='mt-1 sm:text-base  text-xs'>{warning.duration}</p>
                    </div>
                </div>
                <div className='w-full h-10  mb-2'>
                    <select onChange={handleFeature} className='w-[40%] outline-none rounded-xl sm:h-[80%] h-[50%] sm:text-base text-xs bg-dark-blue text-white' name="features" id="">
                    <option value="">Features</option>
                       {featureData?.map(el=>(<option value={el}>{el}</option>))}
                        

                    </select>
                </div>
                <div className='w-[100%] h-[30%] bg-gray-400'>
                    
                {handleFeatureState.map((el,index)=>(
                        <div key={index} className='w-full h-[20%] mt-2 bg-dark-blue  flex'>
                       
                        <div className='w-[90%] h-full flex  items-center text-white px-2 '>
                            
                            <p >{index+1}.<span className='pl-2'>{el}</span></p>
                        </div>
                        <div onClick={()=>handleClose(el)} className='w-[10%] h-full text-center text-white font-black'>
                            X
                        </div>
                    </div>    
                        ))}
                    
                </div>
                <button onClick={handleSubmit} className='border-2 border-dark-blue text-dark-blue mt-2 w-[30%] h-[6%] font-bold  rounded-xl'>SUBMIT</button>
            </div>
        </div>
    </div>
    </div>
  )
}

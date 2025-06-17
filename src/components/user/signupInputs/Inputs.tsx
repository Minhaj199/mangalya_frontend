

import React, { Dispatch,SetStateAction } from 'react'
import { CredentialInterface } from '@/types/typesAndInterfaces' 
import { Validator_ } from '../../../validators/liveValidator' 
import { capitaliser } from '../../../utils/firstLetterCapitaliser'


interface InputsProbs{
  inputFields:{
    linkingName:string,
    inputType:string,
    inputName:string,
    option?:string[]
    

  }[],
  setCredentialData:Dispatch<SetStateAction<CredentialInterface>>
  setWarnning:Dispatch<SetStateAction<CredentialInterface>>,
  CredentailData:{[key:string]:string},
  Warning:{[key:string]:string}
}

export const Inputs:React.FC<InputsProbs> = ({inputFields,setCredentialData,setWarnning,CredentailData,Warning}) => {
  function handleChange(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>,field:string){
    if(field==='CONFIRM PASSWORD'){
      const value=e.target.value
      setCredentialData(prev=>({...prev,[field]:value}))
      Validator_(setWarnning,field,value,CredentailData['PASSWORD'])
      return
    }
    let value=e.target.value
    if(field==='FIRST NAME'&&e.target.value){
      value=capitaliser(e.target.value)
    }
    setCredentialData(prev=>({...prev,[field]:value}))
    Validator_(setWarnning,field,value)
   
  }
  
  return (<>
    {inputFields.map((fields,index)=>{
      return(
        <div className=' sm:w-4/5 flex flex-col ' key={index}>
          <label htmlFor={fields.linkingName} className="text-white text-xs sm:text-base block   w-full">{fields.inputName}</label>
      {(fields.inputType!=='dropDown')?
      <input  type={fields.inputType} onChange={(t)=>handleChange(t,fields.inputName)} value={CredentailData[fields.inputName]} id={fields.linkingName} className="w-full font-serif   border  border-theme-blue  outline-none h-9 block pl-3" />:
      <select className='w-full    border  border-theme-blue  outline-none h-9  block pl-3' value={CredentailData[fields.inputName]} onChange={(t)=>setCredentialData(prev=>({...prev,[fields.inputName]:t.target.value}))} id={fields.linkingName}>
        <option value=''>SELECT</option>
        {fields.option?.map((el,index)=>{
          return(
            <>
            <option value={el} key={index}>{el}</option>
            </>
          )
        })}
      </select>
      }
      
          <p className="text-white   text-xs mt-2   ">{Warning[fields.inputName]?Warning[fields.inputName]:''}</p>
        </div>
      )
    })}
  </>
  )
}

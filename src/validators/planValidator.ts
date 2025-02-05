import { Dispatch,SetStateAction } from "react";
import { PlanData, planMgtWarningType } from "../admin/pages/addPlan/AddPlan";
import { alertWithOk, handleAlert } from "../utils/alert/SweeAlert";
import { PlanType } from "../admin/pages/planMgt/PlanMgt";


export type PlanDataForValidation={
    name:string;
    amount:number|string;
    connect:number|string;
    duration:number
}
export function PlanValidator(planData:PlanData|PlanType,setWarning:Dispatch<SetStateAction<planMgtWarningType>>,handleFeatureState:string[]):boolean{
   let state=true
    const planDatas=planData as PlanDataForValidation
    if(planData.name.trim()===''){
        setWarning(el=>({...el,name:'Blank not allowed'}))
        state= false
    }else if(planData.name.length>10||planData.name.length<3){
        setWarning(el=>({...el,name:'Name should b/w 3-10'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,name:''}))
    }
    if(NaN||planDatas.amount===''||typeof planData.amount==='number'&&planData.amount===0){
        
        setWarning(el=>({...el,amount:'insert Amt'}))
        state= false
    }
    else if(typeof planDatas.amount==='number'&&planDatas.amount>=10000){
        setWarning(el=>({...el,amount:'!more than 10000'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,amount:''}))
    }
    if(planData.connect<=0||''){
        setWarning(el=>({...el,connect:'!insert number'}))
        state= false
    }else if(planData.connect>1000){
        setWarning(el=>({...el,connect:'!more than 1000'}))   
        state= false
    }
    else{
        setWarning(el=>({...el,connect:''}))
    }
    if(planData.duration===0){
        setWarning(el=>({...el,duration:'!Blank'}))
        state=false
    }else{
        setWarning(el=>({...el,duration:''}))
    }
    if(!handleFeatureState.length){
        alertWithOk('Features','Please insert featurs',"info")
        state=false 
    }
    return  state
}
export function editedDataValidateion(planData:any,originalData:any,setWarning:Dispatch<SetStateAction<planMgtWarningType>>,handleFeatureState:string[]){
    const finalData:{[key:string]:any}={}
     Object.keys(planData).forEach((key: string) => {
        const planValue = planData[key];
        const originalValue = originalData[key];
        if (Array.isArray(planValue)&&planValue.length!==0 && Array.isArray(originalValue)&&planValue.length!==0) {
            if (JSON.stringify(planValue) !== JSON.stringify(originalValue)){
                finalData[key]=planData[key]
            }
        }
       
        if(typeof planValue==='string'&&planValue?.trim()!==''&&planValue !== originalValue){
            finalData[key]=planData[key]
        }
        if(typeof planValue==='number'&&planValue!==0&&planValue !== originalValue){
            finalData[key]=planData[key]
        }
    })
        if(Object?.keys(finalData).length<=0){
            handleAlert('info','Not dictected any change')
            return {validation:false}
        }        
    
    const planDatas=planData as PlanDataForValidation
    
     if(planData.name&&planData.name.length>10||planData.name&&planData.name.length<3){
        setWarning(el=>({...el,name:'Name should b/w 3-10'}))   
        return {validation:false}
    }
    else{
        setWarning(el=>({...el,name:''}))
    }
    if(planDatas.amount&&NaN||planDatas.amount&&planDatas.amount===''||planDatas.amount&&typeof planData.amount==='number'&&planData.amount===0){
        
        setWarning(el=>({...el,amount:'insert Amt'}))
        return {validation:false}
    }
    else if(planData.amount&&typeof planDatas.amount==='number'&&planDatas.amount>=10000){
        setWarning(el=>({...el,amount:'!more than 10000'}))   
        return {validation:false}
    }
    else{
        setWarning(el=>({...el,amount:''}))
    }
    if(planData.connect&&planData.connect<=0||''){
        setWarning(el=>({...el,connect:'!insert number'}))
        return {validation:false}
    }else if(planData.connect&&planData.connect>1000){
        setWarning(el=>({...el,connect:'!more than 1000'}))   
        return {validation:false}
    }
    else{
        setWarning(el=>({...el,connect:''}))
    }
    if(planData.duration&&planData.duration===0){
        setWarning(el=>({...el,duration:'!Blank'}))
        return {validation:false}
    }else{
        setWarning(el=>({...el,duration:''}))
    }
    finalData['_id']=originalData._id
    return {finalData,validation:true}

}
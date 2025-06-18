
import { IFindChange } from "@/types/typesAndInterfaces";
import { dateToDateInputGenerator } from "./dateToDateInputGenerator"; 

export function editedDataFinder({dataToFind,orginalData}:IFindChange){ 
       if(dataToFind.PersonalInfo.firstName===orginalData.PersonalInfo.firstName){
           dataToFind.PersonalInfo.firstName=''
    }
    if(dataToFind.PersonalInfo.secondName===orginalData.PersonalInfo.secondName){
        dataToFind.PersonalInfo.secondName=''
    }
    if(dataToFind.PersonalInfo.gender===orginalData.PersonalInfo.gender){
        dataToFind.PersonalInfo.gender=''
    }
    if(dataToFind.PersonalInfo.state===orginalData.PersonalInfo.state){
        dataToFind.PersonalInfo.state=''
    }
    if(dataToFind.PersonalInfo.interest?.length===0 && orginalData.PersonalInfo.interest?.length===0){
        dataToFind.PersonalInfo.interest=null
    }
            if(dataToFind.PersonalInfo.interest?.length&&dataToFind.PersonalInfo.interest?.length>0&&dataToFind.PersonalInfo.interest?.length&&dataToFind.PersonalInfo.interest?.length>0
                &&dataToFind.PersonalInfo.interest.length===orginalData.PersonalInfo.interest.length
            ){
             
                const sortedArr1 = [...dataToFind.PersonalInfo.interest]?.sort();
                const sortedArr2 = [...orginalData.PersonalInfo.interest]?.sort();
                if( sortedArr1?.every((value, index) => value === sortedArr2[index])){
                    dataToFind.PersonalInfo.interest=null
                   
                }
            }                
        if(dateToDateInputGenerator('intoInput',new Date (dataToFind.PersonalInfo.dateOfBirth).toDateString())===dateToDateInputGenerator ('intoInput',new Date(orginalData.PersonalInfo.dateOfBirth).toDateString())){
            dataToFind.PersonalInfo.dateOfBirth=''

        }
        if(dataToFind.partnerData.gender===orginalData.PartnerData.gender){
            dataToFind.partnerData.gender=''
        }
        if(dataToFind.email===orginalData.Email){
           dataToFind.email=''            
        }
        
       return dataToFind
  
}
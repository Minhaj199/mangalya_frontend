import { Dispatch, SetStateAction } from "react";
import { UserData } from "@/types/typesAndInterfaces";
import { showToast } from "../utils/alert/toast";
import { alertWithOk, handleAlert } from "@/utils/alert/SweeAlert";
import { request } from '../utils/axiosUtils'
import { EditWarning } from "@/types/typesAndInterfaces";


export async function validateEditedData(
  editedData: UserData,
  setFormWaring: Dispatch<SetStateAction<EditWarning>>
) {
  let count = 0;
  setFormWaring({
    firstName: "",
    secondName: "",
    state: "",
    dob: "",
    email: "",
  });
  if (editedData.PersonalInfo.firstName.trim() !== "") {
    if (
      editedData.PersonalInfo.firstName.trim().length > 10 ||
      editedData.PersonalInfo.firstName.trim().length < 3
    ) {
      setFormWaring((el) => ({
        ...el,
        firstName: "First name should be between 3-10",
      }));
      count++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("First name should be between 3-10 ", "info");
    }
  }
  if (editedData.PersonalInfo.secondName.trim() !== "") {
    if (
      editedData.PersonalInfo.secondName.trim().length > 10 ||
      editedData.PersonalInfo.secondName.trim().length < 1
    ) {
      setFormWaring((el) => ({
        ...el,
        secondName: "Second name should be between 3-10",
      }));
      count++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Second name should be between 3-10", "info");
    }
  }
  if (editedData.PersonalInfo.dateOfBirth !== "") {
    const birthDate = new Date(editedData.PersonalInfo.dateOfBirth);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthdiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthdiff < 0 || (monthdiff === 0 && dayDiff < 0)) {
      --age;
    }
    if (age < 18 || age > 60) {
      setFormWaring((el) => ({ ...el, dob: "Age must be between 18-60" }));
      count++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Age must be between 18-60", "info");
      return false;
    }
  }
  if(editedData.email.trim()!==''){
    
    try {
       const isExist:{email:string|null}=await request({url:'/user/forgotEmail',method:'post',data:{email:editedData.email}})
       if(isExist.email){
        setFormWaring((el) => ({ ...el, email: "Email already exist" }));
      count++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Email already exist", "info");
      return false;
      }
      } catch (error:unknown) {
      if(error instanceof Error){
        handleAlert('error',error.message)
      }
    }
  }

  if (editedData.email.trim() !== "") {
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid: boolean = emailRegex.test(editedData.email);
    if (!isValid) {
      setFormWaring((el) => ({ ...el, email: "Email not valid" }));
      count++;
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Email not valid", "info");
      return false;
    }
  }

  /////////////////dittect made any change////////////////
  const isEmpty = checkEmpty(editedData);
  if (isEmpty) {
    alertWithOk("Data updation", "No data change found ", "info");

    return;
  }

  return count === 0 && !isEmpty;
}

function checkEmpty(editedData: UserData) {
   
  if (editedData.PersonalInfo.firstName?.trim() !== "") {
    return false; ///
  } else if (editedData.PersonalInfo.secondName?.trim() !== "") {
    return false; //
  } else if (editedData.PersonalInfo.gender?.trim() !== "") {
    return false; ////
  } else if (editedData.PersonalInfo.image !== "") {
    return false; ///
  } else if (editedData.PersonalInfo.interest !== null) {
    return false; //
  } else if (editedData.PersonalInfo.dateOfBirth !== "") {
    return false; //
  } else if (editedData.PersonalInfo.state !== "") {
    return false; //
  } else if (editedData.email !== "") {
    return false;
  } else if (editedData.partnerData.gender !== "") {
    return false;
  } else {
    return true;
  }
}

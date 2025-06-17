import { Dispatch, SetStateAction } from "react";

import { alertWithOk, handleAlert } from "../utils/alert/SweeAlert";
import { PlanDataForValidation, PlanType } from "@/types/typesAndInterfaces"; 
import {
  PlanValidation,
  PlanDatas,
  PlanMgtWarningType,
} from "@/types/typesAndInterfaces";


export function PlanValidator(
  planData: PlanDatas | PlanType,
  setWarning: Dispatch<SetStateAction<PlanMgtWarningType>>,
  handleFeatureState: string[]
): boolean {
  let state = true;
  const planDatas = planData as PlanDataForValidation;
  if (planData.name.trim() === "") {
    setWarning((el) => ({ ...el, name: "Blank not allowed" }));
    state = false;
  } else if (planData.name.length > 10 || planData.name.length < 3) {
    setWarning((el) => ({ ...el, name: "Name should b/w 3-10" }));
    state = false;
  } else {
    setWarning((el) => ({ ...el, name: "" }));
  }
  if (
    NaN ||
    planDatas.amount === "" ||
    (typeof planData.amount === "number" && planData.amount === 0)
  ) {
    setWarning((el) => ({ ...el, amount: "insert Amt" }));
    state = false;
  } else if (
    typeof planDatas.amount === "number" &&
    planDatas.amount >= 10000
  ) {
    setWarning((el) => ({ ...el, amount: "more than 10000!" }));
    state = false;
  } else if (typeof planDatas.amount === "number" && planDatas.amount < 100) {
    setWarning((el) => ({ ...el, amount: "less thant 100 !" }));
    state = false;
  } else {
    setWarning((el) => ({ ...el, amount: "" }));
  }
  if (planData.connect <= 0 || "") {
    setWarning((el) => ({ ...el, connect: "insert number !" }));
    state = false;
  } else if (planData.connect > 1000) {
    setWarning((el) => ({ ...el, connect: "more than 1000 !" }));
    state = false;
  } else {
    setWarning((el) => ({ ...el, connect: "" }));
  }
  if (planData.duration === 0) {
    setWarning((el) => ({ ...el, duration: "Blank!" }));
    state = false;
  } else {
    setWarning((el) => ({ ...el, duration: "" }));
  }
  if (!handleFeatureState.length) {
    alertWithOk("Features", "Please insert featurs", "info");
    state = false;
  }
  return state;
}

export function editedDataValidateion(
  planDatas: unknown,
  originalDatas: unknown,
  setWarning: Dispatch<SetStateAction<PlanMgtWarningType>>
) {
  const finalData: { [key: string]: string|boolean|Date|string[] } = {};
  const planData=planDatas as PlanValidation
  const originalData=originalDatas as PlanValidation
  Object.keys(planData).forEach((key) => {
    const typedKey = key as keyof PlanValidation;
    
    const planValue = planData[typedKey];
    const originalValue = originalData[typedKey];
    if (Array.isArray(planValue)&& planValue.length !== 0 &&Array.isArray(originalValue) &&planValue.length !== 0) {
      if (JSON.stringify(planValue) !== JSON.stringify(originalValue)) {
        if(typedKey==='features'&&isStringArray(planData[typedKey]))
        finalData[typedKey] =  planData[typedKey];
      }
    }
   
    if (typeof planData[typedKey] === "string" &&planData[typedKey]?.trim() !== "" &&planValue !== originalValue
    &&typedKey==='name') {

      finalData[typedKey] = planData[typedKey];
    }
    if (
      typeof planData[typedKey] === "number" &&
      planData[typedKey] !== 0 &&
      planValue !== originalValue
    ) {
      finalData[typedKey] = planData[typedKey];
    }
  });
  if (Object?.keys(finalData).length <= 0) {
    handleAlert("info", "Not dictected any change");
    return { validation: false };
  }

 

  if (
    (planData['name']&&typeof planData['name']==='string' && planData['name'].length > 10) ||
    (planData.name,planData['name']&&typeof planData['name']==='string' && planData.name.length < 3)
  ) {
    setWarning((el) => ({ ...el, name: "Name should b/w 3-10" }));
    return { validation: false };
  } else {
    setWarning((el) => ({ ...el, name: "" }));
  }
  if (
    (planData['amount'] && NaN) ||
    (planData['amount'] && planData['amount'] === "") ||
    (planData.amount &&
      typeof planData.amount === "number" &&
      planData.amount === 0)
  ) {
    setWarning((el) => ({ ...el, amount: "insert Amt" }));
    return { validation: false };
  } else if (
    planData.amount &&
    typeof planData['amount'] === "number" &&
    planData['amount'] >= 10000
  ) {
    setWarning((el) => ({ ...el, amount: "more than 10000 !" }));
    return { validation: false };
  } else if (
    planData.amount &&
    typeof planData['amount'] === "number" &&
    planData.amount < 100
  ) {
    setWarning((el) => ({ ...el, amount: "Less than 100!" }));
    return { validation: false };
  } else {
    setWarning((el) => ({ ...el, amount: "" }));
  }
  if ((planData['connect'] &&typeof planData['connect']==='number'&&planData['connect'] <= 0) || "") {
    setWarning((el) => ({ ...el, connect: "insert number !" }));
    return { validation: false };
  } else if (planData['connect'] &&typeof planData['connect']==='number' && planData.connect > 1000) {
    setWarning((el) => ({ ...el, connect: "more than 1000 !" }));
    return { validation: false };
  } else {
    setWarning((el) => ({ ...el, connect: "" }));
  }
  if (planData['duration'] &&typeof planData['duration']==='number'&&planData.duration === 0) {
    setWarning((el) => ({ ...el, duration: "Blank !" }));
    return { validation: false };
  } else {
    setWarning((el) => ({ ...el, duration: "" }));
  }
  finalData["_id"] = originalData._id;
  return { finalData, validation: true };
}

/////////////////// type guard/////////////

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}
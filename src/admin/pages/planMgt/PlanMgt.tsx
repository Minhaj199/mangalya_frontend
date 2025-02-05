import React, { useEffect, useState } from "react";
import "./plan.css";
import { request } from "../../../utils/AxiosUtils";
import { useNavigate } from "react-router-dom";
import {
  alertWithOk,
  handleAlert,
  promptSweet,
} from "../../../utils/alert/SweeAlert";

import { planMgtWarningType } from "../addPlan/AddPlan";
import { editedDataValidateion} from "../../../validators/planValidator";
import { capitaliser } from "../../../utils/firstLetterCapitaliser";

export type PlanType = {
  _id: string;
  name: string;
  delete: boolean;
  duration: number;
  features: string[];
  amount: number;
  connect: number;
};

export const PlanDetails = () => {
  const [featureData,setFeatureData]=useState<string[]>([''])
    
    useEffect(()=>{
       async function fetchFeature(){
            const response:{features:string[]}=await request({url:'/admin/fetchFeature'})
            setFeatureData(response.features)
            
        }
        fetchFeature()
    },[]) 
  const [warning, setWarning] = useState<planMgtWarningType>({
    amount: "",
    connect: "",
    duration: "",
    name: "",
  });
  const navigate = useNavigate();
  const [editData, setEditData] = useState<PlanType>({
    _id: "",
    amount: 0,
    connect: 0,
    delete: true,
    duration: 0,
    features: [""],
    name: "NO PLANS",
  });
  const [originalData, setOriginalData] = useState<PlanType>({
    _id: "",
    amount: 0,
    connect: 0,
    delete: true,
    duration: 0,
    features: [""],
    name: "NO PLANS",
  });
  const months = Array.from({ length: 36 }, (_, index) => index + 1);
  const [toggle, setToggle] = useState<boolean>(true);
  const [datas, setData] = useState<PlanType[]>([
    {
      _id: "",
      amount: 0,
      connect: 0,
      delete: true,
      duration: 0,
      features: [""],
      name: "NO PLANS",
    },
  ]);
  const [currentData, setCurrentData] = useState<PlanType>({ _id: "",
    amount: 0,
    connect: 0,
    delete: true,
    duration: 0,
    features: [""],
    name: "no plan"});

  let dataDB:{message:string,plans:PlanType[]};
  useEffect(() => {
    async function fetchPlanData() {
      try {
        dataDB = await request({ url: "/admin/fetchPlanData" });
      if(dataDB.message&&typeof dataDB.message==='string'){
        alertWithOk('Validation',dataDB.message||'Validation faild','info')
        navigate('/login')
      }
      setData(dataDB.plans);
      } catch (error:any) {
         if(error.message==='405'){
                  navigate('/login')
                  return
                }
                  alertWithOk('Plan Management',error.message||'error on dash','error')
      }
      
    }
    fetchPlanData();
  }, []);
  useEffect(() => {
    if (datas) {
      setCurrentData(datas[0]);
    }
  }, [datas]);

  useEffect(() => {
    if (!toggle && currentData) {
      setEditData(currentData);
      setOriginalData(currentData)
      
    } else if (toggle) {
      setEditData({
        _id: "",
        amount: 0,
        connect: 0,
        delete: false,
        duration: 0,
        features: [""],
        name: "",
      });
    }
  }, [toggle]);
  async function handleRemovePlan(id: string, name: string) {
    await promptSweet(
      deletePlan,
      `Do you want to remove ${name} plan ?`,
      `plan ${name} removed`
    );
    async function deletePlan() {
      try {
        const response: { response: boolean; message: string } = await request({
          url: "/admin/removePlan",
          method: "patch",
          data: { id: id },
        });
        if (response.response) {
          setData((el) => el.filter((elem) => elem._id !== id));
          if (currentData?._id === id) {
            setCurrentData(datas[0]);
          }
          handleAlert("success", "Plan removed");
        } else {
          throw new Error(response.message);
        }
        console.log(response);
      } catch (error: any) {
        if(error.message==='405'){
          navigate('/login')
          return
        }
          
        alertWithOk(
          "Plan Remove",
          error.message || "Error occured on deleting",
          "error"
        );
      }
    }
  }
  function manageBtwAddEdit(action: "Edit" | "Details", id: unknown) {
    if (typeof id === "string") {
      if (action === "Edit") {
        if (datas) {
          const singleData = datas.filter((elem) => elem._id === id);
          if (singleData.length && singleData) {
            setCurrentData(singleData[0]);
          }
        } else {
        }
        setToggle(false);
      }
    } else {
      handleAlert("error", "Error occured");
    }
  }
  function handleClose(el: string) {
    setEditData((datas) => {
      return {
        ...datas,
        features: datas.features.filter((element) => element !== el),
      };
    });
  }
  function changeOnfeature(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!editData.features.includes(e.target.value)) {
      setEditData((el) => ({
        ...el,
        features: [...el.features, e.target.value],
      }));
    }
  }

  
const handleNameChange=(t:React.ChangeEvent<HTMLInputElement>)=>{
  setEditData(el=>({...el,name:capitaliser(t.target.value)}))
}


  async function handleSubmission() {
    const processedData:{finalData?:{[key:string]:any},validation:boolean}=editedDataValidateion(editData,originalData,setWarning, editData.features)
    if (processedData.validation) {
      try {
        const response: { response: true; message: string } = await request({
          url: "/admin/editPlan",
          method: "put",
          data: processedData.finalData,
        });
        console.log(response);
        if (response.response) {
          setData((el) =>
            el.map((element) =>
              element._id === editData._id ? editData : element
            )
          );
          setCurrentData(editData);
          setEditData({
            _id: "",
            amount: 0,
            connect: 0,
            delete: true,
            duration: 0,
            features: [""],
            name: "NO PLANS",
          });
          setToggle(true);
          alertWithOk("Plan Edit", "Plan edited successfully", "success");
        } else {
          
          throw new Error(response.message);
        }
      } catch (error: any) {
        if(error.message==='405'){
          navigate('/login')
          return
        }
          
        alertWithOk(
          "Plan Edit",
          error.message || "Error occured on editing",
          "error"
        );
      }
    }
  }
  return (
    <div className="md:w-[80%] overflow-hidden  h-svh">

    <div className="w-full h-full lg:mt-0 mt-10  overflow-hidden ">
      

      
        <div className="w-full h-[25%]  flex justify-center items-center">
          
          {!toggle && (
        <div className="w-24   h-20 font-bold cursor-pointer flex justify-center items-center">
          <div onClick={() => setToggle(true)} className="w-10 h-10 ">
              <img src="/backPlan.png" className="h-full w-full" alt="" />
          </div>
         
        </div>
      )}

          <div className={toggle?" w-[90%] h-5/6 drop-shadow-lg bg-white transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg flex justify-between items-center":" w-[90%] h-5/6 drop-shadow-lg bg-white  rounded-lg flex justify-between items-center"}>
            <p className=" ml-5 font-extrabold sm:text-base text-xs  font-inter text-dark-blue">
              PLAN MANAGEMENT
            </p>
            <button
            onClick={()=>navigate('/admin/addPlan')}
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              ADD PLAN
            </button>
          </div>

          
        </div>
     

      {toggle&& <div  className="w-[100%]  h-[70%]   ">
        <div className="w-full h-[15%]   flex justify-center items-start">
          <p className="font-inter font-extrabold  text-theme-blue sm:text-2xl">
            AVAILABLE PLAN
          </p>
        </div>
        <div className="w-[90%] ml-10 h-[85%]  flex justify-start p-1  overflow-x-auto  no-scrollbar">
          <div className="flex space-x-4 ">
            
            {datas.map((el,index)=>{
              return(
                <div
              key={index}

              className= "ml-5 sm:w-64 w-44 rounded-xl h-[80%] sm:h-[90%] hover:bg-[#000080] drop-shadow-xl  bg-dark-blue mr-2"
            >
              <div  className=" w-[90%] h-[10%] text-end rounded-full font-bold text-white text-lg">
                <p onClick={()=>handleRemovePlan(el._id,el.name)}>
                X
                </p>
                
              </div>
              <div  className=" w-[100%]  rounded-xl h-[90%] font-inter     text-white text-lg">
               <div className="flex justify-center w-full  h-[15%] ">
                <p className="sm:text-2xl text-base font-bold">{el.name}</p>
               </div>
               <div className="flex justify-center w-full   h-[20%]">
                <div className="h-full w-1/3  text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px]">Duration</span>
                  {el.duration}
                </div>
                <div className="h-full w-1/3  text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px] ">Connect</span>
                  {el.connect}
                </div>
                <div className="h-full w-1/3 text-center pt-1 sm:text-base text-[9px]">
                <span className="block sm:text-sm text-[10px]">Amount</span>
                 {el.amount}
                </div>
               </div>
               <div className="w-full sm:h-36 h-32 text-sm ">
                <ul className="p-2 flex flex-col h-full justify-around  items-center sm:text-[15px] text-[10px]">
                  {el.features.map((elem,indexOfFeatur)=> <li key={indexOfFeatur}>{elem}</li>)} 
                </ul>
               </div>
               <div className=" w-full h-[15%] flex justify-center items-end  ">
              <button onClick={()=> manageBtwAddEdit("Edit",el._id)} className="bg-white text-blue-600 w-16 rounded-full text-sm font-serif" >EDIT</button>
               </div>
              </div>
            </div>
              )
            })}
            
            
          </div>
        </div>
      </div> }
    
    
    
      <div className="w-[100%] h-[75%]   flex justify-center items-center">
      {!toggle && currentData && (
      <div className="sm:w-[60%] bg w-[95%] sm:h-[98%] md:w-[40%]  h-[90%] rounded-3xl shadow-3xl shadow-theme-blue border-b-2 bg-white sm:px-10 px-3 items-center flex flex-col">
   
      <div className="h-full w-full justify-center flex flex-col items-center">
        <h1 className="font-bold text-2xl text-theme-blue mt-2 mb-5">EDIT</h1>
        <div className="w-[100%] h-[15%] justify-between mb-2">
          <label htmlFor="name" className="block font-inter font-bold text-dark-blue">
            NAME
          </label>
          <input
            id="name"
           
            value={editData.name}
            onChange={(t) =>handleNameChange(t)}
            type="text"
            className="w-[90%] border-b border-theme-blue outline-none text-gray-700"
          />
          <p className="mt-1">{warning.name || ""} </p>
        </div>
        <div className="w-[100%] h-[17%]   mb-2 flex justify-between">
          <div className="w-[33%] h-full">
            <label className="text-dark-blue font-bold">AMOUNT</label>
            <input
              onChange={(t) => setEditData((el) => ({ ...el, amount: parseInt(t.target.value) || 0 }))}
              id="amount"
              value={editData.amount}
              type="number"
              className="mt-1 w-[60%] outline-none border-b border-theme-blue text-gray-700"
              min={1}
              max={10000}
            />
            <p className="mt-1">{warning.amount || ""}</p>
          </div>
          <div className="w-[33%] h-full ">
            <label className="text-dark-blue font-bold">CONNECT</label>
            <input
            
              value={editData.connect}
              onChange={(t) => setEditData((el) => ({ ...el, connect: parseInt(t.target.value) || 0 }))}
              type="number"
              className="mt-1 w-[80%] outline-none border-b border-theme-blue text-gray-700"
              min={1}
              max={10000}
            />
            <p className="mt-1">{warning.connect || ""}</p>
          </div>
          <div className="w-[32%] h-full ">
            <label className="text-dark-blue font-bold">DURATION</label>
            <select
              value={editData.duration}
              onChange={(t) => setEditData((el) => ({ ...el, duration: parseInt(t.target.value) || 0 }))}
              className="h-7 outline-none border-b border-theme-blue text-gray-700"
            >
              <option value="">Month</option>
              {months.map((el, index) => (
                <option key={index} value={el}>
                  {el} month
                </option>
              ))}
            </select>
            <p className="mt-1">{warning.duration || ""}</p>
          </div>
        </div>
        <div className="w-full h-10 mb-2">
          <select
            onChange={(t) => changeOnfeature(t)}
            className="w-[40%] outline-none rounded-xl sm:h-[80%] h-[50%] sm:text-base text-xs bg-dark-blue text-white"
          >
            <option value="">Features</option>
            {featureData.map(el=><option value={el}>{el}</option>)}
            
           
          </select>
        </div>
        <div className="w-[100%] h-[30%] bg-gray-400">
          {editData.features.map((el, index) => (
            <div key={index} className="w-full h-[20%] mt-2 bg-theme-blue flex">
              <div className="w-[90%] h-full flex items-center text-white px-2">
                <p>
                  {index + 1}.<span className="pl-2">{el}</span>
                </p>
              </div>
              <div onClick={() => handleClose(el)} className="w-[10%] h-full text-center cursor-pointer text-white font-black">
                X
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSubmission} className="bg-blue-500 hover:bg-dark-blue mt-2 px-8 py-2 rounded-lg font-medium text-white ">
          SUBMIT
        </button>
      </div>
   
    
  </div>
   )}
      </div>
    
    
    
    
    </div>
    </div>


  );
};





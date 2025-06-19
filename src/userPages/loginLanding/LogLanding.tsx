import React, { useEffect, useState } from "react";
import { request } from "@/utils/axiosUtilsTemp"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faChevronLeft,
  faAward,
} from "@fortawesome/free-solid-svg-icons";

import "./LogLanding.css";
import { Navbar } from "../../components/user/navbar/Navbar";
import {
  alertWithOk,
  handleAlert,
  simplePropt,
} from "../../utils/alert/SweeAlert";
import { PlanData, ProfileType } from "@/types/typesAndInterfaces"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "@/types/typesAndInterfaces";

import { showToast } from "@/utils/alert/toast";
import { useSocket } from "@/shared/hoc/GlobalSocket";
import { Footer } from "@/components/user/footer/Footer";
import CircularIndeterminate from "@/components/circularLoading/Circular";



 const LoginLanding = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const location = useLocation();

    /////////////pagination
  const [totalPage, setTotalPage] = useState(0);
  const itemPerPage = 9;
  const [currentPage, setCurrenPage] = useState(1);
  const [currentData, setCurrentData] = useState<ProfileType[] | undefined>([]);
  const [loading,setLoading]=useState(false)
  const [requestProfile, setRequest] = useState<ProfileType[]>([
    {
      _id: "",
      age: 0,
      gender: "",
      interest: [],
      lookingFor: "",
      name: "",
      no: 0,
      photo: "./defualtImage.jpg",
      secondName: "",
      state: "",
      dateOfBirth: "",
    },
  ]);

  ///////////////////accept request/////////////////

  const acceptRequest = async (id: string) => {
    try {
      if (planData?.name) {
        const response = await request({
          url: "/user/manageReqRes",
          method: "patch",
          data: { id: id, action: "accept" },
        });

        if (typeof response === "object") {
          handleAlert("success", "Request accepted");
          socket?.emit("userRequestSocket", {
            partnerId: id,
            from: "accept",
            token: localStorage.getItem("userToken"),
          });
          setRequest((el) => el.filter((el) => el._id !== id));
        } else {
          throw new Error("error on requeset");
        }
      } else {
        alertWithOk("Plan subscription", "No valid plan", "info");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertWithOk(
          "Plan insertion",
          error.message || "Error occured",
          "error"
        );
        return;
      }
      console.warn(error);
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      if (planData?.name) {
        const response = await request({
          url: "/user/manageReqRes",
          method: "patch",
          data: { id: id, action: "reject" },
        });

        if (typeof response === "object") {
          handleAlert("warning", "Request rejected");
          socket?.emit("userRequestSocket", {
            partnerId: id,
            from: "reject",
            token: localStorage.getItem("userToken"),
          });
          setRequest((el) => el.filter((el) => el._id !== id));
        } else {
          throw new Error("error on requeset");
        }
      } else {
        alertWithOk("Plan subscription", "No valid plan", "info");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertWithOk(
          "Plan insertion",
          error.message || "Error occured",
          "error"
        );
      }
      console.warn(error);
    }
  };

  ////////////////new connect//////////////
  useEffect(() => {
    function handleFuncton(data: { name: string; from: "accept" | "reject" }) {
      if (data.from === "accept") {
        showToast(`${data.name ? data.name : "partner"} accepted your request`);
      } else {
        showToast(
          `${data.name ? data.name : "partner"} declined your request`,
          "warning"
        );
      }
    }
    socket?.on("requestStutus", handleFuncton);
    socket?.on("errorFromSocket", (data: { message: string }) => {
      showToast(data.message, "error");
    });
    return () => {
      socket?.off("requestStutus", handleFuncton);
      socket?.off("errorFromSocket");
    };
  }, []);
  useEffect(() => {
    socket?.emit("register_user", {
      userId: localStorage.getItem("userToken"),
    });
    socket?.on("new_connect", (data: { data: ProfileType; note: string }) => {
      if (data.data) {
        showToast("new request arraived", "info");
        setProfiles((prev) => prev.filter((el) => el._id !== data.data._id));
        setRequest((el) => [...el, data.data]);
      }
    });

    return () => {
      socket?.off("new_connect");
    };
  }, [socket]);

  ///////////handle matching
  const dispatch = useDispatch();

  const handleMatch = async (
    id: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) {
      e.stopPropagation();
    }

    if (requestProfile) {
      const isDuplicate = requestProfile?.filter((el) => el._id === id);

      if (isDuplicate.length >= 1) {
        alertWithOk("Duplication", "already in request", "info");
        return;
      }
    }
    if (planData?.name) {
      if (planData.avialbleConnect && planData.avialbleConnect > 0) {
        socket?.emit("request_send", {
          sender: localStorage.getItem("userToken"),
          reciever: id,
        });
        try {
          const response: boolean = await request({
            url: "/user/addMatch",
            method: "post",
            data: { matchId: id },
          });
          if (response === true) {
            setPlanData((el) => {
              if (!el) return null;
              return {
                ...el,
                avialbleConnect: el.avialbleConnect
                  ? el.avialbleConnect - 1
                  : el.amount,
              };
            });

            setProfiles((el) => el?.filter((element) => element._id !== id));
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            handleAlert("error", error.message || "internal server error");
          }
        }
      } else {
        dispatch({
          type: "SET_DATA",
          payload: { ...useData, subscriptionStatus: "connection finished" },
        });
        alertWithOk(
          "Plan subscription",
          "You connection count finished please subscribe",
          "info"
        );
        simplePropt(
          () => navigate("/PlanDetails"),
          "Do you want purchase new Plan"
        );
      }
    } else {
      alertWithOk("Plan subscription", "No valid plan", "info");
    }
  };

  const [profils, setProfiles] = useState<ProfileType[]>([]);
  const useData = useSelector((state: IReduxState) => state.userData);
  ////////pagination

  
  //////////profile and plan fetching///////
  useEffect(() => {
    if (location?.state?.data && location?.state?.from === "search") {
      let minAge = location.state.data.minAge;
      let maxAge = location.state.data.maxAge;
      if (!minAge || !maxAge) {
        if (!minAge && maxAge) {
          minAge = 18;
        }
        if (minAge && !maxAge) {
          maxAge = 60;
        }
        if (!minAge && !maxAge) {
          minAge = 18;
          maxAge = 60;
        }
      }
      if (minAge && maxAge) {
        minAge = parseInt(minAge);
        maxAge = parseInt(maxAge);
      }

      const searchData = location.state.data;
      searchData.minAge = minAge;
      searchData.maxAge = maxAge;
        if (searchData.maxAge < searchData.minAge) {
          alertWithOk(
            "Search Details",
            "Please provide a valid age range",
            "warning"
          );
          return;
        }
      async function handleSearch() {
        try {
          setLoading(true)
          const response: {
          datas: { profile: ProfileType[]; request: ProfileType[] }[];
          currntPlan: PlanData;
          interest: string[];
        } = await request({
          url: `/user/fetchProfile`,
        });
        const res: { profile: ProfileType[]; request: ProfileType[] }[] =
          response.datas ?? { profile: [], request: [] };

        if (!res[0]?.profile) {
          alert("error");
        }

        setProfiles(res[0].profile);
        if (
          response.currntPlan &&
          typeof response.currntPlan === "object" &&
          Object.keys(response.currntPlan).length
        ) {
          setPlanData(response.currntPlan);
        }
        if (searchData.district && searchData.interests.length !== 0) {
          const profile = res[0]?.profile.filter((el: ProfileType) => {
            return (
              searchData.minAge <= el.age &&
              searchData.maxAge >= el.age &&
              el.state === searchData.district &&
              el.state &&
              searchData.interests.every((interest: string) =>
                el.interest.includes(interest)
              )
            );
          });

          if (!profile.length) {
            alertWithOk("No result found", "Enjoy availables  ", "warning");
            return;
          }
          alertWithOk(
            "search Data",
            `${profile?.length} profiles found`,
            "success"
          );
          setProfiles(profile);
          if (
            response.currntPlan &&
            typeof response.currntPlan === "object" &&
            Object.keys(response.currntPlan).length
          ) {
            setPlanData(response.currntPlan);
          }
        } else if (!searchData.district && searchData.interests.length === 0) {
          const profile = res[0]?.profile.filter((el: ProfileType) => {
            return searchData.minAge <= el.age && searchData.maxAge >= el.age;
          });
          if (!profile.length) {
            alertWithOk(
              "no result found",
              "Please enjoy availables",
              "warning"
            );
            return;
          }
          alertWithOk(
            "search Data",
            `${profile?.length} profiles found`,
            "success"
          );
          setProfiles(profile);
          if (
            response.currntPlan &&
            typeof response.currntPlan === "object" &&
            Object.keys(response.currntPlan).length
          ) {
            setPlanData(response.currntPlan);
          }
        } else if (searchData.district) {
          const profile = res[0]?.profile.filter((el: ProfileType) => {
            return (
              searchData.minAge <= el.age &&
              searchData.maxAge >= el.age &&
              searchData.district === el.state
            );
          });
          if (!profile.length) {
            alertWithOk(
              "no result found",
              "Please enjoy availables",
              "warning"
            );
            return;
          }
          alertWithOk(
            "search Data",
            `${profile?.length} profiles found`,
            "success"
          );
          setProfiles(profile);
          if (
            response.currntPlan &&
            typeof response.currntPlan === "object" &&
            Object.keys(response.currntPlan).length
          ) {
            setPlanData(response.currntPlan);
          }
        } else if (searchData.interests?.length !== 0) {
          const profile = res[0]?.profile.filter((el: ProfileType) => {
            return (
              searchData.minAge <= el.age &&
              searchData.maxAge >= el.age &&
              searchData.interests?.every((interest: string) =>
                el.interest?.includes(interest)
              )
            );
          });
          if (!profile.length) {
            alertWithOk(
              "no result found",
              "Please enjoy availables",
              "warning"
            );
            return;
          }
          alertWithOk(
            "search Data",
            `${profile?.length} profiles found`,
            "success"
          );
          setProfiles(profile);
          if (
            response.currntPlan &&
            typeof response.currntPlan === "object" &&
            Object.keys(response.currntPlan).length
          ) {
            setPlanData(response.currntPlan);
          }
        }
        } catch (error) {
          if(error instanceof Error){
            alertWithOk('searching',error.message||'error on search ','error')
          }
        }finally{
          
        setLoading(false)
        }
      
        
      
      }

      handleSearch();
    } else if (location?.state?.from === "suggestion") {
      async function fetch() {
        try {
          setLoading(true)
          const response: {
          datas: { profile: ProfileType[]; request: ProfileType[] }[];
          currntPlan: PlanData;
          interest: string[];
        } = await request({
          url: `/user/fetchSuggestion`,
        });

        if (response.datas[0]?.profile.length === 0) {
          handleAlert("info", "suggestion not available");
          navigate("/loginLanding");
        }

        const res: { profile: ProfileType[]; request: ProfileType[] }[] =
          response.datas ?? { profile: [], request: [] };

        if (res[0]?.profile) setProfiles(res[0].profile);
        if (res[0]?.request) setRequest(res[0]?.request);
        if (
          response.currntPlan &&
          typeof response.currntPlan === "object" &&
          Object.keys(response.currntPlan).length
        ) {
          setPlanData(response.currntPlan);
        }
        } catch (error) {
          if(error instanceof Error){
            alertWithOk('searching',error.message||'error on search ','error')
          }
        }finally{
          setLoading(false)
        }
        
      }
      fetch();
    } else {
      async function fetch() {

        try {
          setLoading(true)
           const response: {
          datas: { profile: ProfileType[]; request: ProfileType[] }[];
          currntPlan: PlanData;
          interest: string[];
        } = await request({
          url: `/user/fetchProfile`,
        });
       

        const res: { profile: ProfileType[]; request: ProfileType[] }[] =
          response.datas ?? { profile: [], request: [] };

        if (res[0]?.profile) setProfiles(res[0].profile);
        if (res[0]?.request) setRequest(res[0]?.request);
        if (
          response.currntPlan &&
          typeof response.currntPlan === "object" &&
          Object.keys(response.currntPlan).length
        ) {
          setPlanData(response.currntPlan);
        }
        } catch (error) {
          if(error instanceof Error){
            alertWithOk('searching',error.message||'error on search ','error')
          }
        }finally{
          setLoading(false)
        }
       
      }
      fetch();
    }
  }, [location]);



  //////////scroll pagination
  const handlePreviouse = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentPage > 1) setCurrenPage((el) => el - 1);
  };
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentPage < totalPage) setCurrenPage((el) => el + 1);
  };
  ///////search////////////

  const minAge: number[] = [];
  for (let i = 18; i < 60; i++) {
    minAge.push(i);
  }
  const maxAge: number[] = [];
  for (let i = 19; i < 61; i++) {
    maxAge.push(i);
  }

  useEffect(() => {
    if (profils?.length) {
      const total = Math.ceil(profils.length / itemPerPage);
      setTotalPage(total);
      if (currentPage > total) {
        setCurrenPage(total);
      } else {
        const sliceData = profils.slice(
          (currentPage - 1) * itemPerPage,
          currentPage * itemPerPage
        );
        setCurrentData(sliceData);
      }
    } else {
      setTotalPage(0);
      setCurrentData([]);
    }
  }, [profils, currentPage, itemPerPage]);

  ////////////////////////handle show profile//////////////////////
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showRequest, setShowRequest] = useState(false);

  const [partnerProfile, setParternProfile] = useState<ProfileType>({
    _id: "",
    age: 0,
    gender: "",
    interest: [],
    lookingFor: "",
    name: "",
    no: 0,
    photo: "./defualtImage.jpg",
    secondName: "",
    state: "",
    dateOfBirth: "",
  });
  function handleShowProfile(
    e: React.MouseEvent<HTMLButtonElement>,
    profile: ProfileType
  ) {
    e.stopPropagation();
    setParternProfile(profile);
    if (partnerProfile._id !== "") {
      setShowProfile(true);
    }
  }

  return (
    <>
      {loading && (
                    <div className="w-full flex items-center justify-center  h-full  fixed bg-[#00000032] z-50">
                      <CircularIndeterminate />
                    </div>
                  )}
    <div className="min-h-[700px]   w-[100%] bg-slate-200 ">
      {/* planModal */}
      {showRequest && (
        <div className=" w-full h-full fixed bg-[rgba(0,0,0,.8)] z-40">
          <div className="w-full h-20  flex items-center justify-end pr-3">
            <img
              src="/deleteRemove.png"
              onClick={() => setShowRequest(false)}
              className=" w-8 h-8"
              alt=""
            />
          </div>
          <div className="ml-2 w-[95%]    rounded-3xl   ">
            <div className="w-full h-[10%] flex justify-center  mb-2 ">
              <p className="font-aborato font-semibold  text-base text-[#d7ff39] mt-2 ">
                REQUEST
              </p>
            </div>
            <div
              id="request"
              className="w-full max-h-[400px] overflow-y-auto flex gap-y-3 items-center flex-col pb-4  bg-white shadow-lg rounded-xl pt-10"
            >
              {requestProfile?.[0]?._id &&
                requestProfile?.map((el, index) => {
                  return (
                    <div
                      className="w-[90%] min-h-[70px] mt-3  border-b border-b-gray-300 flex"
                      key={index}
                    >
                      <div className="w-[70%]   sm:text-base text-xs h-full    flex items-center justify-around ">
                        <div className="sm:w-12 sm:h-12 w-8 h-8   rounded-2xl">
                          <img
                            src={el.photo ? el.photo : "/adminLogin_.png"}
                            className="w-full h-full rounded-2xl"
                            alt=""
                          />
                        </div>
                        <p className="font-popin text-sm font-semibold  overflow-hidden sm:px-6 sm:py-2 ">
                          {el.name}
                        </p>
                      </div>
                      <div className="w-[30%]  flex md:flex-row md:gap-y-0 gap-y-3 flex-col md:py-3 h-full justify-around items-center ">
                        <div
                          onClick={() => acceptRequest(el._id)}
                          className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ color: "#74C0FC", fontSize: "18px" }}
                          />
                        </div>
                        <div
                          onClick={() => rejectRequest(el._id)}
                          className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer "
                        >
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            style={{ color: "#ababab", fontSize: "18px" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {/* ////////////////////////////show partener profile///////////////////////////// */}

      {showProfile && (
        <div className=" w-[100%] flex  justify-center items-center h-[700px] fixed z-[2]">
          <div></div>
          <div className="sm:w-[70%] relative w-[90%] h-[80%]  flex mt-18 bg-[#ffffff] border-2 border-yellow-400 items-center flex-col  rounded-xl">
            <div className="w-full h-[15%]  flex">
              <div className="w-[10%] h-full flex justify-center items-center">
                <div
                  onClick={() => setShowProfile(false)}
                  className="cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
              </div>
              <div className="w-[80%]  h-full justify-center flex items-center font-playfair md:text-2xl font-black  text-amber-950">
                PROFILE DETAILS
              </div>
            </div>

            <div className="md:w-[50%] md:h-auto  h-[100px] sm:w-[30%] w-[20%] md:pt-6    absolute    top-16 md:bottom-1 md:left-1 z-[1]">
              <div className="h-full w-full relative ">
                <img
                  src={
                    !partnerProfile.photo || partnerProfile.photo === ""
                      ? "./No_Image_Available.jpg"
                      : partnerProfile.photo
                  }
                  className="w-full h-full md: rounded-xl"
                  alt=""
                />
                <div className="w-full h-[15%] absolute bottom-0  flex justify-center items-center">
                  <button
                    onClick={() => (
                      handleMatch(partnerProfile._id),
                      setShowProfile(false),
                      setParternProfile({
                        _id: "",
                        age: 0,
                        gender: "",
                        interest: [],
                        lookingFor: "",
                        name: "",
                        no: 0,
                        photo: "./defualtImage.jpg",
                        secondName: "",
                        state: "",
                        dateOfBirth: "",
                      })
                    )}
                    className="rounded-lg md:flex hidden overflow-hidden relative w-36 h-10 cursor-pointer  items-center border border-amber-950 bg-amber-950 group hover:bg-amber-950 active:bg-amber-950 active:border-amber-950"
                  >
                    <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">
                      Add Item
                    </span>
                    <span className="absolute right-0 h-full w-10 rounded-lg bg-amber-950 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                      <svg
                        className="svg w-8 text-white"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="12" x2="12" y1="5" y2="19"></line>
                        <line x1="5" x2="19" y1="12" y2="12"></line>
                      </svg>
                    </span>
                  </button>

                  <button
                    onClick={() => (
                      handleMatch(partnerProfile._id),
                      setShowProfile(false),
                      setParternProfile({
                        _id: "",
                        age: 0,
                        gender: "",
                        interest: [],
                        lookingFor: "",
                        name: "",
                        no: 0,
                        photo: "./defualtImage.jpg",
                        secondName: "",
                        state: "",
                        dateOfBirth: "",
                      })
                    )}
                    title="Add New"
                    className="md:hidden text-sm block group cursor-pointer outline-none hover:rotate-90 duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-[20px] h-[20px] stroke-white fill-none group-hover:fill-slate-800 group-active:stroke-slate-200 group-active:fill-slate-600 group-active:duration-0 duration-300"
                    >
                      <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        stroke-width="1.5"
                      ></path>
                      <path d="M8 12H16" stroke-width="1.5"></path>
                      <path d="M12 16V8" stroke-width="1.5"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* //////////////partnerPrifile Data////////////// */}
            <div className="md:w-[49%] w-[100%]  h-[85%] flex justify-center items-end  absolute bottom-0 right-0">
              <div className=" w-full  h-[80%] md:h-full  ">
                <div className="w-full  h-[50px] mb-3 md:text-3xl flex justify-center  font-playfair ">
                  {partnerProfile.name} {partnerProfile.secondName}
                </div>
                <div className=" w-full lg:h-[250px] h-[175px] px-2 gap-2  grid grid-cols-2 ">
                  <div className="w-[80%] flex h-full transform transition-transform duration-300 ease-in-out hover:scale-105 flex-col justify-center items-center border border-gray-400 rounded-lg">
                    <div className="w-[25%] h-[30%]  rounded-full font-roboto  text-amber-900 flex justify-center items-center flex-col">
                      <img
                        src="/age.png"
                        className="w-full h-full mb-3"
                        alt=""
                      />
                      <p className="font-medium text-sm">Age</p>
                      <p className="font-popin font-semibold">
                        {partnerProfile.age}
                      </p>
                    </div>
                  </div>
                  <div className="w-[80%] flex h-full transform transition-transform duration-300 ease-in-out hover:scale-105 flex-col justify-center items-center border border-gray-400 rounded-lg">
                    <div className="w-[25%] h-[30%] rounded-full flex justify-center text-amber-900 items-center flex-col ">
                      <img
                        src="/equality.png"
                        className="w-full h-full mb-3"
                        alt=""
                      />
                      <p className="font-medium">Gender</p>
                      <p className="font-popin font-semibold">
                        {partnerProfile.gender}
                      </p>
                    </div>
                  </div>

                  <div className="w-[80%] transform transition-transform duration-300 ease-in-out hover:scale-105 flex h-full flex-col justify-center items-center border border-gray-400 rounded-lg">
                    <div className="w-[25%] h-[30%] rounded-full text-amber-900 bg- flex justify-center items-center flex-col">
                      <img
                        src="/birthday.png"
                        className="w-full h-full mb-3"
                        alt=""
                      />
                      <p className="font-medium">D.O.B</p>
                      <p className="font-popin font-semibold">
                        {new Date(partnerProfile.dateOfBirth).getDate()}.
                        {new Date(partnerProfile.dateOfBirth).getMonth()}.
                        {new Date(partnerProfile.dateOfBirth).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="w-[80%]    transform   transition-transform duration-300 ease-in-out hover:scale-105 flex h-full flex-col justify-center items-center border border-gray-400 rounded-lg">
                    <div className="w-[25%]   h-[30%] rounded-full flex text-amber-900 justify-center items-center flex-col">
                      <img
                        src="/location.png"
                        className="w-full h-full mb-3 "
                        alt=""
                      />
                      <p className="font-medium ">District</p>
                      <p className="font-popin font-semibold overflow-ellipsis text-sm">
                        {partnerProfile.state}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-12 overflow-hidden  lg:h-[110px] h-[100px] px-3 ">
                  <p className="text-amber-950 font-semibold font-popin">
                    Interests
                  </p>
                  <div className="w-full h-[80%]  pt-2 gap-y-2 px-4   ">
                    <ol type="1" className="grid gap-2 grid-cols-3">
                      {partnerProfile.interest?.map((el) => (
                        <li className="w-[50%] text-center rounded-full h-auto inline-flex justify-center items-center gap-1">
                          <span className="">★</span> {el}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar
        active={
          location?.state?.from && location?.state?.from === "search"
            ? "search"
            : location.state?.from === "suggestion"
            ? "suggestion"
            : "profile"
        }
        setShowRequest={setShowRequest}
        setLoading={setLoading}
      />

      <div className="w-[100%] h-full  flex">
        <div className="md:w-0 lg:w-[20%] sm:w-0 w-0 overflow-hidden md:h-screen  h-[1000px]  mt-28">
          <div className="w-full  md:h-[45%] sm:h-[30%] flex    md:flex justify-center flex-col items-center">
            <p className="pb-2 font-semibold  font-aborato text-base text-amber-900 md:block  ml-3">
              PLAN DETAILS
            </p>
            {/* ///////////////////subscription card/////////////// */}

            {planData?.name ? (
              <>
                <div
                  onClick={() => navigate("/planAndRequest")}
                  className="sm:w-[85%] w-[90%] cursor-pointer  sm:h-[250px] md:h-[250px] h-[200px] md:ml-0 ml-2  transition-all duration-500 ease-in-out hover:shadow-md hover:shadow-orange-800  bg-white shadow-xl md:flex justify-center items-center flex-col  rounded-xl "
                >
                  <div className="w-fullh-[30%]   flex justify-center items-center">
                    <p className="font-aborato font-black  pt-1 text-base text-amber-950 ">
                      {planData.name}
                    </p>
                  </div>
                  <div className="w-[100%]  justify-center  h-[40%] flex items-center py-2 px-6    ">
                    <img src="/gift.png" className="h-[100%] w-[60%]" alt="" />
                  </div>
                  <div className="md:w-[80%] w-[100%] sm:w-full   mt-4 text-amber-900   ml-0 sm:ml-4 h-[30%] text-xs    flex justify-center items-center flex-col">
                    {planData.Expiry && (
                      <p className="mb-2">
                        <span className="text-amber-700 mr-1 ">Validity:</span>{" "}
                        {new Date(planData.Expiry).getDate()}
                        {"."}
                        {new Date(planData.Expiry).getMonth()}
                        {"."}
                        {new Date(planData.Expiry).getFullYear()}
                      </p>
                    )}
                    {planData.Expiry && (
                      <p>
                        {" "}
                        <span className="text-amber-700 mr-1 ">
                          Connection left:
                        </span>{" "}
                        {planData.avialbleConnect}/{planData.connect}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-[225px] shadow-sm shadow-orange-900 h-[200px] bg-white flex justify-center items-center  rounded-3xl ">
                <h1 className="font-bold  text-amber-950 sm:text-base text-sm">
                  PLAN NOT AVAILABLE
                </h1>
              </div>
            )}
          </div>

          <div className="ml-2 w-[95%]    rounded-3xl   ">
            <div className="w-full h-[10%] flex justify-center  mb-2 ">
              <p className="font-aborato font-semibold  text-base text-[#66451c] mt-2 ">
                REQUEST
              </p>
            </div>
            <div
              id="request"
              className="w-full max-h-[360px] overflow-y-auto flex gap-y-3 items-center flex-col pb-4  bg-white shadow-lg rounded-xl pt-10"
            >
              {requestProfile?.[0]?._id &&
                requestProfile?.map((el, index) => {
                  return (
                    <div
                      className="w-[90%] min-h-[70px] mt-3  border-b border-b-gray-300 flex"
                      key={index}
                    >
                      <div className="w-[70%]   sm:text-base text-xs h-full    flex items-center justify-around ">
                        <div className="sm:w-12 sm:h-12 w-8 h-8   rounded-2xl">
                          <img
                            src={el.photo ? el.photo : "/adminLogin_.png"}
                            className="w-full h-full rounded-2xl"
                            alt=""
                          />
                        </div>
                        <p className="font-popin text-sm font-semibold  overflow-hidden sm:px-6 sm:py-2 ">
                          {el.name}
                        </p>
                      </div>
                      <div className="w-[30%]  flex md:flex-row md:gap-y-0 gap-y-3 flex-col md:py-3 h-full justify-around items-center ">
                        <div
                          onClick={() => acceptRequest(el._id)}
                          className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ color: "#74C0FC", fontSize: "18px" }}
                          />
                        </div>
                        <div
                          onClick={() => rejectRequest(el._id)}
                          className="sm:w-5 w-4 h-4 sm:h-5 cursor-pointer "
                        >
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            style={{ color: "#ababab", fontSize: "18px" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="sm:w-[95%] lg:w-[75%] w-full   sm:px-0 px-28 h-full    ">
          {/* ///////card///////////////////////////////// */}

          <div className="sm:px-5 md:px-10 px-2 py-16     bg-center grid grid-cols-1 w-[100%]   mt-16 sm:ml-10 min-h-[600px]  md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-2 gap-14  ">
            {currentData?.map((el, index) => (
              <div
                key={index}
                className="overflow-hidden border drop-shadow-sm sm:w-[90%] relative flex flex-col items-center shadow-2xl sm:h-[250px] w-[200px] h-[250px]   rounded-2xl bg-white p-1
               hover:shadow-[0px_0px_10px_2px_rgba(0,200,255,0.6)]  transition-shadow duration-300  
                "
              >
                {location.state?.from === "suggestion" &&
                  el.matchStatics === "hr" && (
                    <FontAwesomeIcon
                      icon={faAward}
                      size="xl"
                      beat
                      style={{
                        color: "#B197FC",
                        position: "absolute",
                        left: 10,
                        top: 10,
                      }}
                    />
                  )}
                {location.state?.from === "suggestion" && (
                  <img
                    src="/recommendation.png"
                    className="w-10 h-10 absolute top-1 right-1"
                    alt=""
                  />
                )}
                {location.state?.from === "suggestion" &&
                el.matchStatics === "rc" ? (
                  <div className="h-5 w-full   bottom-0 b text-dark-blue font-bold absolute inline-flex justify-center items-center  bg-blue-300 text-xs ">
                    Strongly Recommended
                  </div>
                ) : el.matchStatics === "hr" ? (
                  <div className="h-5 w-full   bottom-0 b text-white font-jakarta font-bold absolute inline-flex justify-center items-center  bg-green-700 text-xs ">
                    Highly Recommended
                  </div>
                ) : el.matchStatics === "phr" ? (
                  <div className="h-5 w-full   bottom-0 b text-white font-jakarta font-bold absolute inline-flex justify-center items-center  bg-yellow-400 text-xs ">
                    Moderately Recommended
                  </div>
                ) : el.matchStatics === "np" ? (
                  <div className="h-5 w-full   bottom-0 b text-white font-jakarta font-bold absolute inline-flex justify-center items-center  bg-red-300 text-xs ">
                    Lightly Recommended
                  </div>
                ) : (
                  ""
                )}
                {/* ////////imageDiv/////////// */}
                <div className="w-[100px] flex justify-center overflow-hidden items-center h-[100px] border-[3px] border-blue-300 rounded-full mt-4 ">
                  <img
                    className="w-[95%] h-[95%] rounded-full transition-transform duration-200 ease-in-out hover:scale-125"
                    src={
                      el?.photo === "" || !el.photo
                        ? "./defualtImage.jpg"
                        : el.photo
                    }
                    alt="x"
                  />
                </div>

                {/* //////////Name////// */}
                <div className="w-[80%] flex justify-center items-center overflow-hidden">
                  <p className="text-xl   font-playfair font-semibold text-gray-800">
                    {el.name} {el.secondName}
                  </p>
                </div>
                <p className="   text-theme-blue font-medium text-sm ">
                  {el.age} years age
                </p>
                <div className="w-[80%] flex justify-center items-end h-[50px] ">
                  <button
                    onClick={(e) => handleShowProfile(e, el)}
                    className="w-32 rounded-full h-[30px] border border-amber-900 text-amber-800 hover:bg-amber-950 hover:text-white transition-colors duration-500 ease-in-out text-sm font-medium inline-flex items-center justify-center"
                  >
                    View <span className="md:block hidden ml-1">Profile</span>{" "}
                  </button>
                  <button
                    onClick={(e) => handleMatch(el._id, e)}
                    className="w-32 ml-3 rounded-full h-[30px] border border-blue-300 text-blue-500 hover:bg-blue-500  hover:text-white transition-colors duration-500 ease-in-out text-sm font-medium inline-flex items-center justify-center"
                  >
                    ADD <span className="md:block ml-1 hidden">MATCH</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ///////////////////////////////pagination//////////////////////////// */}
          <div className="w-[100%] h-14  mb-10 flex justify-center items-center text-center">
            <button
              onClick={() => handlePreviouse()}
              disabled={currentPage === 1}
              className="bg-dark-blue text-white rounded-full sm:h-14 h-9 w-9 sm:w-14"
            >
              {"<<"}
            </button>
            <p className=" mx-2 ">
              <span className="font-bold text-center">{currentPage}</span> of{" "}
              {totalPage}{" "}
            </p>
            <button
              onClick={() => handleNext()}
              disabled={currentPage === totalPage}
              className="bg-dark-blue text-white rounded-full sm:h-14 h-9 w-9 sm:w-14  font-bold"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {/* <Footer/> */}
    </div>
    </>
  );
};
export default LoginLanding
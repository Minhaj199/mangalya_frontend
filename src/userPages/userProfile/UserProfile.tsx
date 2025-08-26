import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { districtsOfKerala } from "@/components/user/signupInputs/inputFields.ts";
import { CountdownProfile } from "@/components/user/timer/CountdownProfile";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/axiosUtil";
import { useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert } from "../../utils/alert/SweeAlert.ts";
import { validateEditedData } from "../../validators/editValidator.ts";
import { capitaliser } from "../../utils/firstLetterCapitaliser.ts";
import { Navbar } from "../../components/user/navbar/Navbar.tsx";
import { showToast } from "@/utils/alert/toast.tsx";
import { editedDataFinder } from "../../utils/editedDataFinder.ts";
import { dateToDateInputGenerator } from "../../utils/dateToDateInputGenerator.ts";
import { useSocket } from "@/shared/hoc/GlobalSocket.tsx";
import CircularIndeterminate from "@/components/circularLoading/Circular.tsx";
import { Footer } from "@/components/user/footer/Footer.tsx";
import { useDispatch, useSelector } from "react-redux";
import { FetchBlankData, IReduxState } from "@/types/typesAndInterfaces.ts";
import { compressImage } from "@/utils/imageCompressor.ts";
import { UserData } from "@/types/typesAndInterfaces.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const blanUserData = {
  PersonalInfo: {
    firstName: "",
    secondName: "",
    state: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    interest: null,
    photo: null,
  },
  partnerData: {
    gender: "",
  },
  email: "",

  subscriber: "",
};
const UserProfile = () => {
  const socket = useSocket();
  const [editUser, setEditUser] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<UserData>(blanUserData);
  const userData = useSelector((state: IReduxState) => state.userData);
  const dispatch = useDispatch();
  //////////////////fetching data////////////

  const [orginalData, setOrginalData] = useState<FetchBlankData>({
    PersonalInfo: {
      firstName: "",
      secondName: "",
      state: "",
      gender: "",
      dateOfBirth: new Date(),
      interest: [],
      age: 0,
      image: "",
    },
    PartnerData: { gender: "" },
    Email: "",
    subscriptionStatus: "",
    currentPlan: {
      amount: 0,
      connect: 0,
      avialbleConnect: 0,
      duration: 0,
      features: [],
      name: "",
      Expiry: new Date(),
    },
  });
  interface fetchUserData {
    message: string;
    user: FetchBlankData;
  }

  //////////////set interest////////
  const [interest, setInterest] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const userData: fetchUserData = await request({
          url: "/user/getUserProfile",
        });

        const interest: {
          Data: { food: string[]; music: string[]; sports: string[] };
          message: string;
        } = await request({ url: "/user/getInterest" });

        if (interest.Data) {
          setInterest([
            ...interest.Data.food,
            ...interest.Data.music,
            ...interest.Data.sports,
          ]);
        }
        if (userData.message || interest.message) {
          throw new Error(userData.message);
        }
        setOrginalData(userData.user);
        setEditedData((el) => ({
          ...el,
          email: userData.user.Email,
          PersonalInfo: {
            ...el.PersonalInfo,
            firstName: userData.user.PersonalInfo.firstName,
            dateOfBirth: dateToDateInputGenerator(
              "",
              new Date(
                userData.user.PersonalInfo.dateOfBirth
              ).toLocaleDateString()
            ),
            gender: userData.user.PersonalInfo.gender,
            interest: userData.user.PersonalInfo.interest,
            secondName: userData.user.PersonalInfo.secondName,
            state: userData.user.PersonalInfo.state,
          },
          partnerData: {
            ...el.partnerData,
            gender: userData.user.PartnerData.gender,
          },
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          alertWithOk(
            "UserData loading",
            error.message || "error on fetch user data",
            "error"
          );
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  //////////////////handle change in input data/////////////////
  const handleInputData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "firstName") {
      const value = capitaliser(e.target.value);
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, firstName: value },
      }));
    } else if (e.target.name === "secondName") {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, secondName: e.target.value },
      }));
    } else if (e.target.name === "district") {
      if (e.target.value !== "")
        setEditedData((el) => ({
          ...el,
          PersonalInfo: { ...el.PersonalInfo, state: e.target.value },
        }));
    } else if (e.target.name === "dateOfBirth") {
      const inputDate = new Date(e.target.value);
      const formattedDate = inputDate.toISOString().split("T")[0];
      setEditedData((el) => ({
        ...el,
        PersonalInfo: {
          ...el.PersonalInfo,
          dateOfBirth: formattedDate,
        },
      }));
    } else if (e.target.name === "email") {
      setEditedData((el) => ({ ...el, email: e.target.value }));
    } else if (e.target.name === "partnerGender") {
      setEditedData((el) => ({
        ...el,
        partnerData: { ...el.partnerData, gender: e.target.value },
      }));
    } else if (e.target.name === "interest" && e.target.value) {
      if (
        !orginalData.PersonalInfo.interest?.includes(e.target.value) &&
        !editedData.PersonalInfo.interest?.includes(e.target.value)
      )
        setEditedData((el) => ({
          ...el,
          PersonalInfo: {
            ...el.PersonalInfo,
            interest: el.PersonalInfo.interest?.length
              ? [...el.PersonalInfo.interest, e.target.value]
              : el.PersonalInfo.interest === null
              ? [...orginalData.PersonalInfo.interest, e.target.value]
              : [e.target.value],
          },
        }));
    }
  };

  //////////////////handle input select change
  function selectInputChange(field: string, value: string) {
    if (field === "partnerGender") {
      setEditedData((el) => ({
        ...el,
        partnerData: { ...el.partnerData, gender: value },
      }));
    } else if (field === "district") {
      if (value !== "")
        setEditedData((el) => ({
          ...el,
          PersonalInfo: { ...el.PersonalInfo, state: value },
        }));
    }
    else if (field === "gender") {
      if (value !== "")
        setEditedData((el) => ({
          ...el,
          PersonalInfo: { ...el.PersonalInfo, gender: value },
        }));
    } 
  }
  ///////////////handling photo////////////////
  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const draft = e.target.files;
    if (draft?.length) {
      const maxSize = 10 * 1024 * 1024;
      const lessSize = 1 * 1024 * 1024;
      const file =
        draft[0].size > lessSize ? await compressImage(draft[0]) : draft[0];
      if (maxSize < file.size) {
        alertWithOk(
          "Photo size limit",
          "please reduce size to below 10 mp",
          "info"
        );
        return;
      }
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, image: file },
      }));
      const imageUrl = URL.createObjectURL(file);
      setTempPhot(imageUrl);
    }
  }
  //////////////////handle remove interest///////////

  ///////////////////password reset//////////////////

  interface FormWarning {
    firstName: string;
    secondName: string;
    state: string;
    dob: string;
    email: string;
  }

  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [passwords, setPasswords] = useState<{
    password: string;
    confirmPassword: string;
  }>({ password: "", confirmPassword: "" });
  const [switchTopassword, setSwitchTopassword] = useState<boolean>(false);
  const [warnning, setWarning] = useState<string>();
  const [formWarning, setFormWarning] = useState<FormWarning>({
    firstName: "",
    secondName: "",

    state: "",
    dob: "",
    email: "",
  });
  interface IsValid {
    status: "OTP not found" | "opt matched" | "Not valid otp";
    message: string;
  }
  const [PasswordWarnning, setPasswordWarning] = useState<{
    password: string;
    confirmPassword: string;
  }>({ confirmPassword: "", password: "" });
  async function submitPassword() {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const test = strongPasswordRegex.test(passwords.password);
    if (!test) {
      setPasswordWarning((el) => ({
        ...el,
        password: "password is not strong",
      }));

      return false;
    }
    if (passwords.password.trim() === "") {
      setPasswordWarning((el) => ({ ...el, password: "Blank not allowed" }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, password: "" }));
    }
    if (passwords.confirmPassword.trim() === "") {
      setPasswordWarning((el) => ({
        ...el,
        confirmPassword: "Blank not allowed",
      }));
      return false;
    } else {
      setPasswordWarning((el) => ({ ...el, confirmPassword: "" }));
    }

    if (passwords.password !== passwords.confirmPassword) {
      setPasswordWarning({
        password: "Password is not match",
        confirmPassword: "Password is not match",
      });
      return false;
    } else {
      setPasswordWarning({ confirmPassword: "", password: "" });
    }

    try {
      setLoading(true);
      const response: { status: boolean; message: string } = await request({
        url: "/user/resetPassword",
        data: passwords,
        method: "patch",
      });
      if (response.message) {
        throw new Error(response.message || "Error on password reset");
      }
      if (response.status === true) {
        setOpenPopUp(false);
        setOtp(0);
        setEditUser(false);
        setActive("info");
        setSwitchTopassword(false);
        handleAlert("success", "Password changed successfully");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertWithOk(
          "Password Reset",
          error.message || "error on password reset",
          "error"
        );
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }
  async function handleOTPSent() {
    if (!otp || otp <= 0) {
      setWarning("Please enter otp");
      return;
    }
    if (otp.toString().length < 6 || otp.toString().length > 6) {
      setWarning("Insert 6 digits");
      return;
    }
    try {
      const isValid: IsValid = await request({
        url: "/user/validateUserOTP",
        method: "post",
        data: { OTP: otp, from: "forgot" },
      });

      if (isValid.message) {
        throw new Error(isValid.message || "error on otp validation");
      }
      if (isValid.status === "opt matched") {
        setSwitchTopassword(true);
      } else {
        throw new Error(isValid.status);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertWithOk(
          "OTP VALIDATION",
          error.message || "validation faild",
          "error"
        );
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function inputPassword(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "password") {
      setPasswords((el) => ({ ...el, password: e.target.value }));
    } else {
      setPasswords((el) => ({ ...el, confirmPassword: e.target.value }));
    }
  }

  const navigate = useNavigate();

  const expiryTimeStamp = new Date(Date.now() + 120000);

  ////////////handle photo change/////
  const profileRef = useRef<HTMLInputElement>(null);
  function handleClick() {
    if (profileRef.current) {
      profileRef.current.click();
    }
  }
  const [tempPhoto, setTempPhot] = useState<string>("");

  function handleRemovePhoto() {
    setTempPhot("");
    setEditedData((el) => ({
      ...el,
      PersonalInfo: { ...el.PersonalInfo, image: "" },
    }));
  }
  useEffect(() => {
    if (openPopUp) {
      async function createOTP() {
        await request({ url: "/user/otpRstPsword", method: "post" });
      }
      createOTP();
    }
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
    socket?.on("new_connect", (data) => {
      if (data.data) {
        showToast("new request arraived", "info");
      }
    });

    return () => {
      socket?.off("new_connect");
      socket?.off("requestStutus", handleFuncton);
      socket?.off("errorFromSocket");
    };
  }, [openPopUp]);

  ////////////////////////////// handle submit edited data//////////////////////
  const [loading, setLoading] = useState<boolean>(false);
  async function submitEditedData() {
    setFormWarning({
      firstName: "",
      secondName: "",

      state: "",
      dob: "",
      email: "",
    });
    setLoading(true);
    const dataToFind = structuredClone(editedData);

    editedDataFinder({ dataToFind, orginalData });

    const validate = await validateEditedData(dataToFind, setFormWarning);

    if (validate) {
      const formData = new FormData();
      formData.append("file", editedData.PersonalInfo.image || "");
      formData.append("data", JSON.stringify(dataToFind));
      try {
        setLoading(true);
        const response: {
          newData: { data: FetchBlankData; token: string | boolean };
          message: string;
        } = await request({
          url: "/user/editProfile",
          method: "put",
          data: formData,
        });

        if (response?.message) {
          throw new Error(response.message || "error on updating");
        }
        if (
          response?.newData.token &&
          typeof response?.newData.token === "string"
        ) {
          localStorage.setItem("userToken", response.newData.token);
        }
        if (
          response.newData.data.PersonalInfo.image !==
          orginalData.PersonalInfo.image
        ) {
          const data = {
            ...userData,
            photo: response.newData.data.PersonalInfo.image,
          };
          dispatch({ type: "SET_DATA", payload: data });
        }
        if (response) {
          if (response.newData) {
            setOrginalData(response.newData.data);
            setEditedData((el) => ({
              ...el,

              email: response.newData.data.Email,
              PersonalInfo: {
                ...el.PersonalInfo,
                image: "",
                photo: null,
                firstName: response.newData.data.PersonalInfo.firstName,
                dateOfBirth: dateToDateInputGenerator(
                  "",
                  new Date(
                    response.newData.data.PersonalInfo.dateOfBirth
                  ).toLocaleDateString()
                ),
                gender: response.newData.data.PersonalInfo.gender,
                interest: response.newData.data.PersonalInfo.interest,
                secondName: response.newData.data.PersonalInfo.secondName,
                state: response.newData.data.PersonalInfo.state,
              },
              partnerData: {
                ...el.partnerData,
                gender: response.newData.data.PartnerData.gender,
              },
            }));
            handleAlert("success", "datas updated");
          } else {
            handleAlert("info", "data not updated");
          }
        } else {
          throw new Error("data not updated");
        }
        setActive("info");
        setTempPhot("");
        setEditUser(false);
        setLoading(false);
        window.scroll({ top: 0, behavior: "smooth" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoading(false);
          alertWithOk(
            "Update Error",
            error.message || "error on updata",
            "error"
          );
        } else {
          console.warn(error);
        }
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  }

  const [active, setActive] = useState<"info" | "edit Data" | "changePassword">(
    "info"
  );

  const toggle = (from: "editInfo" | "personalInfo" | "changePassword") => {
    if (from === "personalInfo") {
      if (active !== "info") {
        setActive("info");
      }
      if (editUser === true) {
        setEditUser(false);
      }
    } else if (from === "editInfo") {
      if (active !== "edit Data") {
        setActive("edit Data");
      }
      if (editUser === false) {
        setEditUser(true);
      }
    } else if (from === "changePassword") {
      if (active !== "changePassword") {
        setActive("changePassword");
      }
      if (editUser === true) {
        setEditUser(false);
      }
    }
  };
  function handleReset() {
    setEditedData((el) => ({
      ...el,
      PersonalInfo: {
        ...el.PersonalInfo,
        firstName: orginalData.PersonalInfo.firstName,
        secondName: orginalData.PersonalInfo.secondName,
        dateOfBirth: new Date(
          orginalData.PersonalInfo.dateOfBirth
        ).toLocaleDateString(),
        gender: orginalData.PersonalInfo.gender,
        image: "",
        interest: orginalData.PersonalInfo.interest,
        photo: null,
        state: orginalData.PersonalInfo.state,
      },
      partnerData: {
        ...el.partnerData,
        gender: orginalData.PartnerData.gender,
      },
      email: orginalData.Email,
    }));
    handleRemovePhoto();
  }

  //////////////handle interst////////////////

  function handleInterest(item: string) {
    if (!editedData.PersonalInfo.interest?.length) {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: { ...el.PersonalInfo, interest: [item] },
      }));
    } else if (editedData.PersonalInfo.interest?.includes(item)) {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: {
          ...el.PersonalInfo,
          interest: el.PersonalInfo.interest?.filter((elm) => elm !== item),
        },
      }));
    } else if (
      editedData.PersonalInfo.interest?.length &&
      editedData.PersonalInfo.interest.length >= 5
    ) {
      showToast("maximum interest choice is finished");
    } else {
      setEditedData((el) => ({
        ...el,
        PersonalInfo: {
          ...el.PersonalInfo,
          interest: [...(el.PersonalInfo.interest || []), item],
        },
      }));
    }
  }
  return (
    <>
      {loading && (
        <div className="w-full flex items-center justify-center  h-full  fixed bg-[#00000032] z-50">
          <CircularIndeterminate />
        </div>
      )}
      <div className="w-full flex   items-center justify-evenly  pb-12  md:min-h-[1100px]   bg-blue-100 ">
        <Navbar active="profile setting" setLoading={setLoading} />
        <div className="w-[90%] min-h-svh flex md:flex-row items-center flex-col md:items-start pt-36 gap-5   ">
          {openPopUp && (
            <div className="w-full h-screen  z-[1] fixed -top-0 flex justify-center items-center">
              <div className="sm:w-[40%] w-[60%] h-[60%] shadow shadow-dark-blue border-4 border-blue-200 bg-white  rounded-3xl flex flex-col  items-center">
                <div className="w-full h-8  flex rounded-xl justify-end items-center px-4">
                  <p
                    onClick={() => (
                      setOpenPopUp(false),
                      setSwitchTopassword(false),
                      setActive("info"),
                      setWarning("")
                    )}
                    className="text-xl cursor-pointer font-bold text-theme-blue"
                  >
                    X
                  </p>
                </div>
                {/* <div className="w-full h-20 px-5 bg-green-500 pt-2  ">
                   </div> */}

                <div className="w-10 h-10 rounded-full">
                  <img
                    src="/reset-password.png"
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <p className=" font-playfair font-semibold sm:text-3xl text-sm ">
                  Forgot your Password ?
                </p>

                {/* /////////////////////////passowrd part////////////////// */}
                {!switchTopassword ? (
                  <>
                    <div className="w-full h-10   mt-3 flex justify-center items-center">
                      <p className="font-acme sm:text-base text-xs  text-theme-blue">
                        ENTER OTP
                      </p>
                    </div>
                    <div className="w-full h-16  mt-2 flex justify-center items-center">
                      <div className="sm:w-36 w-20 sm:h-14 h-10 border ">
                        <input
                          onChange={(t) => setOtp(parseInt(t.target.value))}
                          min={1}
                          max={1000000}
                          type="number"
                          className="h-full font-bold w-full px-2 outline-none text-center text-dark-blue "
                        />
                      </div>
                    </div>
                    <div className="sm:w-36 w-28 sm:h-6 h-5 font-semibold text-center text-dark_red">
                      {warnning && warnning}
                    </div>
                    <div className="sm:w-36  font-bold w-28 mt-1 sm:h-10 h-8  inline-flex justify-between">
                      {openPopUp === true && (
                        <CountdownProfile
                          expiryTimeStamp={expiryTimeStamp}
                          from="userProfile"
                        />
                      )}
                    </div>
                    <div className="sm:w-36 w-28 mt-2 sm:h-10 h-8 flex justify-center items-center ">
                      <button
                        onClick={handleOTPSent}
                        className="cursor-pointer relative group  overflow-hidden border-2 sm:px-8 px-4 sm:py-1 border-theme-blue"
                      >
                        <span className="font-bold text-white  relative z-10 group-hover:text-theme-blue duration-500">
                          SUBMIT
                        </span>
                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:-translate-x-full h-full"></span>
                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-x-full h-full"></span>

                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
                        <span className="absolute delay-300 top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-y-full h-full"></span>
                      </button>
                    </div>
                  </>
                ) : (
                  ///////////////////////// passsword Typing part/////////////////////////////
                  <div className="w-[95%] mt-5 h-[55%]   flex    items-center flex-col">
                    <div className="w-[60%]   flex  flex-col justify-between h-[45%] ">
                      <label
                        htmlFor=""
                        className="text-slate-700 font-bold sm:text-sm text-sm "
                      >
                        PASSWORD
                      </label>
                      <div className="mb-2 h-8 mt-1 w- border rounded-md">
                        <input
                          onChange={inputPassword}
                          name="password"
                          className="w-full font-semibold h-full border rounded-md text-black px-2"
                          type="text"
                        />
                      </div>
                      <div className="w-full h-6  text-dark_red sm:text-base text-xs relative group">
                        {PasswordWarnning.password}
                        {PasswordWarnning.password ===
                          "password is not strong" && (
                          <span className=" absolute px-2 py-2   text-white rounded-full bg-[rgba(92,92,254)] bottom-8 hidden group-hover:flex justify-center text-sm items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            insert upper,lower,number and charecters more than 8
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-[60%] mt-2  flex  flex-col justify-between h-[45%] ">
                      <label
                        className="text-slate-700 font-bold sm:text-sm text-sm"
                        htmlFor=""
                      >
                        CONFIRM PASSWORD
                      </label>
                      <div className="mb-2 h-8 mt-1 w- border rounded-md">
                        <input
                          name="confirmPassword"
                          onChange={inputPassword}
                          className="w-full h-full px-2 border rounded-md text-gray-800 "
                          type="password"
                        />
                      </div>
                      <div className="w-full h-6 text-dark_red sm:text-base text-xs ">
                        {PasswordWarnning.confirmPassword}
                      </div>
                    </div>
                    <div className="sm:w-[100%] w-28  mt-2 sm:h-10 h-8 flex justify-center items-center ">
                      <button
                        onClick={submitPassword}
                        className="cursor-pointer relative group  overflow-hidden border-2 sm:px-8 px-4 sm:py-1 border-theme-blue"
                      >
                        <span className="font-bold text-white  relative z-10 group-hover:text-theme-blue duration-500">
                          RESET
                        </span>
                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:-translate-x-full h-full"></span>
                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-x-full h-full"></span>

                        <span className="absolute top-0 left-0 w-full bg-theme-blue duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
                        <span className="absolute delay-300 top-0 left-0 w-full bg-theme-blue duration-500 group-hover:translate-y-full h-full"></span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ////////////////menuBar///////////////// */}
          <div className="md:w-[20%] w-[70%]  md:h-[400px] h-[500px]  pt-6 flex flex-col items-center   bg-white border-2 rounded-lg">
            <div className="w-[80%] h-[40%]   rounded-xl relative">
              {/* ////////////////profile picture///////////////// */}
              <img
                className="w-full h-full rounded-xl"
                src={
                  editUser
                    ? tempPhoto ||
                      orginalData.PersonalInfo.image ||
                      "photoUpload.png"
                    : orginalData.PersonalInfo.image || "photoUpload.png"
                }
              />
              <input
                type="file"
                ref={profileRef}
                name="photo"
                onChange={handleFileInput}
                className="hidden"
                accept="image/*"
              />
              {editUser && (
                <div className="w-full h-full flex justify-center items-center absolute bg-[rgba(0,0,0,.4)] rounded-lg top-0">
                  {tempPhoto ? (
                    <img
                      src="/forbidden.png"
                      onClick={handleRemovePhoto}
                      className="w-10 h-10 mt-20 cursor-pointer rounded-full"
                      alt=""
                    />
                  ) : (
                    <button
                      onClick={handleClick}
                      className="w-[50%] h-8 bg-transparent border border-white rounded-full text-white"
                    >
                      CHANGE
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* ////////////////profile menu///////////////// */}
            <div className="w-[80%] h-[60%]  font-popin space-y-3 text-sm mt-5  font-semibold">
              <div
                onClick={() => toggle("personalInfo")}
                className={
                  active === "info"
                    ? "bg-gradient-to-r from-[#b2f17f] rounded-r-full to-[#e9f5ff]  text-amber-950  w-full flex h-[20%] gap-4  items-center  px-4 py-3 cursor-pointer "
                    : "hover:bg-gray-200  rounded-r-full cursor-pointer w-full flex h-[20%] gap-4  items-center  px-4 py-3"
                }
              >
                <img src="/profileDash.png" className="w-6 h-6" alt="" />
                <p>Profile info</p>
              </div>
              <div
                onClick={() => toggle("editInfo")}
                className={
                  active === "edit Data"
                    ? "bg-gradient-to-r from-[#b2f17f] rounded-r-full to-[#e9f5ff]  text-amber-950  w-full flex h-[20%] gap-4  items-center  px-4 py-3 cursor-pointer "
                    : "rounded-r-full hover:bg-gray-200 cursor-pointer w-full flex h-[20%] gap-4  items-center  px-4 py-3"
                }
              >
                <img src="/pen.png" className="w-6 h-6" alt="" />
                <p>Edit info</p>
              </div>
              <div
                onClick={() => (toggle("changePassword"), setOpenPopUp(true))}
                className={
                  active === "changePassword"
                    ? "bg-gradient-to-r from-[#b2f17f] rounded-r-full to-[#e9f5ff]  text-amber-950  w-full flex h-[20%] gap-4  items-center  px-4 py-3 cursor-pointer"
                    : "rounded-r-full hover:bg-gray-200 cursor-pointer w-full flex h-[20%] gap-4  items-center  px-4 py-3"
                }
              >
                <img src="/reset.png" className="w-6 h-6" alt="" />
                <p>Reset Password</p>
              </div>
            </div>
          </div>
          <div
            className={
              orginalData.currentPlan?.name
                ? "sm:w-[70%] md:pt-20 pt-10  md:px-16 px-8 w-[100%] md:w-[80%]  md:h-[1900px] h-[2900px]  rounded-lg drop-shadow-2xl bg-white"
                : "sm:w-[70%] md:pt-20 pt-10  md:px-16 px-8 w-[100%] md:w-[80%]  md:h-[1900px] h-[2350px]  rounded-lg drop-shadow-2xl bg-white"
            }
          >
            <div className="w-[100%] h-[90%] ">
              <div>
                {/* title */}

                <div className="w-full h-[72px]   ">
                  <p className="text-2xl text-[#333333] font-playfair  font-bold">
                    {editUser ? "Edit My Profile" : "My Profile"}
                  </p>
                </div>
                {/* personal info */}
                <div className="w-full mt-5 h-[50px] border-b pb-10  mb-4">
                  <p className="font-playfair text-amber-950 font-semibold">
                    Personal info
                  </p>
                </div>
                <div className="personal info grid md:grid-cols-3 grid-cols-1 h-auto gap-1  pb-20 border-b-4 border-black ">
                  <div className="w-full h-[120px] font-semibold  relative  md:col-span-2  ">
                    <div className="border h-10 rounded-md mt-7 ">
                      <input
                        type="text"
                        id="fname"
                        name="firstName"
                        disabled={!editUser}
                        onChange={editUser ? handleInputData : undefined}
                        value={
                          editUser
                            ? editedData.PersonalInfo?.firstName
                            : orginalData.PersonalInfo.firstName
                        }
                        className="profileInputs px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                      />
                      {editUser && (
                        <img
                          src="/undo.png"
                          className="w-4 h-4 cursor-pointer absolute right-3 top-10 "
                          onClick={() =>
                            setEditedData((el) => ({
                              ...el,
                              PersonalInfo: {
                                ...el.PersonalInfo,
                                firstName: orginalData.PersonalInfo.firstName,
                              },
                            }))
                          }
                          alt=""
                        />
                      )}
                    </div>
                    <label
                      className="block absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                      htmlFor="fname"
                    >
                      First name:
                    </label>
                    <p className="text-sm mt-2 ml-2 text-dark_red">
                      {formWarning.firstName}
                    </p>
                  </div>

                  <div className="w-full relative h-[120px] ">
                    <div className="border h-10 rounded-md mt-7 font-semibold ">
                      <input
                        type="text"
                        id="sname"
                        disabled={!editUser}
                        value={
                          editUser
                            ? editedData.PersonalInfo?.secondName
                            : orginalData.PersonalInfo.secondName
                        }
                        name="secondName"
                        onChange={editUser ? handleInputData : undefined}
                        className="profileInputs px-4  font-popin  rounded-md w-[100%] active:border-2 h-full "
                      />
                      {editUser && (
                        <img
                          src="/undo.png"
                          className="w-4 h-4 cursor-pointer absolute right-3 top-10 "
                          onClick={() =>
                            setEditedData((el) => ({
                              ...el,
                              PersonalInfo: {
                                ...el.PersonalInfo,
                                secondName: orginalData.PersonalInfo.secondName,
                              },
                            }))
                          }
                          alt=""
                        />
                      )}
                    </div>
                    <label
                      className="block font-semibold  absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                      htmlFor="sname"
                    >
                      Last name:
                    </label>
                    <p className="text-sm mt-2 ml-2 font-semibold text-dark_red">
                      {formWarning.secondName}
                    </p>
                  </div>
                  <div className="w-full h-[120px] relative  font-semibold">
                    <div>
                      <div className="border h-10 rounded-md mt-7 w-[100%]">
                        <input
                          type="text"
                          id="age"
                          disabled={editUser}
                          value={orginalData.PersonalInfo.age}
                          className="profileInputs px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                        />
                      </div>
                      <label
                        className="block absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                        htmlFor="age"
                      >
                        Age:
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[120px]  relative">
                    <div>
                      <div className=" h-10 rounded-md mt-7 w-[100%] font-semibold">
                        {editUser ? (
                           <Select
                            onValueChange={(v) =>
                              selectInputChange("gender", v)
                            }
                            value={editedData.PersonalInfo.gender}
                            disabled={!editUser}
                          
                          >
                            <SelectTrigger id="gender" className="w-full h-full  ">
                              <SelectValue placeholder="gender" />
                            </SelectTrigger> 
                            <SelectContent >
                             <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <input
                            type="text"
                            name="firstName"
                            value={orginalData.PersonalInfo.gender}
                            className="profileInputs px-4  border outline-none font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                          />
                        )}
                        {editUser && (
                          <div className="w-4 h-4 cursor-pointer absolute right-8 top-10 ">
                            <img
                              src="/undo.png"
                              className=""
                              onClick={() =>
                                setEditedData((el) => ({
                                  ...el,
                                  PersonalInfo: {
                                    ...el.PersonalInfo,
                                    gender: orginalData.PersonalInfo.gender,
                                  },
                                }))
                              }
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                      <label
                        className="block font-semibold absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                        htmlFor="gender"
                      >
                        Gender:
                      </label>
                    </div>
                  </div>
                  <div className="w-full h-[120px]  relative">
                    <div>
                      <div className=" h-10   rounded-md mt-7 font-semibold w-[100%] overflow-hidden">
                        {editUser ? (
                          <Select
                            onValueChange={(v) =>
                              selectInputChange("district", v)
                            }
                            value={editedData.PersonalInfo.state}
                            disabled={!editUser}
                          
                          >
                            <SelectTrigger id="district" className="w-full h-full  ">
                              <SelectValue placeholder="gender" />
                            </SelectTrigger>
                            <SelectContent >
                              {districtsOfKerala?.map((el, index) => (
                                <SelectItem key={index} value={el}>
                                  {el}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <input
                            type="text"
                            id=""
                            name=""
                            disabled={!editUser}
                            value={orginalData.PersonalInfo.state}
                            className="profileInputs border px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                          />
                        )}
                      </div>
                      <label
                        className="font-semibold block absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                        htmlFor="district"
                      >
                        District:
                      </label>
                      {editUser && (
                        <img
                          src="/undo.png"
                          className="w-4 h-4 cursor-pointer absolute right-8 top-10 "
                          onClick={() =>
                            setEditedData((el) => ({
                              ...el,
                              PersonalInfo: {
                                ...el.PersonalInfo,
                                state: orginalData.PersonalInfo.state,
                              },
                            }))
                          }
                          alt=""
                        />
                      )}
                    </div>
                  </div>

                  {/* //////////////////date of birth/////////////// */}
                  <div className="w-full h-[120px] relative ">
                    {editUser ? (
                      <div>
                        <div className="border font-semibold   h-10 rounded-md mt-7 w-[100%]">
                          <input
                            type="date"
                            id="date"
                            name="dateOfBirth"
                            onChange={editUser ? handleInputData : undefined}
                            value={dateToDateInputGenerator(
                              "intoInput",
                              new Date(
                                editedData.PersonalInfo.dateOfBirth
                              ).toDateString()
                            )}
                            className="profileInputs px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                          />
                          {editUser && (
                            <img
                              src="/undo.png"
                              className="w-4 h-4 cursor-pointer absolute right-10 top-10 "
                              onClick={() =>
                                setEditedData((el) => ({
                                  ...el,
                                  PersonalInfo: {
                                    ...el.PersonalInfo,
                                    dateOfBirth: new Date(
                                      orginalData.PersonalInfo.dateOfBirth
                                    ).toDateString(),
                                  },
                                }))
                              }
                              alt=""
                            />
                          )}
                        </div>
                        <label
                          className="block absolute font-semibold -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                          htmlFor="date of birth "
                        >
                          Date of birth{" "}
                          <span className="text-gray-700"> (MM-DD-YYYY)</span> :
                        </label>
                        <p className="text-sm mt-2 ml-2 font-semibold text-dark_red">
                          {formWarning.dob}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="border font-semibold  h-10 rounded-md mt-7 w-[100%]">
                          <input
                            type="text"
                            disabled={!editUser}
                            name="dateOfBirth"
                            value={dateToDateInputGenerator(
                              "",
                              orginalData.PersonalInfo.dateOfBirth
                            )}
                            className="profileInputs px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full "
                          />
                        </div>
                        <label
                          className="block absolute font-semibold -top-1 cursor-pointer peer-placeholder-shown:uppercase"
                          htmlFor="age"
                        >
                          Date of birth:
                        </label>
                      </div>
                    )}
                  </div>

                  {/* //////////////////email/////////////// */}

                  <div className="w-full h-[120px] relative  md:col-span-2 ">
                    <div>
                      <div className="border h-10 rounded-md mt-7 w-[100%] relative">
                        <input
                          disabled={!editUser}
                          type="email"
                          id="email"
                          name="email"
                          onChange={editUser ? handleInputData : undefined}
                          value={
                            editUser ? editedData.email : orginalData.Email
                          }
                          className="profileInputs font-semibold px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full 
                        outline-none 
                        "
                        />
                        {editUser && (
                          <img
                            src="/undo.png"
                            className="w-4 h-4 cursor-pointer absolute right-3 top-3"
                            onClick={() =>
                              setEditedData((el) => ({
                                ...el,
                                email: orginalData.Email,
                              }))
                            }
                            alt=""
                          />
                        )}
                      </div>
                      <label
                        className="block font-semibold absolute -top-1 cursor-pointer peer-placeholder-shown:uppercase "
                        htmlFor="email"
                      >
                        Email:
                      </label>
                      <div className="w-full flex mt-2 px-2 justify-between items-center">
                        <p className=" text-sm font-s   font-semibold text-dark_red">
                          {formWarning.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner info */}
                <div className="pb-6 border-b-4 border-black">
                  <div className="w-full mt-5 h-[50px] border-b pb-10  mb-4">
                    <p className="font-playfair  text-amber-950 font-semibold">
                      Partner gender
                    </p>
                  </div>
                  <div className="w-full h-[120px]  ">
                    <div>
                      <label
                        className="block  font-semibold  -top-1 cursor-pointer peer-placeholder-shown:uppercase "
                        htmlFor="partnerGender"
                      >
                        Gender:
                      </label>

                      {editUser ? (
                        <div className=" h-10 rounded-md mt-5 w-[100%] relative">
                          <Select
                            onValueChange={(v) =>
                              selectInputChange("partnerGender", v)
                            }
                            value={editedData.partnerData.gender}
                            disabled={!editUser}
                          >
                            <SelectTrigger
                              id="partnerGender"
                              className="w-full"
                            >
                              <SelectValue placeholder="gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>

                          {editUser && (
                            <img
                              src="/undo.png"
                              className="w-4 h-4 cursor-pointer top-2 right-8 absolute "
                              onClick={() =>
                                setEditedData((el) => ({
                                  ...el,
                                  partnerData: {
                                    ...el.partnerData,
                                    gender: orginalData.PartnerData.gender,
                                  },
                                }))
                              }
                              alt=""
                            />
                          )}
                        </div>
                      ) : (
                        <div className="border  h-10 rounded-md mt-5 w-[100%] relative">
                          <input
                            disabled={!editUser}
                            type="text"
                            id="partnerGender2"
                            name="partnerGender"
                            onChange={editUser ? handleInputData : undefined}
                            value={
                              editUser
                                ? editedData.partnerData.gender
                                : orginalData.PartnerData.gender
                            }
                            className="profileInputs font-semibold px-4  font-popin text-sm  rounded-md w-[100%] active:border-2 h-full 
                        outline-none 
                        "
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PLAN INFO */}
                <div className="w-full mt-5 h-[50px] border-b pb-10  mb-4">
                  <p className="font-playfair text-amber-950 font-semibold">
                    Plan info
                  </p>
                </div>
                {!orginalData.currentPlan?.name ? (
                  <div className="w-full h-[500px] relative border flex justify-center  flex-col items-center">
                    <div className="w-full h-[9%] absolute  bottom-0 right-0 left-0 bg-black flex justify-center items-center">
                      <p className=" text-white font-bold font-playfair">
                        NO PLAN AVAILABLE
                      </p>
                    </div>
                    <FontAwesomeIcon
                      onClick={() => navigate("/PlanDetails")}
                      icon={faCreditCard}
                      beatFade
                      size="6x"
                      style={{ color: "#d10e00", cursor: "pointer" }}
                    />
                    <p className="text-sm text-amber-950 font-extrabold font-playfair mt-4">
                      BUY A PLAN
                    </p>
                  </div>
                ) : (
                  <div className="personal info    grid  sm:grid-cols-1 md:grid-cols-3 h-auto gap-2  pb-20 border-b-4 border-black ">
                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">NAME:</p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {orginalData.currentPlan?.name}
                      </p>
                    </div>
                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">STATUS:</p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {orginalData?.subscriptionStatus}
                      </p>
                    </div>
                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">AMOUNT:</p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {orginalData?.currentPlan?.amount}
                      </p>
                    </div>

                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">CONNECT:</p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {orginalData?.currentPlan?.connect}
                      </p>
                    </div>
                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">
                        AVAILABLE CONNECT:
                      </p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {orginalData.currentPlan?.avialbleConnect}
                      </p>
                    </div>
                    <div className="w-full h-[120px] flex justify-center flex-col items-center border rounded-xl">
                      <p className="font-semibold  mb-2  text-xs">
                        AVAILABLE CONNECT:
                      </p>
                      <p className="md:text-xl font-popin text-amber-950 font-bold">
                        {dateToDateInputGenerator(
                          "",
                          new Date(
                            orginalData.currentPlan?.Expiry
                          ).toDateString()
                        )}
                      </p>
                    </div>
                    <div className="w-full flex md:h-[150px] sm:[200px]  flex-col h-[200px] rounded-2xl   gap-4 border md:col-span-3 col-span-1">
                      <div className="w-full h-[10%] font-semibold pt-2 pl-6">
                        Feature
                      </div>
                      <div className="w-full h-[90%] flex p-4 flex-wrap ">
                        {orginalData.currentPlan?.features.map((el, index) => {
                          return (
                            <>
                              <div
                                key={index}
                                className=" text-white ml-2 md:text-base text-xs flex justify-center items-center bg-black rounded-full h-10 "
                              >
                                {" "}
                                <span className=" px-5 py-10 ">{el}</span>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* //////////////interest///////////////// */}
                <div className="w-full mt-5 h-[50px] border-b pb-10  mb-4">
                  <p className="font-playfair  font-semibold ">Interest</p>
                </div>

                <div className="w-full flex flex-col mt-5    md:h-[190px]  mb-4  max-h-[190px] bg-gray-200 rounded-md">
                  <div className="w-full px-2 pt-4 gap-4  flex justify-evenly overflow-y-auto   pb-11 content-around h-[85%] flex-wrap ">
                    {editUser &&
                      interest?.map((el, index) => {
                        return (
                          <>
                            {editedData.PersonalInfo?.interest?.includes(el) ? (
                              <div
                                onClick={() => handleInterest(el)}
                                key={`edited-${index}`}
                                className="min-h-10 md:w-[20%] w-[30%]  cursor-pointer   rounded-full text-white flex justify-center items-center bg-black  "
                              >
                                {el}
                              </div>
                            ) : (
                              <div
                                onClick={() => handleInterest(el)}
                                key={`edited-2-${index}`}
                                className="min-h-10 md:w-[20%] w-[30%] cursor-pointer  rounded-full text-black flex justify-center items-center font-semibold bg-white border  "
                              >
                                {el}
                              </div>
                            )}
                          </>
                        );
                      })}
                    {!editUser &&
                      orginalData.PersonalInfo?.interest?.map((el, index) => {
                        return (
                          <>
                            <div
                              key={`view-${index}`}
                              className="min-h-10 md:w-[20%] w-[30%]  hover:bg-stone-700 transition-colors duration-500 ease-in-out rounded-full text-white flex justify-center items-center bg-black  "
                            >
                              {el}
                            </div>
                          </>
                        );
                      })}
                  </div>
                  <div className="w-full h-[15%]  px-5 font-semibold flex justify-between items-center ">
                    {editUser && (
                      <img
                        src="/undo.png"
                        className="w-4 h-4 cursor-pointer  right-3 top-10 "
                        onClick={() =>
                          setEditedData((el) => ({
                            ...el,
                            PersonalInfo: {
                              ...el.PersonalInfo,
                              interest: orginalData.PersonalInfo.interest,
                            },
                          }))
                        }
                        alt=""
                      />
                    )}
                    {editUser ? (
                      <p className="">
                        {editedData.PersonalInfo.interest?.length || 0}
                        {"/"}5
                      </p>
                    ) : (
                      <p className=" text-red-600">
                        {orginalData.PersonalInfo.interest?.length || 0}
                      </p>
                    )}
                  </div>
                </div>

                {/* /////////////////buttong/////////////////////////// */}

                <div className="w-full h-[100px] mt-5  flex justify-center items-center">
                  {!editUser && (
                    <FontAwesomeIcon
                      icon={faCircleUp}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      bounce
                      size="3x"
                      style={{ color: "#700000", cursor: "pointer" }}
                    />
                  )}

                  {editUser && (
                    <Button
                      onClick={() => submitEditedData()}
                      className="
        group 
        relative 
        mr-4
       md:px-24 
        md:py-6
        px-16
        py-6  
        overflow-hidden 
        rounded-full 
        bg-gradient-to-r 
        from-blue-500 
        to-blue-600 
        text-white 
        shadow-lg 
        hover:shadow-xl 
        transition-all 
        duration-300 
        ease-in-out 
        transform 
        hover:-translate-y-1 
        hover:scale-105
      "
                    >
                      <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Submit</span>
                      </div>
                    </Button>
                  )}

                  {editUser && (
                    <Button
                      onClick={() => handleReset()}
                      className="
          group 
          relative 
          md:px-24 
          md:py-6
          px-10
          py-6 
          rounded-full 
          border-2 
          border-gray-300 
          text-gray-500
          hover:bg-gray-100 
          transition-all 
          duration-300 
          ease-in-out 
          flex 
          items-center 
          space-x-2
        "
                    >
                      <div className="flex items-center space-x-2">
                        <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
                        <span>Reset</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default UserProfile;

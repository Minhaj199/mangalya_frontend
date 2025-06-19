import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignupContext } from "../../shared/globalCondext/signupData";
import { Countdown } from "@/components/user/timer/Countdown";
import { request } from '../../utils/axiosUtil' 
import { alertWithOk, handleAlert } from "../../utils/alert/SweeAlert";
import { promptSweet } from "../../utils/alert/SweeAlert";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "@/types/typesAndInterfaces"; 
import CircularIndeterminate from "@/components/circularLoading/Circular";
import { Footer } from "@/components/user/footer/Footer";

export interface CredentialInterface {
  [key: string]: string;
}

 const OTPVerification: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: IReduxState) => state.userData);
  const navigate = useNavigate();
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("");
  }
  const { signupFirstData, setSignupFirst } = context;
  const [otp, setOpt] = useState<string>("");
  const [warning, setWarning] = useState<string>();
  const [expiryTimeStamp] = useState<Date>(new Date(Date.now() + 120000));
  const [loading, setLoading] = useState<boolean>(false);

  async function handleReset() {
    if (otp.length === 6) {
      setWarning("");
      try {
        if (!signupFirstData.EMAIL) {
          navigate("/signup");
        }
        setLoading(true);
        const Response: { message: string } = await request({
          url: "/user/otpValidation",
          method: "post",
          data: { otp: otp, email: signupFirstData.EMAIL, from: "signup" },
        });
       
        if (Response) {
          if (Response?.message === "OTP valid") {
            const response: { message: string; token: string } = await request({
              url: "/user/firstBatchData",
              method: "post",
              data: signupFirstData,
            });
            if (response?.message && response.message === "sign up completed") {
              localStorage.setItem("userToken", response.token);
              promptSweet(
                routeToPhoto,
                "Do you want to continue adding details ?",
                "Basic account creation completed",
                secondFunction
              );
              async function routeToPhoto() {
                dispatch({
                  type: "SET_DATA",
                  payload: {
                    ...userData,
                    subscriptionStatus: "Not subscribed",
                  },
                });
                navigate("/photoAdding");
              }
              async function secondFunction() {
                dispatch({
                  type: "SET_DATA",
                  payload: {
                    ...userData,
                    subscriptionStatus: "Not subscribed",
                  },
                });
                setSignupFirst({
                  "FIRST NAME": "",
                  "SECOND NAME": "",
                  "DATE OF BIRTH": "",
                  "GENDER OF PARTNER": "",
                  "DISTRICT THAT YOU LIVE": "",
                  "YOUR GENDER": "",
                  EMAIL: "",
                  PASSWORD: "",
                });
                alertWithOk(
                  "Signup completed",
                  "Best of luck with you journy",
                  "success"
                );
                navigate("/PlanDetails");
              }
            }else{
              throw new Error(response.message)
            }
          } else if (Response?.message === "OTP not valid") {
            setLoading(false);
            alertWithOk("OTP Validation", "Your OTP is not valid", "warning");
            setWarning(Response?.message);
          }
        } else {
          throw new Error("no response");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          handleAlert("error", error.message || "internal server error");
        }
      }finally{
        setLoading(false)
      }
    } else {
      setWarning("please insert 6 charectors");
    }
  }

  return (
    <>
      {loading && (
        <div className="w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-10">
          <CircularIndeterminate />
        </div>
      )}
      <div
        id="container2"
        className=" flex flex-col justify-center items-center w-screen md:h-svh sm:h-svh  h-svh sm:pt-0 pt-12  bg-cover bg-center"
      >
        <div className="w-full h-20 fixed top-0 right-0 left-0 p-5 ">
          <p
            className="font-Lumanosimo text-white text-sm sm:text-base cursor-pointer"
            onClick={() => navigate("/signUp")}
          >
            BACK
          </p>
        </div>

        <div className="w-28 relative top-[50px] h-28 rounded-full  ">
          <img src="/createProfile.png" alt="" />
        </div>
        <div className="flex  items-center flex-col  sm:h-96 sm:w-2/4 md:w-2/4 md:h-96 lg:h-96  w-5/6 h-96 lg:w-1/3 rounded-3xl bg-[rgba(25,88,99,0.5)]">
          <div className="h-[100px] w-full  flex justify-center items-end">
            <p className="font-inter   text-2xl text-white">ENTER OTP</p>
          </div>
          <div className="flex-col h-3/6 w-full  flex justify-center items-center">
            <input
              type="text"
              max={6}
              value={otp}
              onChange={(t) => setOpt(t.target.value)}
              className="h-16 border border-theme-blue bg-slate-300 w-1/3 font-black  font-mono text-2xl  text-center"
            />
            <p className="font-sans font-semibold cursor-pointer text-white mt-1">
              {warning ? warning : warning}
            </p>
            <Countdown expiryTimeStamp={expiryTimeStamp} from="signup" />
          </div>
          <button
            className="bg-white py-3 px-6 rounded-full font-bold text-neutral-900 font-inter"
            onClick={handleReset}
          >
            SUBMIT
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default OTPVerification

import React, { useContext, useEffect, useState } from "react";
import { credential_validation } from "../../validators/signupValidator";

import { useNavigate } from "react-router-dom";
import "./Credential.css";
import { Inputs } from "../../components/user/signupInputs/Inputs";
import { SignupContext } from "../../shared/globalCondext/signupData";
import { request } from "../../utils/AxiosUtils";

import { PhotAndInt } from "./photoAndInterest.tsx/PhotAndInt";
import { alertWithOk, handleAlert } from "../../utils/alert/SweeAlert";

import { useDispatch } from "react-redux";
import CircularIndeterminate from "@/components/circularLoading/Circular";
import { Footer } from "@/components/user/footer/Footer";

export interface CredentialInterface {
  [key: string]: string;
}
export interface InputArrayProbs {
  inputFields: {
    linkingName: string;
    inputType: string;
    inputName: string;
    option?: string[];
  }[];
  toggle: number;
}
export type PhotoAndInterest = {
  photo?: File | null;
  interest?: string[];
};
export const Credentials: React.FC<InputArrayProbs> = ({
  inputFields,
  toggle,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const context = useContext(SignupContext);
  const [inputToggle] = useState<number>(toggle);
  const [photoAndInter, setPhotAndInter] = useState<PhotoAndInterest>({
    photo: null,
    interest: [],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!context) {
    throw new Error("no contex");
  }

  const { setSignupFirst, signupFirstData } = context;
  const basic =
    "flex justify-center items-center  w-full md:h-svh sm:h-auto  h-auto sm:pt-0 pt-12  bg-cover bg-center";
  const photo =
    "flex justify-center items-center w-full md:h-lvh sm:h-lvh  h-lvh sm:pt-0 pt-12  bg-cover bg-center";

  const [credentialData, setCredentialData] = useState<CredentialInterface>({});
  const [warnning, setWarnning] = useState<CredentialInterface>({});
  const [loading, setLoding] = useState<boolean>(false);
  const navigate = useNavigate();
  async function submintCredential() {
    if (inputToggle === 1) {
      if (await credential_validation(credentialData, setWarnning)) {
        const signupFirst = {
          "SECOND NAME": credentialData["SECOND NAME"],
          "DATE OF BIRTH": credentialData["DATE OF BIRTH"],
          "DISTRICT THAT YOU LIVE": credentialData["DISTRICT THAT YOU LIVE"],
          "YOUR GENDER": credentialData["YOUR GENDER"],
          "GENDER OF PARTNER": credentialData["GENDER OF PARTNER"],
          EMAIL: credentialData["EMAIL"],
          PASSWORD: credentialData["PASSWORD"],
          "FIRST NAME": credentialData["FIRST NAME"],
        };
        setLoding(true);
        try {
          const Response = await request({
            url: "/user/otpCreation",
            method: "post",
            data: { email: credentialData.EMAIL, from: "signup" },
          });

          if (
            Response &&
            typeof Response === "object" &&
            Object.values(Response).includes("Email send successfull")
          ) {
            setCredentialData({});
            navigate("/otpVerification");
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            alertWithOk("signup", error.message || "error on signup", "error");
          }
          console.error(error);
        }
        finally{
          setLoding(false)
        }
        setSignupFirst(signupFirst);
      }
    } else if (inputToggle === 2) {
      try {
        if (
          photoAndInter.photo ||
          (photoAndInter.interest?.length && photoAndInter.interest?.length > 0)
        ) {
          setLoding(true);
          const formData = new FormData();

          formData.append("email", signupFirstData["EMAIL"]);
          if (photoAndInter.photo) {
            const photo = photoAndInter.photo || "";
            formData.append("file", photo);
          }
          if (photoAndInter.interest) {
            formData.append(
              "interest",
              JSON.stringify(photoAndInter.interest || [""])
            );
          }
          type Response = {
            url: boolean;
            responseFromAddinInterest: boolean;
          };
          const response: Response = await request({
            url: "/user/uploadProfile",
            method: "post",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response) {
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
            if (response.responseFromAddinInterest || response.url) {
              dispatch({
                type: "SET_DATA",
                payload: {
                  photo: response.url || "",
                  subscriptionStatus: "Not subscribed",
                },
              });
              handleAlert("success", "Data Added");
              setTimeout(() => {
                navigate("/PlanDetails");
              }, 3000);
            } else {
              navigate("/");
            }
          }
        } else {
          navigate("/PlanDetails");
        }
      } catch (error) {
        if (error) {
          handleAlert("error", "some error in photo and interest");
        }
      }finally{
        setLoding(false)
      }
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
        onScroll={() => alert("hii")}
        className={inputToggle === 1 ? basic : photo}
      >
        <div
          className={
            scrolled
              ? "w-full z-40 h-20 fixed top-0 right-0 left-0 p-5 bg-black"
              : "w-full h-20 fixed top-0 right-0 left-0 p-5 "
          }
        >
          <p
            className="font-Lumanosimo text-white text-sm sm:text-base cursor-pointer"
            onClick={() => navigate("/")}
          >
            BACK
          </p>
        </div>

        <div
          className={
            inputToggle === 1
              ? "w-3/5 sm:w-4/5 h-auto sm:h-auto bg-[rgba(25,88,99,0.5)] rounded-2xl"
              : "w-[99%] sm:w-4/5 h-auto sm:h-auto bg-[rgba(25,88,99,0.5)] rounded-2xl"
          }
        >
          <div className="w-full h-20 flex justify-center items-center">
            <div className="h-20 w-20 sm:h-full sm:w-[90px]   rounded-full relative sm:top-2">
              <img src="/createProfile.png" className="w-full h-full" alt="" />
            </div>
          </div>
          <div className="w-full h-auto sm:h-auto md:h-[425px]  flex flex-col items-center ">
            <p className="font-aborato text-[10px] sm:text-xl text-white pt-3 sm:pt-8 pb-7">
              JOIN OUR FAMILY{" "}
            </p>
            {inputToggle === 1 && (
              <div className="h-auto w-5/6 flext grid sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 grid-cols-1 gap-y-5 ">
                <Inputs
                  inputFields={inputFields}
                  setCredentialData={setCredentialData}
                  setWarnning={setWarnning}
                  CredentailData={credentialData}
                  Warning={warnning}
                />
              </div>
            )}
            {inputToggle === 2 && (
              <PhotAndInt
                probState={photoAndInter}
                probSetter={setPhotAndInter}
              ></PhotAndInt>
            )}
          </div>
          <div className="w-full h-12   flex justify-center items-center">
            <button
              onClick={submintCredential}
              className="bg-dark-blue w-1/3 h-10 rounded-2xl mb-5 mt-3 text-white font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

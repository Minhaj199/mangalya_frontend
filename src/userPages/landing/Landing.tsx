import "./Landing.css";

import { Footer } from "../../components/user/footer/Footer";
import { useEffect, useState } from "react";
import { Forgot_first } from "../../components/user/forgot/Forgot_first";
import { Forgot_second } from "../../components/user/forgot/Forgot_second";
import { Forgot_Final } from "../../components/user/forgot/Forgot_final";
import { Login } from "../../components/user/login/Login";
import { HomeCards } from "../../components/user/homeCards/HomeCards";
import { useDispatch } from "react-redux";
import { Info } from "../../components/user/homeInfo/Info";
import CircularIndeterminate from "@/components/circularLoading/Circular";

export const Landing = () => {
  const [loginTogle, changeTogle] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "CLEAR_DATA" });
  }, []);
  return (
    <div>
      {loading && (
        <div className="w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-10">
          <CircularIndeterminate />
        </div>
      )}
      <img
        className="sm:w-44 sm:h-16 m-4 w-28 h-12 fixed  cursor-pointer"
        src="./logo-no-background.png "
        alt=""
      />
      <div className="w-[100%]  h-svh bg-cover bg-center first_part">
        <div className={loginTogle !== "1" ? "hidden" : "w-full h-full"}>
          {/* <div  className= "w-full h-full"> */}
          <div className="w-full h-20   flex justify-between items-center p-5 ">
            <div className=" sm:h-16 sm:w-18 h-12 w-18"></div>

            <div
              onClick={() => changeTogle("2")}
              className="w-24 h-10 border border-white border-opacity-15 flex justify-center cursor-pointer items-center mr-5 relative top-0 left-0 right-0"
            >
              <p className="text-white font-italian ">LOGIN</p>
            </div>
          </div>
          <div className="w-[100%] h-2/4 flex justify-center  items-end">
            <h1 className="font-italian relative text-xl  text-white sm:text-3xl">
              Connecting Souls: Find Your Other Half
            </h1>
          </div>
          <div className="w-[100%] h-1/4  justify-center items-end flex"></div>
        </div>
        <Login
          changeToggle={changeTogle}
          loginTogle={loginTogle}
          setLoading={setLoading}
        />
        {loginTogle === "3" ? <Forgot_first changeToggle={changeTogle} /> : ""}
        {loginTogle === "4" ? <Forgot_second changeToggle={changeTogle} /> : ""}
        {loginTogle === "5" ? <Forgot_Final changeToggle={changeTogle} /> : ""}
      </div>
      <div className="w-[100%] relative h-auto bg-[#f0f5f9]  sm:h-auto lg:h-svh ">
        <HomeCards setToggle={changeTogle} />
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-16 cursor-pointer p-2 h-16 bottom-2 rounded-full right-2 bg-blue-400 absolute"
        >
          <img
            src="./up-arrow.gif"
            className="w-full h-full rounded-full"
            alt=""
          />
        </div>
      </div>
      <div className="w-[100%] min-h-lvh bg-white  sm:h-auto lg:h-svh ">
        <Info setToggle={changeTogle} />
      </div>
      <Footer />
      {/* <Footer />   */}
    </div>
  );
};

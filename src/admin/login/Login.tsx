import React, { useState } from "react";
import "./Login.css";

import { request } from "../../utils/AxiosUtils";

import { LoginValidatorAdmin } from "../../validators/loginValidatorForAdmin";
import { useNavigate } from "react-router-dom";
import { handleAlert } from "../../utils/alert/SweeAlert";
import { Footer } from "@/components/user/footer/Footer";
import {
  IAdminAuth,
  IAdminAuthicated,
  ILoginWarning,
} from "../../types/typesAndInterfaces";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [adminForm, setAdminForm] = useState<IAdminAuth>({
    email: "",
    password: "",
  });

  const [warnnig, setWarning] = useState<ILoginWarning>({
    username: "",
    password: "",
  });
  async function handleSubmit() {
    if (LoginValidatorAdmin(adminForm, setWarning)) {
      try {
        const response: IAdminAuthicated = await request({
          url: "/admin/login",
          method: "post",
          data: adminForm,
        });

        if (typeof response === "object" && response !== undefined) {
          if (Object.keys(response).includes("username")) {
            setWarning((prev) => ({
              ...prev,
              username: response.username || "",
              password: "",
            }));
          } else if (Object.keys(response).includes("password")) {
            setWarning((prev) => ({
              ...prev,
              password: response.password || "",
              username: "",
            }));
          } else if (Object.keys(response).includes("adminVerified")) {
            if (response?.adminVerified && response.token) {
              handleAlert("success", "welcome admin");
              localStorage.setItem("adminToken", response.token);

              navigate("/admin/Dash");
            } else {
              alert("validation faild try again");
            }
          }
        } else {
          console.log("error");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          handleAlert(
            "error",
            error.message || "internal server error at login"
          );
        }
        handleAlert("error", "internal server error at login");
      }
    }
  }
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center flex-col bg-[#69aaff] pb-10">
        <div className="h-[400px]  sm:h-4/6 sm:w-[40%]  w-[90%] bg-white rounded-[20px] border-4 border-dark-blue   ">
          <div className="w-full h-2/5 flex justify-center   items-center">
            <p className="font-inter font-extrabold text-2xl sm:text-3xl mt-12 text-theme-blue">
              WELCOME ADMIN
            </p>
          </div>
          <div className="w-full h-2/5 flex justify-center space-x-* items-center  flex-col">
            <div className="w-3/4 h-12 bg-black flex">
              <div className="h-full w-2/12 bg-dark-blue flex justify-center items-center">
                <img className="w-2/3 h-2/3" src="./avatar-design.png" alt="" />
              </div>
              <div className="h-full w-10/12">
                <input
                  onChange={(e) =>
                    setAdminForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full h-full outline-none bg-[#839bb8] text-white p-5 font-inter placeholder:text-yellow-50"
                  type="email"
                  placeholder="User Name"
                />
              </div>
            </div>
            <p className="text-red-600  w-52 h-12 font-serif ">
              {warnnig?.username ? warnnig.username : ""}
            </p>
            <div className="w-3/4 h-12 bg-black flex">
              <div className="h-full w-2/12 bg-dark-blue  flex justify-center items-center">
                <img className="w-2/4 h-2/4" src="./lock.png" alt="" />
              </div>
              <div className="h-full w-10/12">
                <input
                  onChange={(t) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      password: t.target.value,
                    }))
                  }
                  className="w-full h-full bg-[#839bb8] placeholder:text-yellow-50 text-white p-5 font-inter outline-none"
                  type="password"
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <p className="text-red-600  w-52 h-12 font-serif ">
              {warnnig?.password ? warnnig.password : ""}
            </p>
          </div>
          <div className="w-full h-1/5  flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className="w-2/5 h-10 text-theme-blue font-inter font-bold  border-2 border-theme-blue rounded-full "
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Login;

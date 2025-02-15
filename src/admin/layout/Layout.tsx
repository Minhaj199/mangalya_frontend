import { Footer } from "@/components/user/footer/Footer";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Layout = () => {
  const navigate = useNavigate();
  function handleLogOut() {
    localStorage.removeItem("adminToken");
    navigate("/login");
  }
  const [toggle, setToggle] = useState(false);
  function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    setToggle(false);
    e.stopPropagation();
  }
  const checkWindowSize = () => {
    if (window.innerWidth > 925) {
      setToggle(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", checkWindowSize);
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);
  return (
    <>
      <div
        className={
          toggle
            ? "hidden"
            : "z-[1] w-12 h-12 cursor-pointer rounded-full   hover:bg-gray-200 flex justify-center items-center  fixed top-5 left-10 lg:hidden"
        }
      >
        <img
          onClick={() => setToggle(true)}
          src="/menu-bar-dash.png"
          className="w-[60%] h-[60%] z-10"
          alt=""
        />
      </div>
      <div
        onClick={handleClose}
        className=" w-full min-h-svh   flex  bg-[#f0f5f9] pt-4 "
      >
        <div
          className={
            !toggle
              ? "h-[90%]  md:w-2/12 sm:w-[60%] w-[50%] ml-4 lg:block hidden  rounded-xl  bg-white shadow-2xl   "
              : "fixed h-[90%] z-20 md:w-2/12 sm:w-[60%] w-[50%] ml-4   rounded-xl   bg-white shadow-2xl  "
          }
        >
          <div className="w-full h-40 flex justify-center items-center ">
            <div className="w-[50%] h-[60%] opacity-70">
              <img className="w-full h-full" src="/logoBlack2.png" alt="" />
            </div>
          </div>
          <div className=" cursor-pointer   transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl w-full h-16   flex   items-center ">
            <div className="w-[30%] h-full  flex justify-center items-center">
              <img src="/menu-button.png" className=" w-4 h-4" alt="" />
            </div>
            <div
              onClick={() => navigate("/admin/dash")}
              className="w-[70%]  h-full flex  items-center "
            >
              <p className="ml-2 text-[12px] font-inter font-semibold ">
                DASHBOARD
              </p>
            </div>
          </div>
          <div
            onClick={() => navigate("/admin/manageUser")}
            className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl w-full h-16  mt-1 flex  items-center"
          >
            <div className="w-[30%] h-full  flex justify-center items-center ">
              <img src="/userDash.png" className=" w-4 h-4" alt="" />
            </div>
            <div className="w-[70%]  h-full flex  items-center">
              <p className="ml-2 text-[12px] font-inter font-semibold ">USER</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/admin/Plan")}
            className=" cursor-pointer  transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl w-full h-16  mt-1 flex justify-center items-center"
          >
            <div className="w-[30%] h-full  flex justify-center items-center ">
              <img src="/money-flow.png" className="w-4 h-4" alt="" />
            </div>
            <div className="w-[70%]  h-full flex  items-center">
              <p className="ml-2 text-[12px] font-inter font-semibold ">PLAN</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/subscriber")}
            className="cursor-pointer  transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl w-full h-16  mt-1 flex justify-center items-center"
          >
            <div className="w-[30%] h-full  flex justify-center items-center ">
              <img src="/press-button.png" className=" w-5 h-5" alt="" />
            </div>
            <div className="w-[70%]  h-full flex  items-center">
              <p className=" text-[12px] ml-1  font-inter font-semibold ">
                SUBSCRIBERS
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/Abuse")}
            className="cursor-pointer  transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl w-full h-16  mt-1 flex justify-center items-center "
          >
            <div className="w-[30%] h-full  flex justify-center items-center ">
              <img src="/account.png" className=" w-5 h-5" alt="" />
            </div>
            <div className="w-[70%]  h-full flex  items-center">
              <p className="text-[12px] ml-1  font-inter font-semibold ">
                ABUSE
              </p>
            </div>
          </div>
          <div
            onClick={handleLogOut}
            className="cursor-pointer  transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl shadow-theme-blue w-full h-16  mt-1 flex justify-center items-center"
          >
            <div className="w-[30%] h-full  flex justify-center items-center ">
              <img src="/logout.png" className=" w-5 h-5" alt="" />
            </div>
            <div className="w-[70%]  h-full flex  items-center">
              <p className="text-[12px] ml-1  font-inter font-semibold ">
                LOGOUT
              </p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

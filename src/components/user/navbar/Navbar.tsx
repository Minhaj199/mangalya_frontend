import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertWithOk, handleAlert } from "../../../utils/alert/SweeAlert";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "@/types/typesAndInterfaces";
import { useSocket } from "@/shared/hoc/GlobalSocket";
import { request } from "@/utils/axiosUtil"; 
import { showToast } from "@/utils/alert/toast";

export const Navbar = ({
  active,
  setShowRequest,
  setLoading
}: {
  active: string;
  setShowRequest?: Dispatch<SetStateAction<boolean>>;
  setLoading?:Dispatch<SetStateAction<boolean>>
}) => {
  const socket = useSocket();
  const [messageTab, setMessageTab] = useState(false);
  const [image, setImage] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const [messageNumber, setMessageNumber] = useState(0);
  const [ids, setIds] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<
    { userId: string; name: string; count: number }[]
  >([]);
  const userphoto = useSelector((state: IReduxState) => state.userData.photo);
  useEffect(() => {
    if (userphoto) {
      setImage(userphoto || "");
    }
  }, [userphoto]);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const fetch: {
          newMessagesForNav: { count: number; ids: string[] };
          newMessagesNotifiation: {
            name: string;
            count: number;
            userId: string;
          }[];
        } = await request({ url: "/user/countMessages?from=nav" });
        setMessageNumber(fetch?.newMessagesForNav.count);
        if (
          fetch?.newMessagesForNav.ids &&
          fetch?.newMessagesForNav.ids.length > 0
        ) {
          setIds(fetch.newMessagesForNav.ids);
        }
        setNewMessage(fetch.newMessagesNotifiation);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === "token expired") {
            handleAlert("error", error.message);
            setTimeout(() => {
              handleLogout();
            }, 2000);
          } else {
            console.error(error);
            handleAlert("error", error.message);
          }
        }
      }
    };
    fetchMessage();
  }, []);
  useEffect(() => {
    socket?.on("addMessageCount", (data: { id: string; name: string }) => {
      if (data?.id) {
        setIds((el) => (ids?.length > 0 ? [...el, data.id] : [data.id]));
        setMessageNumber((el) => el + 1);
        const isDuplicate = newMessage.some((mgs) => mgs.userId === data.id);
        if (isDuplicate) {
          setNewMessage((prev) =>
            prev?.map((elem) => {
              if (elem.userId === data.id) {
                return {
                  ...elem,
                  count: elem.count >= 99 ? 99 : elem.count + 1,
                };
              } else {
                return elem;
              }
            })
          );
        } else {
          setNewMessage((prev) => [
            ...(prev || []),
            { count: 1, name: data.name, userId: data.id },
          ]);
        }
        showToast(`new message from ${data.name}`, "info", 2000);
      }
    });

    return () => {
      socket?.off("addMessageCount");
    };
  }, [newMessage, socket]);

  const dispatch = useDispatch();
  const userData = useSelector((state: IReduxState) => state.userData);

  function handleLogout() {
    try {
      if(setLoading){
        alert('here')
        setLoading(true)
      }
      setTimeout(() => {
        setImage("");
        dispatch({ type: "CLEAR_DATA" });
        if (socket) {
          socket.emit("userLoggedOut", {
            token: localStorage.getItem("userRefresh"),
          });
        }
        localStorage.removeItem("userToken");
        localStorage.removeItem("userRefresh");

        handleAlert("warning", "User logged out");
         if (setLoading) setLoading(false)
        navigate("/");
      },2000);
    } catch (error) {
      if (error instanceof Error) {
        handleAlert("error", error.message || "internal server error");
      }
     if (setLoading) setLoading(false)
    }
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  async function protectSearch() {
    if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "Not subscribed"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your are not subscribed!!! you cannot use this option",
        "info"
      );
      return;
    } else if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "expired"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your plan is expired !!! you cannot use this option",
        "info"
      );
      return;
    }

    navigate("/search", { state: { from: "search" } });
  }
  function ProtectSuggestion() {
    if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "Not subscribed"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your are not subscribed!!! you cannot use this option",
        "info"
      );
      return;
    } else if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "expired"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your plan is expired !!! you cannot use this option",
        "info"
      );
      return;
    }
    navigate("/suggestion", { state: { from: "suggestion" } });
  }

  async function handleMatchProfile() {
    if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "Not subscribed"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your are not subscribed!!! you cannot use this option",
        "info"
      );
      return;
    } else if (
      userData?.subscriptionStatus &&
      userData.subscriptionStatus === "expired"
    ) {
      alertWithOk(
        "Subscritpion",
        "Your plan is expired !!! you cannot use this option",
        "info"
      );
      return;
    }
    navigate("/match");
  }
  function handleRequestOption() {
    toggleMenu();
    if (setShowRequest) setShowRequest(true);
  }
  function handleMessageTabToggle() {
    setMessageTab((prev) => !prev);
  }
  function goToChat(id: string) {
    setNewMessage((prev) => prev?.filter((elem) => elem.userId !== id));
    navigate("/chat", { state: { id: id } });
  }

  return (
    <>
      <nav className="w-[99%] fixed top-4 z-[1] left-1 rounded-full right-0 h-16 flex  bg-white border shadow-md overflow-hidden">
        <div className="sm:w-[60%] w-[30%] flex ">
          <div className="lg:hidden relative w-20 h-full flex justify-center items-center">
            {/* Toggle icon with onClick handler */}
            <img
              src="./menu-bar.png"
              className="w-10 p-1 cursor-pointer"
              alt="Toggle menu"
              onClick={toggleMenu}
            />
            {/* {(messageNumber>=1)&&<div className="w-6 h-6 text-xs rounded-full right-0 top-0 bg-yellow-600 absolute inline-flex justify-center items-center font-bold text-white">{(messageNumber>10)?'10+':messageNumber}</div>} */}
          </div>

          <div className="w-[67%] lg:flex hidden py-3 sm:pl-10">
            <ul className="flex text-sm gap-5">
              <li
                onClick={() =>
                  navigate("/loginLanding", { state: { from: "profile" } })
                }
                className={
                  active === "profile"
                    ? "border-b-2 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter"
                    : "bg-slate-300  rounded-full cursor-pointer hover:bg-slate-300 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"
                }
              >
                Profiles
              </li>
              <li
                onClick={ProtectSuggestion}
                className={
                  active === "suggestion"
                    ? "transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer   text-xs text-dark-blue font-semibold bg-blue-300 rounded-full w-32 h-10 inline-flex justify-center items-center  font-inter"
                    : " bg-slate-300  rounded-full hover:bg-slate-400 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center  text-xs  font-inter"
                }
              >
                suggestion
              </li>

              <li
                onClick={protectSearch}
                className={
                  active === "search"
                    ? " transform transition-transform duration-300 ease-in-out hover:scale-105  cursor-pointer font-semibold text-dark-blue w-32 h-10 inline-flex justify-center items-center bg-blue-300 rounded-full    text-xs  font-inter"
                    : "bg-slate-300  rounded-full hover:bg-slate-400 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer w-32 h-10 inline-flex justify-center items-center   text-xs  font-inter"
                }
              >
                Search
              </li>

              <li
                onClick={handleMatchProfile}
                className={
                  active === "matched"
                    ? "transform relative transition-transform duration-300 ease-in-out hover:scale-105   cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center font-semibold text-dark-blue bg-blue-300 rounded-full items-center"
                    : " bg-slate-300   rounded-full hover:bg-slate-400 relative transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rounded-full cursor-pointer  text-xs  font-inter w-32 h-10 inline-flex justify-center items-center"
                }
              >
                Matched Profiles
                {/* {(messageNumber>=1)&&<div className="w-6 h-6 text-xs rounded-full -right-2 -top-1 bg-yellow-600 absolute inline-flex justify-center items-center font-bold text-white">{(messageNumber>10)?'10+':messageNumber}</div>} */}
              </li>
            </ul>
          </div>
        </div>
        <div className="sm:w-[40%] w-[70%]   justify-end mr-1 flex items-center flex-row">
          {userData.subscriptionStatus &&
            userData.subscriptionStatus !== "" &&
            userData.subscriptionStatus !== "subscribed" && (
              <button
                type="button"
                onClick={() => navigate("/PlanDetails")}
                className="sm:block hidden mr-10 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 my-2 text-center me-2 mb-2"
              >
                PREMIUM
              </button>
            )}
          <div className="w-10 h-10 mx-5">
            <img
              src="/email.png"
              onClick={handleMessageTabToggle}
              className="w-full cursor-pointer relative  h-full"
              alt=""
            />
            {messageNumber >= 1 && (
              <div className="w-6 h-6 text-xs rounded-full  top-1 bg-yellow-600 absolute inline-flex justify-center items-center font-bold text-white">
                {messageNumber > 10 ? "10+" : messageNumber}
              </div>
            )}
          </div>
          <p
            className="transform transition-transform duration-300 ease-in-out hover:scale-105 font-aborato font-extrabold mr-1 text-xs  cursor-pointer sm:mb-0"
            onClick={handleLogout}
          >
            LOG OUT
          </p>
          <div className=" sm:w-12 sm:h-12 w-10 h-10 rounded-[50%]">
            <img
              onClick={() => navigate("/userProfile")}
              src={image ? image : "/profile.png"}
              className=" cursor-pointer rounded-full w-full h-full"
              alt="Profile"
            />
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed top-20  left-4 rounded-2xl w-[50%] border-l border-r border-b bg-gray-400 z-[1] text-black p-4 lg:hidden">
          <ul className="flex flex-col items-start w-full h-full  ">
            <li
              className="cursor-pointer py-2 text-sm hover:text-blue-500  "
              onClick={() => (toggleMenu(), navigate("/loginLanding"))}
            >
              Profiles
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer py-2 text-sm"
              onClick={() => (toggleMenu(), ProtectSuggestion())}
            >
              Suggestions
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer py-2 text-sm"
              onClick={() => (toggleMenu(), protectSearch())}
            >
              Search
            </li>
            {userData.subscriptionStatus &&
              userData.subscriptionStatus !== "" &&
              userData.subscriptionStatus !== "subscribed" && (
                <li
                  className="hover:text-blue-500 cursor-pointer py-2 text-sm"
                  onClick={() => (toggleMenu(), navigate("/PlanDetails"))}
                >
                  Plan purchase
                </li>
              )}

            <li
              className="hover:text-blue-500 cursor-pointer py-2 text-sm inline-flex"
              onClick={() => (toggleMenu(), handleMatchProfile())}
            >
              Matched Profiles
            </li>
            {userData.subscriptionStatus !== "Not subscribed" && (
              <li
                className="hover:text-blue-500 cursor-pointer py-2 text-sm inline-flex"
                onClick={() => (toggleMenu(), navigate("/planAndRequest"))}
              >
                Plan Datails
              </li>
            )}
            {active === "profile" && (
              <li
                className="hover:text-blue-500 cursor-pointer py-2 text-sm inline-flex"
                onClick={handleRequestOption}
              >
                Requests
              </li>
            )}
          </ul>
        </div>
      )}

      {messageTab && (
        <div className="fixed top-20  right-4 rounded-2xl sm:w-[400px] w-[300px] cursor-pointer  justify-evenly  border-l max-h-52 overflow-y-auto border-r border-b bg-white z-[1] text-black p-4 ">
          <p className="mb-6 ml-2 font-jakarta text-yellow-950">New messages</p>
          {newMessage?.map((el) => {
            return (
              <div
                onClick={() => goToChat(el.userId)}
                className="w-full h-8 bg-blue-200 rounded-full justify-between flex items-center px-3 text-blue-600  mb-3"
              >
                <p>{el.name}</p>
                <div className=" w-5 h-5 bg-blue-600 rounded-full flex justify-center items-center">
                  <p className="text-xs text-white">{el.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

import { Footer } from "@/components/user/footer/Footer";
import { NavbarForPlan } from "@/components/user/navbar/NavbarForPlan";
import { useSocket } from "@/shared/hoc/GlobalSocket";
import { showToast } from "@/utils/alert/toast";
import { request } from "@/utils/AxiosUtils";
import { dateToDateInputGenerator } from "@/utils/dateToDateInputGenerator";
import { currentPlan } from "@/utils/editedDataFinder";

import { useEffect, useState } from "react";

export const PlanHistoryAndReq = () => {
  const socket = useSocket();
  const [toggle, setToggle] = useState<boolean>(false);
  const [currenPlan, setCurrentPlan] = useState<currentPlan>();
  const [previousePlan, setPreviousePlan] = useState<currentPlan[]>([]);
  const [requestArray, setRequestArray] = useState<requtest[]>([]);

  type requtest = {
    _id: string;
    status: string;
    typeOfRequest: string;
    name: string;
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const response: {
          request: requtest[];
          plan: currentPlan;
          history: currentPlan[];
        } = await request({ url: "/user/planHistoryAndRequest" });
        setCurrentPlan(response.plan);
        setPreviousePlan(response.history);
        setRequestArray(response.request);
        function handleFuncton(data: {
          name: string;
          from: "accept" | "reject";
        }) {
          if (data.from === "accept") {
            showToast(
              `${data.name ? data.name : "partner"} accepted your request`
            );
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
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);
  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <>
      <div className="w-full h-full p-4">
        <NavbarForPlan toggle={toggle} setToggle={setToggle} />
        {toggle && (
          <div className=" w-[100%] h-screen bg-green-400 overflow-y-auto no-scrollbar rounded-3xl">
            {requestArray.length > 0 ? (
              <div className="w-full max-w-4xl  mt-10 p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-t-lg">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[20%]">
                          number
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[50%]">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[30%]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestArray?.length > 0 &&
                        requestArray?.map((elem, index) => {
                          return (
                            <tr
                              key={elem._id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 text-gray-800">
                                {index + 1}
                              </td>
                              <td className="py-3 px-4 text-gray-800">
                                {elem.name}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`${getBadgeColor(
                                    elem.status
                                  )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                                >
                                  {elem.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="w-[100%] h-32 bg-red-400 flex justify-center items-center font-aborato text-white sm:text-3xl text-lg">
                No request available
              </div>
            )}
          </div>
        )}
        {!toggle && (
          <div className=" flex justify-center items-center w-[100%] h-screen bg-blue-400 px-3 rounded-3xl pb-2 pt-10">
            <div className=" md:w-[100%]  w-full md:rounded-none rounded-3xl gap-x-3 h-full grid     lg:grid-cols-2  overflow-y-auto no-scrollbar ">
              {currenPlan?.name && (
                <div className="md:w-[40%] mb-10 w-[100%] h-60 bg-white mt-5 rounded-2xl lg:col-span-2 ">
                  <div className="w-full h-10 px-3 bg-green-400 rounded-t-lg flex   justify-center items-center">
                    <p className="text-white font-aborato">Current plan</p>
                  </div>
                  <div className="w-full h-12   flex justify-between px-2 items-center font-inter text-dark-blue">
                    <p className="font-bold">{currenPlan.name}</p>
                    <p className="text-lg font-semibold">
                      ₹{(currenPlan?.amount / currenPlan.duration).toFixed(0)}/m
                    </p>
                  </div>
                  <div className="w-full h-28  rounded-b-lg flex">
                    <div className="w-1/2 h-full  px-1 font-inter">
                      <div className="w-full h-8 text-blue-500  flex justify-center items-center font-semibold">
                        Detials
                      </div>
                      <p className="flex justify-between">
                        connect:{" "}
                        <span>
                          {currenPlan.avialbleConnect}/{currenPlan.connect}
                        </span>
                      </p>
                      <p className="flex justify-between mt-3">
                        expiry:{" "}
                        <span>
                          {dateToDateInputGenerator("", currenPlan.Expiry)}
                        </span>
                      </p>
                    </div>
                    <div className="w-1/2 h-full pl-10  ">
                      <div className="w-full h-8 text-blue-500 overflow-y-auto no-scrollbar  flex justify-center items-center font-semibold">
                        Features
                      </div>
                      <ul className="font-acme">
                        {currenPlan.features?.map((el, index) => {
                          return (
                            <li className="flex " key={index}>
                              <img
                                src="./tick.png"
                                className="w-5 h-5"
                                alt=""
                              />{" "}
                              <span className="ml-2">{el}</span>{" "}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {previousePlan?.length > 0 &&
                previousePlan?.map((elem, index) => {
                  return (
                    <div
                      key={index}
                      className="md:w-[80%] w-[100%] h-60 bg-white mt-5 rounded-2xl  "
                    >
                      <div className="w-full h-10 px-3 bg-gray-500 rounded-t-lg flex   justify-center items-center">
                        <p className="text-white font-aborato">Previous plan</p>
                      </div>
                      <div className="w-full h-12   flex justify-between px-2 items-center">
                        <p className="font-bold font-serif text-yellow-950">
                          {elem.name}
                        </p>
                        <p className="text-lg font-semibold">
                          ₹{(elem?.amount / elem.duration).toFixed(0)}/m
                        </p>
                      </div>
                      <div className="w-full h-28  rounded-b-lg flex">
                        <div className="w-1/2 h-full  px-1">
                          <div className="w-full h-8 text-gray-700  flex justify-center items-center font-semibold">
                            Detials
                          </div>
                          <p className="flex justify-between">
                            connect <span>{elem.avialbleConnect}</span>
                          </p>
                          <p className="flex justify-between mt-3">
                            expiry{" "}
                            <span>
                              {dateToDateInputGenerator("", elem.Expiry)}
                            </span>
                          </p>
                        </div>
                        <div className="w-1/2 h-full pl-10  ">
                          <div className="w-full h-8 text-gray-700 overflow-y-auto no-scrollbar  flex justify-center items-center font-semibold">
                            Features
                          </div>
                          <ul className="font-acme">
                            {elem.features.map((elem, index) => {
                              return (
                                <li className="flex " key={index}>
                                  <img
                                    src="./tick.png"
                                    className="w-5 h-5"
                                    alt=""
                                  />{" "}
                                  <span className="ml-2">{elem}</span>{" "}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

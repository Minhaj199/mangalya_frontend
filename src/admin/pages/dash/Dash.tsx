import { useEffect, useState } from "react";
import { DashCard } from "./DashCard";

import PieChart from "./graphs/PieChart";
import BarChart from "./graphs/BarGraph";
import { alertWithOk } from "../../../utils/alert/SweeAlert";
import { request } from "../../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "@/components/circularLoading/Circular";

const Dash = () => {
  const [dashCount, setDashCount] = useState<{
    revenue: number;
    suscriber: number;
    user: number;
  }>();
    const [loading,setLoading]=useState<boolean>(false)
  const navigate = useNavigate();
  useEffect(() => {
    async function FetchData() {
      try {
        setLoading(true)
        const response: {
          MonthlyRevenue: number;
          SubscriberCount: number;
          UserCount: number;
          message: string;
        } = await request({ url: "/admin/getDataToDash?from=dashCount" });

        if (response.message) {
          throw new Error(response.message);
        }
        setDashCount({
          revenue: response.MonthlyRevenue,
          suscriber: response.SubscriberCount,
          user: response.UserCount,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === "405") {
            navigate("/login");
            return;
          }
          alertWithOk("Dash error", error.message || "error on dash", "error");
        }
      }finally{
        setLoading(false)
      }
    }
    FetchData();
  }, []);
  return (
    <>
     {loading && (
            <div className="w-full flex items-center justify-center  h-full  fixed bg-[rgba(255,255,255,0)] z-50">
              <CircularIndeterminate />
            </div>
          )}

    <div className=" w-[100%] lg:w-[80%] flex flex-col  pl-5">
      <div className="w-[100%]   sm:mt-10 mt-20 grid h-auto lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-4  pr-1">
        <DashCard
          Data={dashCount?.revenue || 0}
          Title={"TOTAL REVENUE"}
          img="/dollar.png"
        />
        <DashCard
          Data={dashCount?.suscriber || 0}
          Title={"SUBSCRIBER COUNT"}
          img="/subcribe.png"
        />
        <DashCard
          Data={dashCount?.user || 0}
          Title={"USER COUNT"}
          img="/profileDash.png"
        />
      </div>

      <div className="lg:w-[70%] w-[90%] lg:h-[400px] h-[300px] rounded-md bg-white transform transition-transform duration-300 ease-in-out hover:scale-105    mt-10">
        <BarChart setLoading={setLoading}/>
      </div>
      <div className="lg:w-[100%] flex lg:justify-end   pr-2  w-[100%]   h-[400px] pb-10  transform transition-transform duration-300 ease-in-out hover:scale-105    mt-16">
        <div className="sm:w-[50%]  w-[100%] lg:ml-0 ml-10 h-full rounded-2xl bg-white overflow-hidden ">
          <PieChart setLoading={setLoading} />
        </div>
      </div>
    </div>
    </>
  );
};
export default Dash;

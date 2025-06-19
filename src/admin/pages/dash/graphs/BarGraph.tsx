import  React, {  useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { request } from "@/utils/axiosUtilsTemp"; 
import { IDashChildProb } from "@/types/typesAndInterfaces";


ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const LineChart:React.FC<IDashChildProb> = ({setLoading}) => {
  const [datas, setData] = useState<{ month: number[]; revenue: number[] }>();

  useEffect(() => {
    async function FetchData() {
      try {
        setLoading(true)
        const response: { month: number[]; revenue: number[] } = await request({
          url: "/admin/getDataToDash?from=Revenue",
        });
        setData({ month: response.month, revenue: response.revenue });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{
        setLoading(false)
      }
    }
    FetchData();
  }, []);

  const data = {
    labels: datas?.month,
    datasets: [
      {
        label: "Revenue",
        data: datas?.revenue,
        borderColor: "#007bff",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "#990000",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Revenue of last 7 days",
        align: "start",
        font: { size: 20, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 250,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="w-[100%] m-auto p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: "bold", margin: 0, color: "teal" }}></h2>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

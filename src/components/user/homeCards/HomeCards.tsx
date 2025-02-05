import { useEffect, useState } from "react";
import { request } from "../../../utils/AxiosUtils";
import { Dispatch, SetStateAction } from "react";

export interface Toggle {
  setToggle: Dispatch<SetStateAction<string>>;
}

export const HomeCards = ({ setToggle }: Toggle) => {
  type newAddedData = {
    name: string;
    age: number;
    image: string;
    place: string;
  };
  const [fetchedData, setFetechedData] = useState<newAddedData[]>([
    { name: "", age: 0, image: "", place: "" },
  ]);
  useEffect(() => {
    const fetchNewAdded = async () => {
      const data: newAddedData[] = await request({
        url: "/user/fetchforLanding",
      });
      setFetechedData(data);
    };
    fetchNewAdded();
  }, []);

  return (
    <>
      <div className="w-[100%]   h-[100px] bg-[#f0f5f9] flex justify-center items-center">
        <p className="text-base sm:text-xl lg:text-3xl text-[#0b3e80] fin font-aborato">
          OUR NEW MEMBERS
        </p>
      </div>
      <div className=" px-10 py-10 bg-center grid grid-cols-1 bg-[#f0f5f9]   md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-4 gap-10  ">
        {fetchedData.map((el, index) => (
          <div
            key={index}
            onClick={() => (
              window.scrollTo({ top: 0, behavior: "smooth" }), setToggle("2")
            )}
            className="w-[250px] shadow-lg cursor-pointer sm:m-0 m-auto  h-[300px] relative overflow-hidden group  "
          >
            <img
              className="shadow- w-full h-full"
              src={el.image !== "" ? el.image : "./defualtImage.jpg"}
              alt=""
            />
            <div className="absolute w-full h-full bg-[rgba(0,0,0,0.8)] top-0 -translate-y-full text-white flex flex-col justify-center items-center transition-transform duration-500 ease-in-out group-hover:translate-y-0">
              <p className="text-xl">{el.name}</p>
              <p className="">
                {el.age} years age {el.place}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

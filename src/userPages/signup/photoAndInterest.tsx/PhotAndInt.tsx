import React, {
  useRef,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { PhotoAndInterest } from "../Credentials";
import { request } from "../../../utils/AxiosUtils";

import { alertWithOk } from "@/utils/alert/SweeAlert";

interface PhotAndIntInterface {
  probState: PhotoAndInterest;
  probSetter: Dispatch<SetStateAction<PhotoAndInterest>>;
}

export const PhotAndInt: React.FC<PhotAndIntInterface> = ({ probSetter }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const interestCount = useRef(0);
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    probSetter((el) => ({ ...el, interest: selected }));
  }, [selected, image]);
  type interestType = { sports: string[]; music: string[]; food: string[] };

  const [enablingTypesOfInterest, setEnablingTypesOfInterest] =
    useState<boolean>(false);
  const [handleChange, setHandleChang] = useState<string[]>([""]);

  const [interest, setInterest] = useState<interestType>({
    sports: [""],
    music: [""],
    food: [""],
  });
  useEffect(() => {
    async function fetectInterst() {
      try {
        const response: { Data: interestType; message: string } = await request(
          { url: "/user/getInterest" }
        );

        if (response.message && typeof response.message === "string") {
          throw new Error(response.message || "Error occured interest getting");
        }
        if (response.Data) {
          setInterest(response.Data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          alertWithOk(
            "photo and interest updation",
            error.message || "internal server error",
            "error"
          );
        }
      }
    }
    fetectInterst();
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  function handleFile(t: React.ChangeEvent<HTMLInputElement>) {
    if (t.target.files?.length && t.target.files?.length > 0) {
      const file = t.target.files[0];
      probSetter((el) => ({ ...el, photo: file }));
      const imageUrl = URL.createObjectURL(t.target.files?.[0]);
      setImage(imageUrl);
    }
  }
  function handleCategoryInterest(t: React.ChangeEvent<HTMLSelectElement>) {
    if (t.target.value) {
      if (!enablingTypesOfInterest) {
        setEnablingTypesOfInterest(true);
      }
      if (t.target) {
        const key = t.target.value;

        if (key === "sports" || key === "music" || key === "food") {
          setHandleChang(interest[key]);
        }
      }
    } else {
      setEnablingTypesOfInterest(false);
    }
  }
  function handleAddInterest(t: React.ChangeEvent<HTMLSelectElement>) {
    if (t.target.value && !selected.includes(t.target.value)) {
      setSelected((el) => [...el, t.target.value]);
      interestCount.current++;
    }
    if (interestCount.current === 5) {
      setHandleChang([]);
    }
  }
  function handleRemove(item: string) {
    setSelected((el) => {
      return el.filter((el) => el !== item);
    });
    interestCount.current--;
  }

  function resetPhoto() {
    probSetter((el) => ({ ...el, photo: null }));
  }
  return (
    <div className="w-5/6 h-72 sm:mt-0 flex">
      <div
        id="photo"
        className="flex flex-col justify-center cursor-pointer items-center w-1/3 h-full "
      >
        <div
          className="sm:h-32 sm:w-32 h-16 w-16 border border-theme-blue rounded-full bg-gray-950 absolute"
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden"
            accept="image/*"
          />
          <img
            className="w-full h-full rounded-full"
            src={image ? image : "/photoUpload.png"}
            alt=""
          />
          {!image && (
            <img
              className="sm:w-7 sm:left-24 sm:h-7 relative bottom-5 w-4 h-4"
              src="/photo-camera-interface-symbol-for-button.png"
              alt=""
            />
          )}
          {image && (
            <img
              className="sm:w-7 sm:left-24 sm:h-7 relative bottom-5 w-4 h-4"
              src="/deleteRemove.png"
              onClick={() => (setImage(null), resetPhoto())}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="w-2/3 h-full  flex flex-col">
        <div className="w-full h-[40%] items-center  flex sm:justify-normal  justify-between ">
          {interestCount.current !== 5 && (
            <select
              name=""
              id=""
              onChange={(t) => handleCategoryInterest(t)}
              className="sm:w-[30%] w-[50%]   h-9 outline-none border border-theme-blue"
            >
              <option value="">Interst Category</option>
              {Object.keys(interest).map((key, index) => {
                return (
                  <option key={index} value={key}>
                    {key}
                  </option>
                );
              })}
            </select>
          )}
          {enablingTypesOfInterest && (
            <select
              name=""
              id=""
              className="sm:w-[30%] w-[50%]    ml-10 h-9 outline-none border border-theme-blue"
              onChange={handleAddInterest}
            >
              <option value="">Interst</option>
              {handleChange.map((el, index) => {
                return (
                  <option key={index} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        <div className="w-full sm:h-[60%] h-72 sm:mt-0 mt-14 mb-10 bg-white border border-theme-blue">
          {selected.length > 0 &&
            selected.map((el, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full h-8 bg-slate-200 mt-1"
                >
                  <p>
                    {index + 1}:{el}
                  </p>
                  <img
                    src="/remove.png"
                    className="w-4 h-4 mr-1 cursor-pointer"
                    onClick={() => handleRemove(el)}
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

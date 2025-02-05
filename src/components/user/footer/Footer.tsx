

export const Footer = () => {
  
  return (
    <div className="w-[100%] h-72 bg-[#0b3e80] flex text-base">
      
        <div className="w-1/4 sm:w-1/3 h-full sm:px-5 py-10   ">
        <div className="sm:w-44 sm:h-16 w-20 ">

          <img
            className="w-full h-full cursor-pointer"
            src="/logo-no-background.png"
            alt="x"
          />
        </div>
        </div>
        <div className="w-1/3 h-full ">
          <div className="w-full h-1/5 text-white flex justify-center    items-end">
            <p className="mr-16 text-sm sm:text-base">OFFICES</p>
          </div>
          <div className="w-full h-4/5 text-xs sm:text-base">
            <ul className="grid gap-1 grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-row-2 p-5">
              <li className="text-white mt-3">KOLLAM</li>
              <li className="text-white mt-3">MALAPPURAM</li>
              <li className="text-white mt-3">KASARGODE</li>
              <li className="text-white mt-3">ERANAKULAM</li>
              <li className="text-white mt-3">EDIKI</li>
              <li className="text-white mt-3">KOTTAYAM</li>
            </ul>
          </div>
        </div>
        <div className="w-1/3 h-full ">
          <div className="w-full h-1/5 text-white flex justify-center items-end text-sm sm:text-base">
            Contact us
          </div>
          <div className=" sm:w-full  h-3/5 sm:fh-full overflow-hidder   text-white sm:p-5 ">
            <p className="break-words text-xs sm:text-base sm:mt-0 mt-6">
              123 STREET,SAMPLE,MALAPPURAM KERALA INIDA SAMPLE@GMAIL .COM
            </p>
          </div>
        </div>
     
    </div>
  );
};

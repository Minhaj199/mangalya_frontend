
import { Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"



export const NavbarForPlan=({toggle,setToggle}:{toggle:boolean,setToggle:Dispatch<SetStateAction<boolean>>})=>{
const navigate=useNavigate()    
    return(
        <div className='w-full h-28  flex'>
        <div className='sm:w-20 sm:h-20 w-14 h-14'>
        <img className="w-full h-full" src="/logoBlack2.png" alt="" />
        </div>
        <div className='w-[80%] h-full  flex justify-center items-center'>
          <div className='sm:w-80 w-56 h-14 p-2 rounded-full bg-blue-300 flex'>
            <div onClick={()=>setToggle(false)} className={`cursor-pointer w-1/2 h-full  ${(toggle===false)?'rounded-full bg-white text-black ':'text-white'} transition-all duration-500  ease-in-out  flex justify-center items-center  font-semibold font-aborato sm:text-base text-sm`}>History</div>
            <div onClick={()=>setToggle(true)} className={`cursor-pointer w-1/2 h-full  flex justify-center ${(toggle===true)?'rounded-full bg-white text-black ':'text-white'} transition-all duration-500  ease-in-out items-center  font-semibold font-aborato sm:text-base text-sm`}>Requests</div>
          </div>
          
        </div>
        <div onClick={()=>navigate('/loginLanding')} className="cursor-auto h-full flex justify-center items-center text-blue-900 font-bold"> <p className="text-center">BACK</p></div>
      

        </div>
    )
}
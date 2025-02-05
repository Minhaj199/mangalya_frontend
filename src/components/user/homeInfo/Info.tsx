import React from 'react'
import { Toggle } from '../homeCards/HomeCards'

export const Info = ({setToggle}:Toggle) => {
    function handleScroll(){
        window.scrollTo({ top: 0, behavior: "smooth" })
        setToggle('2')
      }
 
    return (
    <div className='w-full h-full flex pb-20 justify-between items-center flex-col relative'>
        <div className='w-full h-36 flex justify-center items-center '>
            <h4 className='text-3xl font-bold font-aborato text-red-400'>FIND YOUR PARTNER</h4>
        </div>
        <div className='w-[90%]    grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-2 grid-cols-1'>
        
        
        
        <div className='w-full h-[400px] ' onClick={handleScroll}>
                <div  className='w-full h-[70%] cursor-pointer   flex justify-center items-center'>
                    <div className='w-[200px] relative flex justify-center items-center h-[200px] bg-[#0595fc] transition-colors ease-in-out duration-[.9s]  hover:bg-[#002bad] rounded-full'>
                        <div className='w-[75px] rounded-full h-[75px] bg-red-400'>
                            <img src="/registered-document.png" className='w-full h-full' alt="" />
                        </div>
                    <div className='absolute w-9 h-9 rounded-full -bottom-3 bg-white border flex justify-center items-center font-black font-roboto text-red-400 text-xl'>1</div>
                    </div>
                </div>
                <div className=' w-full h-[30%]'>
                    <p className='text-2xl text-theme-blue font-semibold text-center hover:underline transition-all ease-in-out duration-[.9s]'>Sign Up</p>
                    <p className=' text-gray-600  text-center font-medium'>Register for free & put up your Matrimony Profile</p>
                </div>
            </div>
           
           
            <div className='w-full h-[400px] ' onClick={handleScroll}>
            <div className='w-full h-[70%] cursor-pointer   flex justify-center items-center'>
                    <div className='w-[200px] relative flex justify-center items-center h-[200px] bg-[#0595fc] transition-colors ease-in-out duration-[.9s]  hover:bg-[#002bad] rounded-full'>
                        <div className='w-[75px] rounded-full h-[75px] '>
                            <img src="/userHome.png" className='w-full h-full' alt="" />
                        </div>
                    <div className='absolute w-9 h-9 rounded-full -bottom-3 bg-white border flex justify-center items-center font-black font-roboto text-red-400 text-xl'>2</div>
                    </div>
                </div>
                <div className=' w-full h-[30%]'>
                    <p className='text-2xl text-theme-blue hover:underline font-semibold text-center'>Connect</p>
                    <p className=' text-gray-600  text-center font-medium'>Select & Connect with Matches you like</p>
                </div>
            </div>
           
           
           
            <div className='w-full h-[400px]  ' onClick={handleScroll}>
            <div className='w-full h-[70%] cursor-pointer   flex justify-center items-center'>
                    <div className='w-[200px] relative flex justify-center items-center h-[200px] bg-[#0595fc] transition-colors ease-in-out duration-[.9s]  hover:bg-[#002bad] rounded-full'>
                        <div className='w-[75px] rounded-full h-[75px] '>
                            <img src="/conversation.png" className='w-full h-full' alt="" />
                        </div>
                    <div className='absolute w-9 h-9 rounded-full -bottom-3 bg-white border flex justify-center items-center font-black font-roboto text-red-400 text-xl'>3</div>
                    </div>
                </div>
                <div className=' w-full h-[30%] px-10'>
                    <p className='text-2xl text-theme-blue hover:underline font-semibold text-center'>Interact</p>
                    <p className=' text-gray-600  text-center font-medium'>Become a Premium Member & Start a Conversation</p>
                </div>
            </div>
            
        </div>
        <div onClick={()=> window.scrollTo({ top: 0, behavior: "smooth" })} className='w-16 cursor-pointer p-2 h-16 bottom-2 rounded-full right-2 bg-blue-400 absolute'>
            <img src="./up-arrow.gif" className='w-full h-full rounded-full' alt="" />
        </div>
    </div>
  )
}

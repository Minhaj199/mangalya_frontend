
import './dash.css'

interface DashCardProps {
  Title: string;
  Data: number;
  img:string
  
}



export function DashCard({ Title, Data,img}: DashCardProps) {
  return (
    <div className='sm:w-[70%] shadow-xl  h-[175px] transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-2xl pt-4 pr-2 bg-white flex justify-between   '>
      <div className='flex flex-col w-[70%]  h-full pt-3 pl-5   left-48'>
        <div className='w-full h-[30%]'>
        <p className=' font-acme font-semibold'>{Title}</p>

        </div>
        <div className='w-full h-[90%] flex justify-center items-center'>
        <p className='text-dark-blue font-acme font-semibold text-2xl'>{Data}</p>

        </div>
      </div>
      <div className='w-10 h-10   left-48'>
        <img src={img} className='w-[100%] h-[100%]'  alt="" />
      </div>
    </div>
  );
}


 

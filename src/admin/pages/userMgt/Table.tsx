import React, {useEffect, useMemo, useState} from 'react';
import { useTable,usePagination} from 'react-table';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

import { Columns } from './UserHeadSchema'
import { TableDataType } from './UserTable'; 

import { request } from '../../../utils/AxiosUtils'; 
import { useNavigate } from 'react-router-dom';
import { alertWithOk, promptSweet } from '../../../utils/alert/SweeAlert'; 

export interface UserListInterface{
  triggerPagination:()=>void
} 


export const UserTable:React.FC = () => {
  const navigate=useNavigate()


  const [MockData,setMockData]=useState<TableDataType[]>([]) 
   function blockUser(id:string,name:string,status:string){
    async  function Handler(){ 

      try {
        const updateStatus=(status==='block')?true:false
        const response:any= await request({url:'/admin/block&Unblock',method:'patch',data:{updateStatus:updateStatus,id}})
        
        if(response.message==='validation Faild'){
          
          navigate('/login')
        }
        if(response?.message){
          setMockData(el=>el.map(user=>(user._id===id)?{...user,block:updateStatus}:user))
          
        } 
      } catch (error:any) {
        if(error.message==='405'){
          navigate('/login')
          return
        }
          alertWithOk('user management',error.message||'error on dash','error')
      }


        
    }
    const text=`Do you want to ${status} ${name} ?`
    const completed=`Your ${status}ing is completed`
    promptSweet(()=>Handler(),text,completed)
  }
  const [searchWord,setSearchWord]=useState<string>('')
  useEffect(()=>{
   async function fetchData (){
    try {
      const MockDataFromDb:any=await request({url:`/admin/fetchUserData?from=user`})
      console.log(MockDataFromDb)
      if(MockDataFromDb?.message==='validation Faild'){
        alertWithOk('Validation',MockDataFromDb.message||'Validation faild','info')
        navigate('/login')
      } 
      setMockData(MockDataFromDb)
    } catch (error:any) {
      if(error.message==='405'){
        navigate('/login')
        return
      }
        alertWithOk('user management',error.message||'error on dash','error')
    }
  
   }
   fetchData()
  },[])

  
  function handleSearch(e:React.ChangeEvent<HTMLInputElement>){
    setSearchWord(e.target.value)
  }
  const filterData=useMemo(()=>{
    
    return MockData.filter(user=>user.username.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()))
  },[searchWord,MockData])
  const columns=useMemo(()=>Columns,[])
  const data=useMemo(()=>filterData??[],[filterData])
 
  
    const { getTableProps, getTableBodyProps, headerGroups,page, nextPage,setPageSize,previousPage,prepareRow,canNextPage,canPreviousPage,pageOptions,state } = useTable({ columns, data,initialState:{pageSize:5} },usePagination);
    const {pageIndex,pageSize}=state
    return (
      <>
      <div className='w-[80%] h-svh'>

        <div className="h-full w-full  flex flex-col items-center">
          <div className="w-full h-[150px] lg:mt-0 mt-10 transform transition-transform duration-300 ease-in-out hover:scale-10   flex justify-center items-center">
            <div className="w-[95%] h-5/6 drop-shadow-lg bg-white rounded-lg flex justify-between items-center ">
            <p className=' ml-5 font-extrabold sm:text-base text-xs  font-inter text-dark-blue'>USER MANAGEMENT</p>
            <input type="search"  value={searchWord} onChange={handleSearch} className="cursor-text bg-white mr-3 h-8 w-20 sm:w-48 pl-2  text-[#2552cc] border border-theme-blue placeholder:text-xs placeholder:text-dark-blue placeholder:font-acme placeholder:font-thin sm:placeholder:text-sm  outline-none " placeholder="Search Here....."/>
          </div>
          </div>
          <div className="w-[90%] h-3/5 mt-10 overflow-auto no-scrollbar ">
          <Paper>
          <Table   {...getTableProps()} className='border-2 border-dark-blue bg-dark-blue'>
            <TableHead  className='bg-dark-blue bottom-2  '>
              {headerGroups.map((headerGroup,index) => (
                <TableRow   {...headerGroup.getHeaderGroupProps()}  key={index}>
                  {headerGroup.headers.map(column => (
                    <TableCell style={{color:'white'}}    {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</TableCell>
                  ))}
                  <TableRow >
                    <p className='text-dark-blue'>

                    Action
                    </p>
                  </TableRow>
                </TableRow>
                
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()} className='bg-gray-200 '>
              {page.map((row,rowIndex) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} key={rowIndex} className='text-start hover:bg-slate-400 '>
                    {row.cells.map(cell => (
                      <TableCell className='text-lg'  {...cell.getCellProps()} >
                        {cell.render('Cell')}</TableCell>
                    ))}
                    {/* <TableCell>
                      <img onClick={()=>handleClick(row.original._id)} className='w-10 h-10 cursor-pointer' src="/info.png" alt="" />
                      
                      </TableCell> */}
                      <TableCell>
                      
                      
                      {!(row.original.block)?<img onClick={()=>blockUser(row.original._id,row.original.username,'block')} src="/user.png"  className='w-5 h-5 cursor-pointer' alt="" />:<img src="/block-user.png" onClick={()=>blockUser(row.original._id,row.original.username,"unblock")} className='w-5 h-5 cursor-pointer' alt="" /> }
                      </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
          </div>
          <div className="w-full h-1/5 flex justify-center items-center">
          <span className='mr-5 sm:mb-0 mb-3'>page{' '} <strong>{pageIndex+1} of {pageOptions.length}</strong>{' '}</span>
            <button  onClick={()=>previousPage()} disabled={!canPreviousPage} className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 sm:mb-0 mb-5" >{'<<'}</button>
            <button onClick={()=>nextPage()} disabled={!canNextPage} className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 ml-1 sm:mb-0 mb-5  font-bold ">{'>>'}</button>
          </div>
        </div>
      </div>
           </> 
      );
}

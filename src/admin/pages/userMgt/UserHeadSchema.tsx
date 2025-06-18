import { Column } from "react-table";
import { TableUserDataType } from "@/types/typesAndInterfaces";

export const  Columns: Column<TableUserDataType>[] = [
    {
      Header: 'no',
      accessor: 'no'  
    },
    {
      Header: 'name',
      accessor: 'username'  
    },
    {
      Header: 'email',
      accessor: 'email'  
    },
    
    {
      Header: 'subscribed',
      accessor: 'subscriber'  
    },
    {
      Header: 'expiry',
      accessor: 'expiry',
    }
  ];
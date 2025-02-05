
  

  import { Column } from "react-table";
import { SubscriberTableDataType } from "./SubscriberTableDataType";
export const  Columns: Column<SubscriberTableDataType>[] = [
    {
      Header: 'no',
      accessor: 'no'  
    },
    {
      Header: 'User',
      accessor: 'username'  
    },
    {
      Header: 'Plan',
      accessor: 'planName'  
    },
    {
      Header: 'Avialble count',
      accessor: 'MatchCountRemaining'  
    },
    
    {
      Header: 'Expiry',
      accessor: 'expiry'  
    },
    {
      Header: 'Plan amount',
      accessor: 'planAmount',
    }
  ];